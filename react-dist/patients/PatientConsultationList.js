import React, { useState, useEffect, useCallback, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { appointmentService, examOrderService, examRecipeResultService, examRecipeService, infoCompanyService, patientService, templateService, ticketService } from "../../services/api/index.js";
import { formatWhatsAppMessage, getIndicativeByCountry, getUserLogged } from "../../services/utilidades.js";
import { createMassMessaging } from "../../funciones/funcionesJS/massMessage.js";
import AdmissionBilling from "../admission/admission-billing/AdmissionBilling.js";
import "https://js.pusher.com/8.2.0/pusher.min.js";
import { useAppointmentStates } from "../appointments/hooks/useAppointmentStates.js";
import { SwalManager } from "../../services/alertManagerImported.js";
import UserManager from "../../services/userManager.js";
export const PatientConsultationList = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPatients, setTotalPatients] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [messaging, setMessaging] = useState(null);
  const [template, setTemplate] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedExamOrder, setSelectedExamOrder] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Estados para el modal de facturación
  const [showBillingDialog, setShowBillingDialog] = useState(false);
  const [selectedBillingAppointment, setSelectedBillingAppointment] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const userLogged = getUserLogged();
  const itemsPerPage = 8;
  const statusOptions = [{
    label: 'Todos',
    value: 'all'
  }, {
    label: 'Pendiente',
    value: 'pending'
  }, {
    label: 'En espera',
    value: 'pending_consultation'
  }, {
    label: 'Llamado',
    value: 'called'
  }, {
    label: 'En proceso',
    value: 'in_consultation'
  }, {
    label: 'Finalizada',
    value: 'consultation_completed'
  }, {
    label: 'Cancelada',
    value: 'cancelled'
  }];
  const {
    appointmentStates
  } = useAppointmentStates();
  const appointmentStatesRef = useRef(appointmentStates);
  useEffect(() => {
    appointmentStatesRef.current = appointmentStates;
  }, [appointmentStates]);
  const fetchPatients = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await patientService.getWithAppointmentsByUserAndFilter({
        per_page: itemsPerPage,
        page: page
      });
      const patientsData = response.original.data.data;
      const processedPatients = procesarPacientes(patientsData);
      setPatients(processedPatients);
      setFilteredPatients(processedPatients);
      setTotalPatients(response.original.data.total);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  const procesarPacientes = pacientes => {
    const hoy = new Date().toISOString().split('T')[0];
    const citasDeHoy = pacientes.flatMap(paciente => {
      return paciente.appointments.filter(cita => cita.appointment_date === hoy).map(cita => {
        const estado = cita.appointment_state.name;
        const esFinalizadaOCancelada = estado === 'consultation_completed' || estado === 'cancelled';
        return {
          paciente: paciente,
          cita: cita,
          estado: estado,
          _esFinalizadaOCancelada: esFinalizadaOCancelada,
          _fechaHoraCita: new Date(`${cita.appointment_date}T${cita.appointment_time}`),
          fullName: `${paciente.first_name || ''} ${paciente.middle_name || ''} ${paciente.last_name || ''} ${paciente.second_last_name || ''}`
        };
      });
    });
    return citasDeHoy.sort((a, b) => {
      if (a._esFinalizadaOCancelada && !b._esFinalizadaOCancelada) return 1;
      if (!a._esFinalizadaOCancelada && b._esFinalizadaOCancelada) return -1;
      return a._fechaHoraCita - b._fechaHoraCita;
    });
  };
  const filterPatients = useCallback(() => {
    const filtered = patients.filter(citaData => {
      let isMatch = true;
      const paciente = citaData.paciente;
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        const nombreCompleto = `${paciente.first_name || ''} ${paciente.middle_name || ''} ${paciente.last_name || ''} ${paciente.second_last_name || ''}`.toLowerCase();
        const documento = paciente.document_number || '';

        // Buscar tanto en el nombre completo como en el documento
        if (!nombreCompleto.includes(searchLower) && !documento.includes(searchText)) {
          isMatch = false;
        }
      }
      if (statusFilter && citaData.estado !== statusFilter && statusFilter !== 'all') {
        isMatch = false;
      }
      return isMatch;
    });
    setFilteredPatients(filtered);
  }, [patients, searchText, statusFilter]);
  useEffect(() => {
    filterPatients();
  }, [filterPatients]);
  useEffect(() => {
    fetchPatients(1);
  }, [fetchPatients]);
  useEffect(() => {
    // @ts-ignore
    const pusher = new Pusher('5e57937071269859a439', {
      cluster: 'us2'
    });
    const hostname = window.location.hostname.split('.')[0];
    const channel = pusher.subscribe('waiting-room.' + hostname);
    channel.bind('appointment.created', data => {
      handleAppointmentCreated(data);
    });
    channel.bind('appointment.state.updated', data => {
      handleAppointmentStateUpdated(data);
    });
    channel.bind('appointment.inactivated', data => {
      handleAppointmentInactivated(data);
    });
    const asyncScope = async () => {
      const tenant = window.location.hostname.split(".")[0];
      const data = {
        tenantId: tenant,
        belongsTo: "turnos-llamadoPaciente",
        type: "whatsapp"
      };
      const companies = await infoCompanyService.getCompany();
      const communications = await infoCompanyService.getInfoCommunication(companies.data[0].id);
      let template;
      try {
        template = await templateService.getTemplate(data);
      } catch (error) {
        console.error('Error al obtener template:', error);
      }
      const infoInstance = {
        api_key: communications.api_key,
        instance: communications.instance
      };
      const messaging = createMassMessaging(infoInstance);
      setMessaging(messaging);
      setTemplate(template);
    };
    asyncScope();
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);
  const handleAppointmentCreated = data => {
    setPatients(prevPatients => {
      const pacienteExistenteIndex = prevPatients.findIndex(p => p.paciente.id === data.appointment.patient_id);
      if (pacienteExistenteIndex !== -1) {
        const pacienteExistente = prevPatients[pacienteExistenteIndex];
        const hoy = new Date().toISOString().split('T')[0];
        if (data.appointment.appointment_date === hoy) {
          const nuevaCita = {
            paciente: pacienteExistente.paciente,
            cita: data.appointment,
            estado: data.appointment.appointment_state.name,
            _esFinalizadaOCancelada: false,
            _fechaHoraCita: new Date(`${data.appointment.appointment_date}T${data.appointment.appointment_time}`),
            fullName: pacienteExistente.fullName
          };
          const updatedPatients = [...prevPatients];
          updatedPatients.push(nuevaCita);
          return updatedPatients;
        }
      }
      return prevPatients;
    });
  };
  const handleAppointmentStateUpdated = data => {
    setPatients(prevPatients => {
      return prevPatients.map(citaData => {
        if (citaData.cita.id === data.appointmentId) {
          const nuevoEstado = appointmentStatesRef.current.find(state => state.id === data.newState);
          return {
            ...citaData,
            cita: {
              ...citaData.cita,
              appointment_state: nuevoEstado
            },
            estado: nuevoEstado.name,
            _esFinalizadaOCancelada: nuevoEstado.name === 'consultation_completed' || nuevoEstado.name === 'cancelled'
          };
        }
        return citaData;
      });
    });
  };
  const handleAppointmentInactivated = data => {
    setPatients(prevPatients => {
      return prevPatients.map(citaData => {
        if (citaData.cita.id === data.appointmentId) {
          const estadoCancelado = appointmentStatesRef.current.find(state => state.name === 'cancelled');
          return {
            ...citaData,
            cita: {
              ...citaData.cita,
              appointment_state: estadoCancelado
            },
            estado: 'cancelled',
            _esFinalizadaOCancelada: true
          };
        }
        return citaData;
      });
    });
  };
  const calculateAge = dateOfBirth => {
    const birthDate = new Date(dateOfBirth);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || monthDifference === 0 && currentDate.getDate() < birthDate.getDate()) {
      age--;
    }
    return age;
  };
  const onPageChange = event => {
    const newPage = event.page + 1;
    fetchPatients(newPage);
  };
  function sendMessageWhatsapp(data, currentAppointment) {
    const replacements = {
      NOMBRE_PACIENTE: `${data?.patient?.first_name ?? ""} ${data?.patient?.middle_name ?? ""} ${data?.patient?.last_name ?? ""} ${data?.patient?.second_last_name ?? ""}`,
      TICKET: `${data?.ticket_number ?? ""}`,
      MODULO: `${data?.module?.name ?? ""}`,
      ESPECIALISTA: `${currentAppointment?.user_availability?.user?.specialty?.name ?? ""}`,
      CONSULTORIO: `${data?.branch?.address ?? ""}`
    };
    const templateFormatted = formatWhatsAppMessage(template?.data?.template, replacements);
    const dataMessage = {
      channel: "whatsapp",
      message_type: "text",
      recipients: [getIndicativeByCountry(data?.patient.country_id) + data?.patient.whatsapp],
      message: templateFormatted,
      webhook_url: "https://example.com/webhook"
    };
    messaging?.sendMessage(dataMessage).then(() => {});
  }
  const llamarPaciente = async (patientId, appointmentId) => {
    //@ts-ignore
    Swal.fire({
      title: '¿Estás seguro de llamar al paciente al consultorio?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, llamar'
    }).then(async result => {
      if (result.isConfirmed) {
        const patient = await patientService.get(patientId);
        const currentAppointment = await appointmentService.get(appointmentId);
        if (currentAppointment) {
          await appointmentService.changeStatus(currentAppointment.id, 'called');
          await ticketService.lastByPatient(patientId).then(response => {
            if (response?.patient?.whatsapp_notifications) {
              sendMessageWhatsapp(response, currentAppointment);
            }
            //@ts-ignore
            Swal.fire('¡Paciente llamado!', 'Se ha llamado al paciente para que se acerque al consultorio.', 'success');
          });
        } else {
          //@ts-ignore
          Swal.fire('Error', 'El paciente no está en espera de consulta.', 'error');
        }
      }
    });
  };
  const handleLoadExamResults = (appointmentId, patientId, productId) => {
    window.location.href = `cargarResultadosExamen?patient_id=${patientId}&product_id=${productId}&appointment_id=${appointmentId}`;
  };
  const handlePDFSubmit = async () => {
    console.log("selectedExamOrder", selectedExamOrder);
    try {
      // Llamar a la función guardarArchivoExamen
      //@ts-ignore
      const enviarPDf = await guardarArchivoExamen("inputPdf", 2);
      if (enviarPDf !== undefined) {
        const dataUpdate = {
          minio_url: enviarPDf
        };
        const examRecipeResultData = {
          exam_recipe_id: selectedAppointment?.exam_recipe_id,
          uploaded_by_user_id: userLogged.id,
          date: new Date().toISOString(),
          result_minio_url: enviarPDf
        };
        await examOrderService.updateMinioFile(selectedExamOrder?.id, dataUpdate);
        await examRecipeResultService.create(examRecipeResultData);
        await examRecipeService.changeStatus(selectedAppointment?.exam_recipe_id, "uploaded");
        SwalManager.success({
          text: "Resultados guardados exitosamente"
        });
      } else {
        console.error("No se obtuvo un resultado válido.");
      }
    } catch (error) {
      console.error("Error al guardar el archivo:", error);
    } finally {
      setShowPdfModal(false);
      setPdfFile(null);
      setPdfPreviewUrl(null);
      refresh();
    }
  };
  const handleMakeClinicalRecord = (patientId, appointmentId) => {
    UserManager.onAuthChange((isAuthenticated, user) => {
      if (user) {
        window.location.href = `consultas-especialidad?patient_id=${patientId}&especialidad=${user.specialty.name}&appointment_id=${appointmentId}`;
      }
    });
  };

  // Función para abrir el modal de facturación
  const handleFacturarAdmision = citaData => {
    // Preparar los datos para el modal de facturación
    const appointmentData = {
      id: citaData.cita.id,
      patientId: citaData.paciente.id,
      patientName: `${citaData.paciente.first_name || ''} ${citaData.paciente.middle_name || ''} ${citaData.paciente.last_name || ''} ${citaData.paciente.second_last_name || ''}`,
      patient: citaData.paciente,
      appointment_date: citaData.cita.appointment_date,
      appointment_time: citaData.cita.appointment_time
      // Agregar más campos según sea necesario
    };
    setSelectedBillingAppointment(appointmentData);
    setShowBillingDialog(true);
  };

  // Función para manejar el éxito de la facturación
  const handleBillingSuccess = () => {
    setShowBillingDialog(false);
    setSelectedBillingAppointment(null);
    refresh(); // Refrescar la lista de pacientes
  };

  // Función para cerrar el modal de facturación
  const handleBillingHide = () => {
    setShowBillingDialog(false);
    setSelectedBillingAppointment(null);
  };
  const refresh = () => {
    fetchPatients();
  };

  // Función para traducir estados al español
  const traducirEstado = estado => {
    const traducciones = {
      'pending': 'Pendiente',
      'pending_consultation': 'En espera',
      'called': 'Llamado',
      'in_consultation': 'En proceso',
      'consultation_completed': 'Finalizada',
      'cancelled': 'Cancelada',
      'Sin estado': 'Sin estado'
    };
    return traducciones[estado] || estado;
  };

  // Función auxiliar para obtener el color según el estado
  const obtenerColorEstado = estado => {
    const colores = {
      'pending': 'warning',
      'pending_consultation': 'info',
      'called': 'primary',
      'in_consultation': 'success',
      'consultation_completed': 'secondary',
      'cancelled': 'danger'
    };
    return colores[estado] || 'secondary';
  };

  // Filtrar pacientes por estado para los tabs
  const getPatientsByStatus = status => {
    if (status === 'all') {
      return filteredPatients;
    }
    return filteredPatients.filter(citaData => citaData.estado === status);
  };

  // Renderizar tarjetas de pacientes
  const renderPatientCards = patientsToRender => {
    if (loading) {
      return /*#__PURE__*/React.createElement("div", {
        className: "text-center py-5"
      }, "Cargando pacientes...");
    }
    if (patientsToRender.length === 0) {
      return /*#__PURE__*/React.createElement("div", {
        className: "text-center py-5"
      }, "No se encontraron pacientes");
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-4 g-3"
    }, patientsToRender.map((citaData, index) => {
      const paciente = citaData.paciente;
      const cita = citaData.cita;
      const estadoActual = cita.appointment_state?.name || citaData.estado || 'Sin estado';
      const estadoTraducido = traducirEstado(estadoActual);
      const estadoColor = obtenerColorEstado(estadoActual);
      return /*#__PURE__*/React.createElement("div", {
        key: `${paciente.id}-${cita.id}-${index}`,
        className: "col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 mb-3"
      }, /*#__PURE__*/React.createElement("div", {
        className: "card card-paciente h-100"
      }, /*#__PURE__*/React.createElement("div", {
        className: "card-body d-flex flex-column p-3"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-center mb-2"
      }, /*#__PURE__*/React.createElement(Badge, {
        value: estadoTraducido,
        className: `badge-phoenix badge-phoenix-${estadoColor} fs-9`
      })), /*#__PURE__*/React.createElement("div", {
        className: "info-paciente flex-grow-1"
      }, /*#__PURE__*/React.createElement("div", {
        className: "patient-data-grid"
      }, /*#__PURE__*/React.createElement("div", {
        className: "grid-item"
      }, /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center mb-1"
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-id-card me-1 text-body-tertiary fs-8"
      }), /*#__PURE__*/React.createElement("span", {
        className: "fw-bold"
      }, "Documento")), /*#__PURE__*/React.createElement("div", {
        className: "text-body-emphasis text-truncate",
        title: paciente.document_number
      }, paciente.document_number)), /*#__PURE__*/React.createElement("div", {
        className: "grid-item"
      }, /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center mb-1"
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-cake-candles me-1 text-body-tertiary fs-8"
      }), /*#__PURE__*/React.createElement("span", {
        className: "fw-bold"
      }, "Edad")), /*#__PURE__*/React.createElement("div", {
        className: "text-body-emphasis"
      }, calculateAge(paciente.date_of_birth), " A\xF1os")), /*#__PURE__*/React.createElement("div", {
        className: "grid-item"
      }, /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center mb-1"
      }, /*#__PURE__*/React.createElement("i", {
        className: "far fa-calendar-check me-1 text-body-tertiary fs-8"
      }), /*#__PURE__*/React.createElement("span", {
        className: "fw-bold"
      }, "Fecha")), /*#__PURE__*/React.createElement("div", {
        className: "text-body-emphasis"
      }, cita.appointment_date || "N/A")), /*#__PURE__*/React.createElement("div", {
        className: "grid-item"
      }, /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center mb-1"
      }, /*#__PURE__*/React.createElement("i", {
        className: "far fa-clock me-1 text-body-tertiary fs-8"
      }), /*#__PURE__*/React.createElement("span", {
        className: "fw-bold"
      }, "Hora")), /*#__PURE__*/React.createElement("div", {
        className: "text-body-emphasis"
      }, cita.appointment_time || "N/A"))), /*#__PURE__*/React.createElement("div", {
        className: "mt-2 pt-2 border-top"
      }, /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center mb-1"
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-user me-1 text-body-tertiary fs-8"
      }), /*#__PURE__*/React.createElement("span", {
        className: "fw-bold"
      }, "Nombre")), /*#__PURE__*/React.createElement("div", {
        className: "text-body-emphasis text-truncate",
        title: `${paciente.first_name || ''} ${paciente.middle_name || ''} ${paciente.last_name || ''} ${paciente.second_last_name || ''}`
      }, paciente.first_name || '', paciente.middle_name ? ` ${paciente.middle_name}` : '', paciente.last_name ? ` ${paciente.last_name}` : '', paciente.second_last_name ? ` ${paciente.second_last_name}` : ''))), /*#__PURE__*/React.createElement("div", {
        className: "d-flex flex-column gap-2 w-100 mt-3"
      }, /*#__PURE__*/React.createElement(Button, {
        label: "Ver Paciente",
        className: "btn-sm btn btn-primary",
        onClick: () => window.location.href = `verPaciente?id=${paciente.id}`
      }), estadoActual === "pending" && /*#__PURE__*/React.createElement(Button, {
        label: "Facturar Admisi\xF3n",
        className: "btn-sm btn btn-primary",
        onClick: () => handleFacturarAdmision(citaData)
      }), (estadoActual === "pending_consultation" || estadoActual === "called") && /*#__PURE__*/React.createElement(Button, {
        label: "Llamar paciente",
        className: "btn-sm btn btn-primary",
        onClick: () => llamarPaciente(paciente.id, cita.id)
      }), (estadoActual === "pending_consultation" || estadoActual === "called" || estadoActual === "in_consultation") && cita.attention_type === "CONSULTATION" && /*#__PURE__*/React.createElement(Button, {
        label: "Realizar Consulta",
        className: "btn-sm btn btn-primary",
        onClick: () => handleMakeClinicalRecord(paciente.id, cita.id)
      }), (estadoActual === "pending_consultation" || estadoActual === "called" || estadoActual === "in_consultation") && cita.attention_type === "PROCEDURE" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        label: "Realizar Examen",
        className: "btn-sm btn btn-primary",
        onClick: () => {
          handleLoadExamResults(cita.id, paciente.id, cita.product_id);
        }
      }), /*#__PURE__*/React.createElement(Button, {
        label: "Subir Examen",
        className: "btn-sm btn btn-primary",
        onClick: () => {
          setSelectedAppointment(cita);
          setSelectedAppointmentId(cita.id);
          setSelectedExamOrder(cita.exam_orders[0]);
          setShowPdfModal(true);
        }
      }))))));
    }));
  };

  // Definir los tabs con nuevo orden: En Espera primero, Todos al final
  const tabItems = [{
    label: 'En Espera',
    value: 'pending_consultation',
    count: getPatientsByStatus('pending_consultation').length
  }, {
    label: 'Pendientes',
    value: 'pending',
    count: getPatientsByStatus('pending').length
  }, {
    label: 'Llamados',
    value: 'called',
    count: getPatientsByStatus('called').length
  }, {
    label: 'En Proceso',
    value: 'in_consultation',
    count: getPatientsByStatus('in_consultation').length
  }, {
    label: 'Finalizadas',
    value: 'consultation_completed',
    count: getPatientsByStatus('consultation_completed').length
  }, {
    label: 'Canceladas',
    value: 'cancelled',
    count: getPatientsByStatus('cancelled').length
  }, {
    label: 'Todos',
    value: 'all',
    count: filteredPatients.length
  }];

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setSearchText('');
    setFilteredPatients(patients);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(Accordion, null, /*#__PURE__*/React.createElement(AccordionTab, {
    header: "Filtros"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Buscar Paciente"), /*#__PURE__*/React.createElement(InputText, {
    value: searchText,
    onChange: e => setSearchText(e.target.value),
    placeholder: "Buscar por nombre o documento",
    className: "w-100"
  })))))), /*#__PURE__*/React.createElement(TabView, {
    activeIndex: activeTab,
    onTabChange: e => setActiveTab(e.index),
    className: "custom-tabview"
  }, tabItems.map((tab, index) => /*#__PURE__*/React.createElement(TabPanel, {
    key: tab.value,
    header: /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement("span", null, tab.label), /*#__PURE__*/React.createElement(Badge, {
      value: tab.count,
      className: `badge-count badge-${obtenerColorEstado(tab.value)}`
    }))
  }, renderPatientCards(getPatientsByStatus(tab.value)))))), /*#__PURE__*/React.createElement(AdmissionBilling, {
    visible: showBillingDialog,
    onHide: handleBillingHide,
    onSuccess: handleBillingSuccess,
    appointmentData: selectedBillingAppointment
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center mt-4"
  }, /*#__PURE__*/React.createElement(Paginator, {
    first: (currentPage - 1) * itemsPerPage,
    rows: itemsPerPage,
    totalRecords: totalPatients,
    onPageChange: onPageChange,
    template: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
  })), showPdfModal && /*#__PURE__*/React.createElement("div", {
    className: "modal fade show",
    style: {
      display: "block",
      backgroundColor: "rgba(0, 0, 0, 0.5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog modal-dialog-centered modal-lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "modal-title"
  }, "Previsualizaci\xF3n de PDF"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-close",
    onClick: () => {
      setPdfFile(null);
      setPdfPreviewUrl(null);
      setShowPdfModal(false);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, pdfPreviewUrl ? /*#__PURE__*/React.createElement("embed", {
    src: pdfPreviewUrl,
    width: "100%",
    height: "500px",
    type: "application/pdf"
  }) : /*#__PURE__*/React.createElement("p", null, "Por favor, seleccione un archivo PDF.")), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: ".pdf",
    id: "inputPdf",
    onChange: e => {
      const file = e.target.files?.[0] || null;
      if (file) {
        setPdfFile(file);
        setPdfPreviewUrl(URL.createObjectURL(file));
      }
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: () => {
      setShowPdfModal(false);
      setPdfFile(null);
      setPdfPreviewUrl(null);
    }
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-primary",
    onClick: () => {
      handlePDFSubmit();
      setShowPdfModal(false);
      setPdfFile(null);
      setPdfPreviewUrl(null);
    }
  }, "Confirmar"))))), /*#__PURE__*/React.createElement("style", null, `
            .card-paciente {
                display: flex;
                flex-direction: column;
                height: 100%;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s, box-shadow 0.2s;
                border: 1px solid #e9ecef;
            }

            .card-paciente:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            }

            .card-paciente .card-body {
                flex: 1;
                display: flex;
                flex-direction: column;
                padding: 12px;
            }

            .card-paciente .badge {
                font-size: 10px;
                margin-bottom: 8px;
            }

            .patient-data-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                margin-bottom: 8px;
            }

            .grid-item {
                display: flex;
                flex-direction: column;
            }

            .grid-item .fw-bold {
                font-size: 11px;
                color: #6c757d;
            }

            .grid-item .text-body-emphasis {
                font-size: 12px;
                color: #212529;
                word-break: break-word;
            }

            .card-paciente .btn {
                font-size: 11px;
                padding: 4px 8px;
                margin-bottom: 4px;
            }

            /* Estilos para los tabs */
            .custom-tabview .p-tabview-nav {
                background: #f8f9fa;
                border: none;
                border-radius: 8px 8px 0 0;
            }

            .custom-tabview .p-tabview-nav-link {
                padding: 0.75rem 1rem;
                border: none;
                background: transparent;
                color: #6c757d;
                font-weight: 500;
                transition: all 0.3s ease;
                font-size: 14px;
            }

            .custom-tabview .p-tabview-nav-link:hover {
                background: #e9ecef;
                color: #495057;
            }

            .custom-tabview .p-tabview-nav-link:not(.p-disabled):focus {
                box-shadow: none;
            }

            .custom-tabview .p-highlight .p-tabview-nav-link {
                background: #007bff;
                color: white;
                border-radius: 6px;
            }

            .custom-tabview .p-tabview-panels {
                background: white;
                border: 1px solid #dee2e6;
                border-top: none;
                border-radius: 0 0 8px 8px;
                padding: 1rem;
            }

            .badge-count {
                min-width: 20px;
                height: 20px;
                border-radius: 10px;
                font-size: 0.7rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            /* Responsive adjustments */
            @media (max-width: 576px) {
                .card-paciente .card-body {
                    padding: 8px;
                }
                
                .patient-data-grid {
                    gap: 6px;
                }
                
                .card-paciente .btn {
                    font-size: 10px;
                    padding: 3px 6px;
                }
            }

            @media (max-width: 768px) {
                .custom-tabview .p-tabview-nav {
                    flex-direction: column;
                }

                .custom-tabview .p-tabview-nav-link {
                    margin-bottom: 0.25rem;
                    font-size: 12px;
                    padding: 0.5rem 0.75rem;
                }
                
                .card-paciente {
                    margin-bottom: 12px;
                }
            }

            @media (min-width: 1200px) {
                .col-xl-3 {
                    flex: 0 0 auto;
                    width: 25%;
                }
            }

            @media (min-width: 1400px) {
                .col-xxl-3 {
                    flex: 0 0 auto;
                    width: 25%;
                }
            }
        `));
};