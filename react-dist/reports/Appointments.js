import React, { useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { Accordion, AccordionTab } from "primereact/accordion";
import { exportToExcel } from "../accounting/utils/ExportToExcelOptions.js";
import { useCompany } from "../hooks/useCompany.js";
import { useByStateFormat } from "../documents-generation/hooks/reports-medical/appointments/useByStateFormat.js";
import { useSummaryFormat } from "../documents-generation/hooks/reports-medical/appointments/useSummaryFormat.js";
import { useBySchedulerFormat } from "../documents-generation/hooks/reports-medical/appointments/useBySchedulerFormat.js";
import { formatDate as formatDateUtils } from "../../services/utilidades.js";

// Import your services
import { appointmentService, userSpecialtyService, userService, appointmentStateService } from "../../services/api/index.js";
import { appointmentStatesByKeyTwo, appointmentStateFilters } from "../../services/commons.js"; // Nueva interfaz para los datos del tab de agendamiento
export const Appointments = () => {
  const today = new Date();
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(today.getDate() - 5);

  // State for filters
  const [dateRange, setDateRange] = useState([fiveDaysAgo, today]);
  const [reportData, setReportData] = useState([]);
  const [groupedByState, setGroupedByState] = useState({});
  const [groupedBySpecialtyDoctor, setGroupedBySpecialtyDoctor] = useState({});

  // Nuevo estado para los datos del tab de agendamiento
  const [schedulingData, setSchedulingData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("byState");
  const [loadedTabs, setLoadedTabs] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointmentStates, setAppointmentStates] = useState([]);
  const {
    company,
    setCompany,
    fetchCompany
  } = useCompany();
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const {
    generateFormatByState
  } = useByStateFormat();
  const {
    generateFormatSummary
  } = useSummaryFormat();
  const {
    generateFormatByScheduler
  } = useBySchedulerFormat();
  useEffect(() => {
    if (activeTab === "byState" && !loadedTabs.includes("byState")) {
      loadDataForTab("byState");
    } else if (activeTab === "bySpecialty" && !loadedTabs.includes("bySpecialty")) {
      loadDataForTab("bySpecialty");
    } else if (activeTab === "scheduling" && !loadedTabs.includes("scheduling")) {
      loadDataForTab("scheduling");
    }
  }, [activeTab]);
  useEffect(() => {
    loadSpecialties();
    loadDoctors();
    loadAppointmentStates();
  }, []);
  async function loadSpecialties() {
    try {
      const response = await userSpecialtyService.getAll();
      setSpecialties(response);
    } catch (error) {
      console.error("Error fetching specialties:", error);
    }
  }
  async function loadDoctors() {
    try {
      const response = await userService.getAll();
      const responseFiltered = response.map(user => ({
        ...user,
        full_name: `${user.first_name ?? ""} ${user.middle_name ?? ""} ${user.last_name ?? ""} ${user.second_last_name ?? ""}`
      })).filter(user => user.role.group === "DOCTOR");
      setDoctors(responseFiltered);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  }
  async function loadAppointmentStates() {
    try {
      const response = await appointmentStateService.getAll();
      const responseMapped = response.map(state => {
        return {
          ...state,
          nameState: appointmentStateFilters[state.name]
        };
      });
      setAppointmentStates(responseMapped);
    } catch (error) {
      console.error("Error fetching appointment states:", error);
    }
  }

  // Función para ejecutar el endpoint específico del tab de agendamiento
  async function fetchSchedulingData(filterParams = {}) {
    try {
      const response = await appointmentService.reportByScheduler(filterParams);
      return response.data || response;
    } catch (error) {
      console.error("Error fetching scheduling data:", error);
      throw error;
    }
  }
  const loadDataForTab = async (tab, filterParams = {
    start_date: dateRange[0] ? formatDate(dateRange[0]) : "",
    end_date: dateRange[1] ? formatDate(dateRange[1]) : ""
  }) => {
    setTableLoading(true);
    try {
      if (tab === "scheduling") {
        // Tab de agendamiento - endpoint específico
        const data = await fetchSchedulingData(filterParams);
        if (!Array.isArray(data)) {
          throw new Error("La respuesta no es un array de datos de agendamiento");
        }

        // Solo guardamos la data sin agrupar nada
        setSchedulingData(data);
      } else {
        // Tabs existentes (byState y bySpecialty)
        const response = await appointmentService.appointmentsWithFilters(filterParams);
        const data = response.data || response;
        if (!Array.isArray(data)) {
          throw new Error("La respuesta no es un array de citas");
        }
        const processedData = handlerDataAppointments(data);
        setReportData(processedData);
        if (tab === "byState") {
          const grouped = {};
          processedData.forEach(appointment => {
            if (!grouped[appointment.state]) {
              grouped[appointment.state] = [];
            }
            grouped[appointment.state].push(appointment);
          });
          setGroupedByState(grouped);
        } else {
          const grouped = {};
          processedData.forEach(appointment => {
            const state = appointment.state;
            const specialty = appointment.assigned_user_availability?.user?.specialty?.name || "Sin especialidad";
            const doctorId = appointment.assigned_user_availability?.user?.id || "unknown";
            const doctorName = [appointment.assigned_user_availability?.user?.first_name, appointment.assigned_user_availability?.user?.middle_name, appointment.assigned_user_availability?.user?.last_name, appointment.assigned_user_availability?.user?.second_last_name].filter(Boolean).join(" ") || "Sin nombre";
            if (!grouped[state]) {
              grouped[state] = [];
            }
            const existingEntry = grouped[state].find(entry => entry.specialty === specialty && entry.doctorName === doctorName);
            if (existingEntry) {
              existingEntry.count++;
              existingEntry.appointments.push(appointment);
            } else {
              grouped[state].push({
                specialty,
                doctorName,
                count: 1,
                appointments: [appointment]
              });
            }
          });
          setGroupedBySpecialtyDoctor(grouped);
        }
      }

      // Marcar el tab como cargado
      if (!loadedTabs.includes(tab)) {
        setLoadedTabs([...loadedTabs, tab]);
      }
    } catch (error) {
      console.error("Error loading report data:", error);
    } finally {
      setTableLoading(false);
    }
  };
  const handleFilter = async () => {
    try {
      const filterParams = {
        start_date: dateRange[0] ? formatDate(dateRange[0]) : "",
        end_date: dateRange[1] ? formatDate(dateRange[1]) : ""
      };
      if (selectedStates.length > 0) {
        filterParams.appointment_state_ids = selectedStates.map(state => state.id);
      }
      if (selectedDoctors.length > 0) {
        filterParams.user_ids = selectedDoctors.map(doctor => doctor.id);
      }
      if (selectedSpecialties.length > 0) {
        filterParams.specialty_ids = selectedSpecialties.map(specialty => specialty.id);
      }

      // Cargar datos para el tab activo (incluyendo el nuevo tab scheduling)
      await loadDataForTab(activeTab, filterParams);
    } catch (error) {
      console.error("Error filtering data:", error);
    }
  };
  const formatDate = date => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };
  const handlerDataAppointments = data => {
    return data.map(item => {
      const state = appointmentStatesByKeyTwo[item.appointment_state?.name];
      return {
        ...item,
        state: (typeof state === "object" ? state.CONSULTATION : state) ?? "Sin estado"
      };
    });
  };

  // Función para construir la tabla del tab de agendamiento
  const renderSchedulingTable = () => {
    if (tableLoading) {
      return /*#__PURE__*/React.createElement("div", {
        className: "flex justify-content-center align-items-center",
        style: {
          height: "200px"
        }
      }, /*#__PURE__*/React.createElement(ProgressSpinner, null));
    }
    if (schedulingData.length === 0) {
      return /*#__PURE__*/React.createElement("p", null, "No hay datos de agendamiento para mostrar");
    }
    return /*#__PURE__*/React.createElement(Accordion, {
      activeIndex: activeIndex,
      onTabChange: e => setActiveIndex(e.index)
    }, schedulingData.map((scheduler, index) => {
      const fullName = `${scheduler.first_name ?? ""} ${scheduler.middle_name ?? ""} ${scheduler.last_name ?? ""} ${scheduler.second_last_name ?? ""}`;
      return /*#__PURE__*/React.createElement(AccordionTab, {
        key: scheduler.id || index,
        header: headerTemplateRefactor(fullName, scheduler.created_appointments || [], "appointmentsByScheduler")
      }, /*#__PURE__*/React.createElement(DataTable, {
        value: scheduler.created_appointments,
        emptyMessage: `No hay citas`,
        className: "p-datatable-sm p-datatable-striped",
        paginator: true,
        rows: 10,
        rowsPerPageOptions: [5, 10, 25],
        sortMode: "multiple",
        scrollable: true,
        scrollHeight: "400px",
        globalFilter: globalFilter
      }, /*#__PURE__*/React.createElement(Column, {
        field: "patient",
        header: "Paciente",
        body: rowData => {
          const patientFullName = `${rowData?.patient?.first_name ?? ""} ${rowData?.patient?.middle_name ?? ""} ${rowData?.patient?.last_name ?? ""} ${rowData?.patient?.second_last_name ?? ""}`;
          return patientFullName.toLowerCase() || "Sin nombre";
        },
        sortable: true,
        style: {
          minWidth: "200px"
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "patient.id",
        header: "N\xB0 Documento",
        body: rowData => {
          return rowData.patient.document_number || "Sin documento";
        },
        sortable: true,
        style: {
          minWidth: "150px"
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "date",
        header: "Fecha y hora",
        body: rowData => rowData.appointment_date + ", " + rowData.appointment_time,
        sortable: true,
        style: {
          minWidth: "180px"
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "doctorName",
        header: "M\xE9dico",
        body: rowData => {
          const doctorFullName = `${rowData?.user_availability?.user?.first_name ?? ""} ${rowData?.user_availability?.user?.middle_name ?? ""} ${rowData?.user_availability?.user?.last_name ?? ""} ${rowData?.user_availability?.user?.second_last_name ?? ""}`;
          return doctorFullName;
        },
        sortable: true,
        style: {
          minWidth: "200px"
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "specialty",
        header: "Especialidad",
        body: rowData => /*#__PURE__*/React.createElement("span", {
          className: "font-bold"
        }, rowData.user_availability?.user?.specialty?.name),
        sortable: true,
        style: {
          minWidth: "150px"
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "createdAt",
        header: "Fecha creaci\xF3n",
        body: rowData => /*#__PURE__*/React.createElement("span", {
          className: "font-bold"
        }, formatDateUtils(rowData.created_at, true)),
        sortable: true,
        style: {
          minWidth: "150px"
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "status",
        header: "Estado",
        body: rowData => /*#__PURE__*/React.createElement("span", {
          className: "font-bold"
        }, appointmentStateFilters[rowData.appointment_state?.name]),
        sortable: true,
        style: {
          minWidth: "150px"
        }
      })));
    }));
  };
  const handleExportExcel = (state, data) => {
    const dataToExport = data.map(item => ({
      Estado: item.state,
      Paciente: `${item.patient?.first_name} ${item.patient?.last_name}`,
      Documento: item.patient?.document_number,
      Ciudad: item.patient?.city_id,
      Producto: item.product_id,
      Fecha: new Date(item.created_at).toLocaleDateString("es-DO")
    }));
    exportToExcel({
      data: dataToExport,
      fileName: `Citas_${state.replace(/ /g, "_")}_${new Date().toISOString().slice(0, 10)}`
    });
  };
  const handleExportScheduling = (scheduler, data) => {
    const dataToExport = data.map(item => ({
      Paciente: `${item.patient?.first_name ?? ""} ${item.patient?.middle_name ?? ""} ${item.patient?.last_name ?? ""} ${item.patient?.second_last_name ?? ""}`,
      Documento: item.patient?.document_number,
      "Fecha y hora cita": item?.appointment_date + ", " + item?.appointment_time,
      Médico: `${item.user_availability?.user?.first_name ?? ""} ${item.user_availability?.user?.middle_name ?? ""} ${item.user_availability?.user?.last_name ?? ""} ${item.user_availability?.user?.second_last_name ?? ""}`,
      Especialidad: item.user_availability?.user?.specialty?.name,
      "Fecha creación cita": formatDateUtils(item.created_at, true),
      Estado: appointmentStateFilters[item.appointment_state?.name]
    }));
    exportToExcel({
      data: dataToExport,
      fileName: `Citas_agendamiento_${scheduler.replace(/ /g, "_")}_${new Date().toISOString().slice(0, 10)}`
    });
  };
  const handleExportPDF = (state, data, tab) => {
    switch (tab) {
      case "byState":
        return generateFormatByState(data, state, dateRange, "Impresion");
      case "summaryAppointments":
        return generateFormatSummary(data, state, dateRange, "Impresion");
      case "appointmentsByScheduler":
        return generateFormatByScheduler(data, state, dateRange, "Impresion");
    }
  };
  const dateTemplate = rowData => {
    return new Date(rowData.created_at).toLocaleDateString("es-DO") + ", " + (rowData.appointment_time || "");
  };
  const headerTemplate = (state, count, data, tab) => {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-center w-full p-4"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, state), " - Total: ", count)), /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      className: "p-button-rounded p-button-success p-button-sm",
      onClick: e => {
        e.stopPropagation();
        e.preventDefault();
        handleExportExcel(state, data);
      },
      tooltip: `Exportar ${state} a Excel`,
      tooltipOptions: {
        position: "right"
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-file-excel"
    })), /*#__PURE__*/React.createElement(Button, {
      className: "p-button-rounded p-button-secondary p-button-sm",
      onClick: e => {
        e.stopPropagation();
        e.preventDefault();
        handleExportPDF(state, data, tab);
      },
      tooltip: `Exportar ${state} a PDF`,
      tooltipOptions: {
        position: "right"
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-file-pdf"
    }))));
  };
  const headerTemplateRefactor = (scheduler, data, tab) => {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-center w-full p-4"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, scheduler), " - Total citas: ", data.length)), /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      className: "p-button-rounded p-button-success p-button-sm",
      onClick: e => {
        e.stopPropagation();
        e.preventDefault();
        handleExportScheduling(scheduler, data);
      },
      tooltip: `Exportar a Excel`,
      tooltipOptions: {
        position: "right"
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-file-excel"
    })), /*#__PURE__*/React.createElement(Button, {
      className: "p-button-rounded p-button-secondary p-button-sm",
      onClick: e => {
        e.stopPropagation();
        e.preventDefault();
        handleExportPDF(scheduler, data, tab);
      },
      tooltip: `Exportar a PDF`,
      tooltipOptions: {
        position: "right"
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-file-pdf"
    }))));
  };
  const renderByStateTable = () => {
    if (tableLoading) {
      return /*#__PURE__*/React.createElement("div", {
        className: "flex justify-content-center align-items-center",
        style: {
          height: "200px"
        }
      }, /*#__PURE__*/React.createElement(ProgressSpinner, null));
    }
    if (Object.keys(groupedByState).length === 0) {
      return /*#__PURE__*/React.createElement("p", null, "No hay datos para mostrar");
    }
    return /*#__PURE__*/React.createElement(Accordion, {
      activeIndex: activeIndex,
      onTabChange: e => setActiveIndex(e.index)
    }, Object.entries(groupedByState).map(([state, appointments]) => /*#__PURE__*/React.createElement(AccordionTab, {
      key: state,
      header: headerTemplate(state, appointments.length, appointments, "byState")
    }, /*#__PURE__*/React.createElement(DataTable, {
      value: appointments,
      emptyMessage: `No hay citas en estado ${state}`,
      className: "p-datatable-sm p-datatable-striped",
      paginator: true,
      rows: 10,
      rowsPerPageOptions: [5, 10, 25],
      scrollable: true,
      scrollHeight: "400px",
      globalFilter: globalFilter,
      showGridlines: true
    }, /*#__PURE__*/React.createElement(Column, {
      field: "patient.first_name",
      header: "Paciente",
      body: data => `${data.patient.first_name} ${data.patient.last_name}`,
      sortable: true,
      style: {
        minWidth: "200px"
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "patient.document_number",
      header: "Documento",
      sortable: true,
      style: {
        minWidth: "150px"
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "patient.city_id",
      header: "Ciudad",
      sortable: true,
      style: {
        minWidth: "150px"
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "assigned_user_availability.first_name",
      header: "Especialista",
      body: data => `${data.assigned_user_availability?.user?.first_name || ""} ${data.assigned_user_availability?.user?.last_name || ""}`,
      sortable: true,
      style: {
        minWidth: "200px"
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "assigned_user_availability.user.specialty.name",
      header: "Especialidad",
      sortable: true,
      style: {
        minWidth: "150px"
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "product.name",
      header: "Producto",
      sortable: true,
      style: {
        minWidth: "150px"
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "created_at",
      header: "Fecha",
      body: dateTemplate,
      sortable: true,
      style: {
        minWidth: "180px"
      }
    })))));
  };
  const renderBySpecialtyTable = () => {
    if (tableLoading) {
      return /*#__PURE__*/React.createElement("div", {
        className: "flex justify-content-center align-items-center",
        style: {
          height: "200px"
        }
      }, /*#__PURE__*/React.createElement(ProgressSpinner, null));
    }
    if (Object.keys(groupedBySpecialtyDoctor).length === 0) {
      return /*#__PURE__*/React.createElement("p", null, "No hay datos para mostrar");
    }
    return /*#__PURE__*/React.createElement(Accordion, {
      activeIndex: activeIndex,
      onTabChange: e => setActiveIndex(e.index)
    }, Object.entries(groupedBySpecialtyDoctor).map(([state, entries]) => {
      const totalCount = entries.reduce((sum, entry) => sum + entry.count, 0);
      const allAppointments = entries.flatMap(entry => entry.appointments);
      return /*#__PURE__*/React.createElement(AccordionTab, {
        key: state,
        header: headerTemplate(state, totalCount, entries, "summaryAppointments")
      }, /*#__PURE__*/React.createElement(DataTable, {
        value: entries,
        emptyMessage: `No hay citas en estado ${state}`,
        className: "p-datatable-sm p-datatable-striped",
        paginator: true,
        rows: 10,
        rowsPerPageOptions: [5, 10, 25],
        sortMode: "multiple",
        scrollable: true,
        scrollHeight: "400px",
        globalFilter: globalFilter,
        showGridlines: true
      }, /*#__PURE__*/React.createElement(Column, {
        field: "specialty",
        header: "Especialidad",
        sortable: true,
        filter: true,
        filterPlaceholder: "Buscar especialidad",
        style: {
          minWidth: "200px"
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "doctorName",
        header: "M\xE9dico",
        sortable: true,
        filter: true,
        filterPlaceholder: "Buscar m\xE9dico",
        style: {
          minWidth: "200px"
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "count",
        header: "Cantidad",
        sortable: true,
        body: rowData => /*#__PURE__*/React.createElement("span", {
          className: "font-bold"
        }, rowData.count),
        style: {
          minWidth: "120px"
        }
      })));
    }));
  };
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex justify-content-center align-items-center",
      style: {
        height: "50vh"
      }
    }, /*#__PURE__*/React.createElement(ProgressSpinner, null));
  }
  return /*#__PURE__*/React.createElement("main", {
    className: "main",
    id: "top"
  }, loading ? /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-center align-items-center",
    style: {
      height: "50vh",
      marginLeft: "900px",
      marginTop: "300px"
    }
  }, /*#__PURE__*/React.createElement(ProgressSpinner, null)) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "row g-3 justify-content-between align-items-start mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "400px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body h-100 w-100 d-flex flex-column",
    style: {
      marginTop: "-40px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "tabs-professional-container mt-4"
  }, /*#__PURE__*/React.createElement(Accordion, null, /*#__PURE__*/React.createElement(AccordionTab, {
    header: "Filtros"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "dateRange"
  }, "Rango de fechas"), /*#__PURE__*/React.createElement(Calendar, {
    value: dateRange,
    onChange: e => setDateRange(e.value),
    selectionMode: "range",
    readOnlyInput: true,
    dateFormat: "dd/mm/yy",
    placeholder: "Seleccione un rango",
    className: "w-100",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Estado"), /*#__PURE__*/React.createElement(MultiSelect, {
    value: selectedStates,
    onChange: e => {
      setSelectedStates(e.value);
    },
    options: appointmentStates,
    optionLabel: "nameState",
    filter: true,
    placeholder: "Seleccione estados",
    maxSelectedLabels: 3,
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Especialista"), /*#__PURE__*/React.createElement(MultiSelect, {
    value: selectedDoctors,
    onChange: e => setSelectedDoctors(e.value),
    options: doctors,
    optionLabel: "full_name",
    filter: true,
    placeholder: "Seleccione Especialistas",
    maxSelectedLabels: 3,
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Especialidad"), /*#__PURE__*/React.createElement(MultiSelect, {
    value: selectedSpecialties,
    onChange: e => setSelectedSpecialties(e.value),
    options: specialties,
    optionLabel: "name",
    filter: true,
    placeholder: "Seleccione Especialidades",
    maxSelectedLabels: 3,
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end m-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Filtrar",
    icon: "pi pi-filter",
    onClick: handleFilter,
    loading: tableLoading,
    className: "p-button-primary"
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "tabs-header"
  }, /*#__PURE__*/React.createElement("button", {
    className: `tab-item ${activeTab === "byState" ? "active" : ""}`,
    onClick: () => setActiveTab("byState")
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-list-alt"
  }), "Vista por Estado"), /*#__PURE__*/React.createElement("button", {
    className: `tab-item ${activeTab === "bySpecialty" ? "active" : ""}`,
    onClick: () => setActiveTab("bySpecialty")
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-user-md"
  }), "Vista por Especialidad"), /*#__PURE__*/React.createElement("button", {
    className: `tab-item ${activeTab === "scheduling" ? "active" : ""}`,
    onClick: () => setActiveTab("scheduling")
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-calendar-plus"
  }), "Agendamiento")), /*#__PURE__*/React.createElement("div", {
    className: "tabs-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: `tab-panel ${activeTab === "byState" ? "active" : ""}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xl font-semibold"
  }, "Citas por Estado"), /*#__PURE__*/React.createElement("span", {
    className: "p-input-icon-left"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-search"
  }), /*#__PURE__*/React.createElement(InputText, {
    type: "search",
    onInput: e => setGlobalFilter(e.currentTarget.value),
    placeholder: "Buscar..."
  }))), renderByStateTable()), /*#__PURE__*/React.createElement("div", {
    className: `tab-panel ${activeTab === "bySpecialty" ? "active" : ""}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xl font-semibold"
  }, "Citas por Especialidad y M\xE9dico"), /*#__PURE__*/React.createElement("span", {
    className: "p-input-icon-left"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-search"
  }), /*#__PURE__*/React.createElement(InputText, {
    type: "search",
    onInput: e => setGlobalFilter(e.currentTarget.value),
    placeholder: "Buscar..."
  }))), renderBySpecialtyTable()), /*#__PURE__*/React.createElement("div", {
    className: `tab-panel ${activeTab === "scheduling" ? "active" : ""}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xl font-semibold"
  }, "Agendamiento por Usuario"), /*#__PURE__*/React.createElement("span", {
    className: "p-input-icon-left"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-search"
  }), /*#__PURE__*/React.createElement(InputText, {
    type: "search",
    onInput: e => setGlobalFilter(e.currentTarget.value),
    placeholder: "Buscar..."
  }))), renderSchedulingTable())))))))));
};