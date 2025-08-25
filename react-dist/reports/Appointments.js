import React, { useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { Accordion, AccordionTab } from "primereact/accordion";
import { TabView, TabPanel } from "primereact/tabview";
import { exportToExcel } from "../accounting/utils/ExportToExcelOptions.js";
import { useCompany } from "../hooks/useCompany.js";
import { useByStateFormat } from "../documents-generation/hooks/reports-medical/appointments/useByStateFormat.js";
import { useSummaryFormat } from "../documents-generation/hooks/reports-medical/appointments/useSummaryFormat.js"; // Import your services
import { appointmentService, userSpecialtyService, userService, appointmentStateService } from "../../services/api/index.js";
import { appointmentStatesByKeyTwo, appointmentStateFilters } from "../../services/commons.js";
export const Appointments = () => {
  const today = new Date();
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(today.getDate() - 5);

  // State for filters
  const [dateRange, setDateRange] = useState([fiveDaysAgo, today]);
  const [reportData, setReportData] = useState([]);
  const [groupedByState, setGroupedByState] = useState({});
  const [groupedBySpecialtyDoctor, setGroupedBySpecialtyDoctor] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
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
  useEffect(() => {
    if (activeTabIndex === 0 && !loadedTabs.includes(0)) {
      loadDataForTab(0);
    } else if (activeTabIndex === 1 && !loadedTabs.includes(1)) {
      loadDataForTab(1);
    }
  }, [activeTabIndex]);
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
  const loadDataForTab = async (tabIndex, filterParams = {
    start_date: dateRange[0] ? formatDate(dateRange[0]) : "",
    end_date: dateRange[1] ? formatDate(dateRange[1]) : ""
  }) => {
    setTableLoading(true);
    try {
      const response = await appointmentService.appointmentsWithFilters(filterParams);
      const data = response.data || response;
      if (!Array.isArray(data)) {
        throw new Error("La respuesta no es un array de citas");
      }
      const processedData = handlerDataAppointments(data);
      setReportData(processedData);
      if (tabIndex === 0) {
        // Agrupamiento original (solo por estado)
        const grouped = {};
        processedData.forEach(appointment => {
          if (!grouped[appointment.state]) {
            grouped[appointment.state] = [];
          }
          grouped[appointment.state].push(appointment);
        });
        setGroupedByState(grouped);
      } else {
        // Nuevo agrupamiento (estado -> array de {especialidad, médico, count})
        const grouped = {};
        processedData.forEach(appointment => {
          const state = appointment.state;
          const specialty = appointment.assigned_user_availability?.user?.specialty?.name || "Sin especialidad";
          const doctorId = appointment.assigned_user_availability?.user?.id || "unknown";
          const doctorName = [appointment.assigned_user_availability?.user?.first_name, appointment.assigned_user_availability?.user?.middle_name, appointment.assigned_user_availability?.user?.last_name, appointment.assigned_user_availability?.user?.second_last_name].filter(Boolean).join(" ") || "Sin nombre";
          if (!grouped[state]) {
            grouped[state] = [];
          }

          // Buscar si ya existe esta combinación especialidad-médico
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

      // Marcar el tab como cargado
      if (!loadedTabs.includes(tabIndex)) {
        setLoadedTabs([...loadedTabs, tabIndex]);
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

      // Cargar datos solo para el tab activo
      await loadDataForTab(activeTabIndex, filterParams);
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
  const handleExportExcel = (state, data) => {
    const dataToExport = data.map(item => ({
      Estado: item.state,
      Paciente: `${item.patient.first_name} ${item.patient.last_name}`,
      Documento: item.patient.document_number,
      Ciudad: item.patient.city_id,
      Producto: item.product_id,
      Fecha: new Date(item.created_at).toLocaleDateString("es-DO")
    }));
    exportToExcel({
      data: dataToExport,
      fileName: `Citas_${state.replace(/ /g, "_")}_${new Date().toISOString().slice(0, 10)}`
    });
  };
  const handleExportPDF = (state, data, tab) => {
    switch (tab) {
      case "byState":
        return generateFormatByState(data, state, dateRange, "Impresion");
      case "summaryAppointments":
        return generateFormatSummary(data, state, dateRange, "Impresion");
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
  }, /*#__PURE__*/React.createElement("div", {
    className: "content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pb-9"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "mb-4"
  }, "Reporte de Citas"), /*#__PURE__*/React.createElement("div", {
    className: "card border border-light mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid p-fluid row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-6 md:col-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Rango de fechas"), /*#__PURE__*/React.createElement(Calendar, {
    value: dateRange,
    onChange: e => setDateRange(e.value),
    selectionMode: "range",
    readOnlyInput: true,
    dateFormat: "dd/mm/yy",
    placeholder: "Seleccione un rango",
    className: "w-full",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6 md:col-6"
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
    className: "w-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6 md:col-6"
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
    className: "w-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6 md:col-6"
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
    className: "w-full"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end mt-3"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Filtrar",
    icon: "pi pi-filter",
    onClick: handleFilter,
    loading: tableLoading,
    className: "p-button-primary"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement(TabView, {
    activeIndex: activeTabIndex,
    onTabChange: e => setActiveTabIndex(e.index)
  }, /*#__PURE__*/React.createElement(TabPanel, {
    header: "Vista por Estado"
  }, tableLoading ? /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-center align-items-center",
    style: {
      height: "200px"
    }
  }, /*#__PURE__*/React.createElement(ProgressSpinner, null)) : Object.keys(groupedByState).length > 0 ? /*#__PURE__*/React.createElement(Accordion, {
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
    rowsPerPageOptions: [5, 10, 25]
  }, /*#__PURE__*/React.createElement(Column, {
    field: "patient.first_name",
    header: "Paciente",
    body: data => `${data.patient.first_name} ${data.patient.last_name}`,
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "patient.document_number",
    header: "Documento",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "patient.city_id",
    header: "Ciudad",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "assigned_user_availability.first_name",
    header: "Especialista",
    body: data => `${data.assigned_user_availability?.user?.first_name || ""} ${data.assigned_user_availability?.user?.last_name || ""}`,
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "assigned_user_availability.user.specialty.name",
    header: "Especialidad",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "product.name",
    header: "Producto",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "created_at",
    header: "Fecha",
    body: dateTemplate,
    sortable: true
  }))))) : /*#__PURE__*/React.createElement("p", null, "No hay datos para mostrar")), /*#__PURE__*/React.createElement(TabPanel, {
    header: "Vista por Especialidad y M\xE9dico"
  }, tableLoading ? /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-center align-items-center",
    style: {
      height: "200px"
    }
  }, /*#__PURE__*/React.createElement(ProgressSpinner, null)) : Object.keys(groupedBySpecialtyDoctor).length > 0 ? /*#__PURE__*/React.createElement(Accordion, {
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
      sortMode: "multiple"
    }, /*#__PURE__*/React.createElement(Column, {
      field: "specialty",
      header: "Especialidad",
      sortable: true,
      filter: true,
      filterPlaceholder: "Buscar especialidad"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "doctorName",
      header: "M\xE9dico",
      sortable: true,
      filter: true,
      filterPlaceholder: "Buscar m\xE9dico"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "count",
      header: "Cantidad",
      sortable: true,
      body: rowData => /*#__PURE__*/React.createElement("span", {
        className: "font-bold"
      }, rowData.count)
    })));
  })) : /*#__PURE__*/React.createElement("p", null, "No hay datos para mostrar")))))));
};