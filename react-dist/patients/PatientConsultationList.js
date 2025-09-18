import React, { useState, useEffect, useCallback, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { appointmentService, examOrderService, examRecipeResultService, examRecipeService, infoCompanyService, patientService, templateService, ticketService } from "../../services/api/index.js";
import { formatWhatsAppMessage, getIndicativeByCountry, getUserLogged } from "../../services/utilidades.js";
import { createMassMessaging } from "../../funciones/funcionesJS/massMessage.js";
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
  const [messaging, setMessaging] = useState(null);
  const [template, setTemplate] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedExamOrder, setSelectedExamOrder] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
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
      if (searchText && !paciente.fullName?.toLowerCase().includes(searchText.toLowerCase()) && !paciente.document_number.includes(searchText)) {
        isMatch = false;
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

  // Renderizar tarjetas de pacientes
  const renderPatientCards = () => {
    if (loading) {
      return /*#__PURE__*/React.createElement("div", {
        className: "text-center py-5"
      }, "Cargando pacientes...");
    }
    if (filteredPatients.length === 0) {
      return /*#__PURE__*/React.createElement("div", {
        className: "text-center py-5"
      }, "No se encontraron pacientes");
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4"
    }, filteredPatients.map((citaData, index) => {
      const paciente = citaData.paciente;
      const cita = citaData.cita;
      const estadoActual = cita.appointment_state?.name || citaData.estado || 'Sin estado';
      const estadoTraducido = traducirEstado(estadoActual);
      const estadoColor = obtenerColorEstado(estadoActual);
      return /*#__PURE__*/React.createElement("div", {
        key: `${paciente.id}-${cita.id}-${index}`,
        className: "col-12 col-sm-6 col-md-4 col-lg-4 mb-4"
      }, /*#__PURE__*/React.createElement("div", {
        className: "card card-paciente"
      }, /*#__PURE__*/React.createElement("div", {
        className: "card-body"
      }, /*#__PURE__*/React.createElement(Badge, {
        value: estadoTraducido,
        className: `badge-phoenix badge-phoenix-${estadoColor} fs-10 mb-3`
      }), /*#__PURE__*/React.createElement("div", {
        className: "info-paciente row"
      }, /*#__PURE__*/React.createElement("div", {
        className: "col-6"
      }, /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-id-card me-2 text-body-tertiary fs-9 fw-extra-bold"
      }), /*#__PURE__*/React.createElement("p", {
        className: "fw-bold mb-0"
      }, "Documento")), /*#__PURE__*/React.createElement("p", {
        className: "text-body-emphasis mb-3"
      }, paciente.document_number)), /*#__PURE__*/React.createElement("div", {
        className: "col-6"
      }, /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-cake-candles me-2 text-body-tertiary fs-9 fw-extra-bold"
      }), /*#__PURE__*/React.createElement("p", {
        className: "fw-bold mb-0"
      }, "Edad")), /*#__PURE__*/React.createElement("p", {
        className: "text-body-emphasis mb-3"
      }, calculateAge(paciente.date_of_birth), " A\xF1os")), /*#__PURE__*/React.createElement("div", {
        className: "col-6"
      }, /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/React.createElement("i", {
        className: "far fa-calendar-check me-2 text-body-tertiary fs-9 fw-extra-bold"
      }), /*#__PURE__*/React.createElement("p", {
        className: "fw-bold mb-0"
      }, "Fecha")), /*#__PURE__*/React.createElement("p", {
        className: "text-body-emphasis mb-3"
      }, cita.appointment_date || "Fecha no disponible")), /*#__PURE__*/React.createElement("div", {
        className: "col-6"
      }, /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/React.createElement("i", {
        className: "far fa-clock me-2 text-body-tertiary fs-9 fw-extra-bold"
      }), /*#__PURE__*/React.createElement("p", {
        className: "fw-bold mb-0"
      }, "Hora")), /*#__PURE__*/React.createElement("p", {
        className: "text-body-emphasis"
      }, cita.appointment_time || "Hora no disponible")), /*#__PURE__*/React.createElement("div", {
        className: "col-6"
      }, /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-user me-2 text-body-tertiary fs-9 fw-extra-bold"
      }), /*#__PURE__*/React.createElement("p", {
        className: "fw-bold mb-0"
      }, "Nombre")), /*#__PURE__*/React.createElement("p", {
        className: "text-body-emphasis"
      }, paciente.first_name || '', paciente.middle_name ? ` ${paciente.middle_name}` : '', paciente.last_name ? ` ${paciente.last_name}` : '', paciente.second_last_name ? ` ${paciente.second_last_name}` : ''))), /*#__PURE__*/React.createElement("div", {
        className: "d-flex flex-column gap-2 w-100 mt-3"
      }, /*#__PURE__*/React.createElement(Button, {
        label: "Ver Paciente",
        className: "btn-sm btn btn-primary",
        onClick: () => window.location.href = `verPaciente?id=${paciente.id}`
      }), estadoActual === "pending_consultation" && /*#__PURE__*/React.createElement(Button, {
        label: "Llamar paciente",
        className: "btn-sm btn btn-primary",
        onClick: () => llamarPaciente(paciente.id, cita.id)
      }), (estadoActual === "pending_consultation" || estadoActual === "called" || estadoActual === "in_consultation") && cita.attention_type === "CONSULTATION" && /*#__PURE__*/React.createElement(Button, {
        label: "Realizar Consulta",
        className: "btn-sm btn btn-primary mb-2",
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "accordion mb-4",
    id: "accordionFiltros"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion-item"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "accordion-header",
    id: "headingFiltros"
  }, /*#__PURE__*/React.createElement("button", {
    className: "accordion-button",
    type: "button",
    "data-bs-toggle": "collapse",
    "data-bs-target": "#collapseFiltros",
    "aria-expanded": "false",
    "aria-controls": "collapseFiltros"
  }, "Filtros")), /*#__PURE__*/React.createElement("div", {
    id: "collapseFiltros",
    className: "accordion-collapse collapse",
    "aria-labelledby": "headingFiltros",
    "data-bs-parent": "#accordionFiltros"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "searchPaciente",
    className: "form-label"
  }, "Buscar Paciente"), /*#__PURE__*/React.createElement(InputText, {
    id: "searchPaciente",
    value: searchText,
    onChange: e => setSearchText(e.target.value),
    placeholder: "Buscar por nombre o documento",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "statusPaciente",
    className: "form-label"
  }, "Filtrar por Estado"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "statusPaciente",
    value: statusFilter,
    options: statusOptions,
    onChange: e => setStatusFilter(e.value),
    placeholder: "Seleccione Estado",
    className: "w-100"
  }))))))), renderPatientCards(), /*#__PURE__*/React.createElement("div", {
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
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .card-paciente:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                }

                .card-paciente .card-body {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 15px;
                }

                .card-paciente .avatar {
                    width: 80px;
                    height: 80px;
                    margin-bottom: 10px;
                }

                .card-paciente .badge {
                    font-size: 12px;
                    margin-bottom: 10px;
                }

                .card-paciente .info-paciente {
                    width: 100%;
                    text-align: left;
                }

                .card-paciente .info-paciente p {
                    margin-bottom: 8px;
                    font-size: 14px;
                    white-space: normal;
                    overflow: visible;
                }

                .card-paciente .btn-ver {
                    width: 100%;
                    margin-top: auto;
                    font-size: 14px;
                }

                .info-paciente .row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                }

                .info-paciente .col-6 {
                    flex: 1 1 45%;
                    min-width: 45%;
                }

                @media (max-width: 768px) {
                    .card-paciente .avatar {
                        width: 60px;
                        height: 60px;
                    }

                    .card-paciente .info-paciente p {
                        font-size: 12px;
                    }

                    .card-paciente .btn-ver {
                        font-size: 12px;
                    }

                    .info-paciente .col-6 {
                        flex: 1 1 100%;
                        min-width: 100%;
                    }
                }
            `));
};