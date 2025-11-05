import React, { useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { Accordion, AccordionTab } from "primereact/accordion";
import { AutoComplete } from "primereact/autocomplete";
import { clinicalRecordService, userService, userSpecialtyService, clinicalRecordTypeService, cie11Service } from "../../services/api/index.js";
import { formatDate as formatDateUtils, getAge } from "../../services/utilidades.js";
import { genders } from "../../services/commons.js";
import { useAverageBySpecialistFormat } from "../documents-generation/hooks/reports-medical/clinicalRecords/useAverageBySpecialistFormat.js";
import { useDiagnosisGroupedByPatientFormat } from "../documents-generation/hooks/reports-medical/clinicalRecords/useDiagnosisGroupedByPatient.js";
import { useDiagnosisFormat } from "../documents-generation/hooks/reports-medical/clinicalRecords/useDiagnosisFormat.js";
import { exportToExcel } from "../accounting/utils/ExportToExcelOptions.js";
export const ClinicalRecord = () => {
  const today = new Date();
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(today.getDate() - 5);

  // State for filters
  const [dateRange, setDateRange] = useState([fiveDaysAgo, today]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("productivity");
  const [loadedTabs, setLoadedTabs] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Estados para datos de cada tab
  const [productivityData, setProductivityData] = useState([]);
  const [diagnosisData, setDiagnosisData] = useState([]);
  const [diagnosisGroupedData, setDiagnosisGroupedData] = useState([]);

  // Estados para filtros
  const [clinicalRecordTypes, setClinicalRecordTypes] = useState([]);
  const [userSpecialists, setUserSpecialists] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [cie11, setCie11] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedSpecialists, setSelectedSpecialists] = useState([]);
  const [selectedClinicalRecordTypes, setSelectedClinicalRecordTypes] = useState([]);
  const [selectedCie11, setSelectedCie11] = useState([]);
  const {
    generateFormatAverageBySpecialist
  } = useAverageBySpecialistFormat();
  const {
    generateFormatDiagnosisGroupedByPatient
  } = useDiagnosisGroupedByPatientFormat();
  const {
    generateFormatDiagnosis
  } = useDiagnosisFormat();
  useEffect(() => {
    if (activeTab === "productivity" && !loadedTabs.includes("productivity")) {
      loadProductivityData();
    } else if (activeTab === "diagnosis" && !loadedTabs.includes("diagnosis")) {
      loadDiagnosisData();
    } else if (activeTab === "diagnosisGrouped" && !loadedTabs.includes("diagnosisGrouped")) {
      loadDiagnosisGroupedData();
    }
  }, [activeTab]);
  useEffect(() => {
    fetchClinicalRecordTypes();
    fetchSpecialists();
    fetchSpecialties();
  }, []);
  async function fetchClinicalRecordTypes() {
    try {
      const response = await clinicalRecordTypeService.getAll();
      setClinicalRecordTypes(response || []);
    } catch (error) {
      console.error("Error fetching clinical record types:", error);
      setClinicalRecordTypes([]);
    }
  }
  async function fetchSpecialists() {
    try {
      const response = await userService.getAll();
      const dataFiltered = (response || []).filter(user => user?.role?.group === "DOCTOR").map(user => {
        const fullName = `${user?.first_name ?? ""} ${user?.middle_name ?? ""} ${user?.last_name ?? ""} ${user?.second_last_name ?? ""}`;
        return {
          ...user,
          fullName
        };
      });
      setUserSpecialists(dataFiltered);
    } catch (error) {
      console.error("Error fetching specialists:", error);
      setUserSpecialists([]);
    }
  }
  async function fetchSpecialties() {
    try {
      const response = await userSpecialtyService.getAll();
      setSpecialties(response || []);
    } catch (error) {
      console.error("Error fetching specialties:", error);
      setSpecialties([]);
    }
  }
  const loadProductivityData = async (filterParams = {
    start_date: dateRange[0] ? formatDate(dateRange[0]) : "",
    end_date: dateRange[1] ? formatDate(dateRange[1]) : ""
  }) => {
    setTableLoading(true);
    try {
      const response = await clinicalRecordService.reportToAverage(filterParams);
      const data = response?.data || response || [];
      setProductivityData(data);
      if (!loadedTabs.includes("productivity")) {
        setLoadedTabs([...loadedTabs, "productivity"]);
      }
    } catch (error) {
      console.error("Error loading productivity data:", error);
      setProductivityData([]);
    } finally {
      setTableLoading(false);
    }
  };
  const loadDiagnosisData = async (filterParams = {
    start_date: dateRange[0] ? formatDate(dateRange[0]) : "",
    end_date: dateRange[1] ? formatDate(dateRange[1]) : ""
  }) => {
    setTableLoading(true);
    try {
      const response = await clinicalRecordService.reportOfDiagnosis(filterParams);
      setDiagnosisData(response || []);
      if (!loadedTabs.includes("diagnosis")) {
        setLoadedTabs([...loadedTabs, "diagnosis"]);
      }
    } catch (error) {
      console.error("Error loading diagnosis data:", error);
      setDiagnosisData([]);
    } finally {
      setTableLoading(false);
    }
  };
  const loadDiagnosisGroupedData = async (filterParams = {
    start_date: dateRange[0] ? formatDate(dateRange[0]) : "",
    end_date: dateRange[1] ? formatDate(dateRange[1]) : ""
  }) => {
    setTableLoading(true);
    try {
      const response = await clinicalRecordService.reportOfDiagnosisPatientsGrouped(filterParams);
      setDiagnosisGroupedData(response || []);
      if (!loadedTabs.includes("diagnosisGrouped")) {
        setLoadedTabs([...loadedTabs, "diagnosisGrouped"]);
      }
    } catch (error) {
      console.error("Error loading diagnosis grouped data:", error);
      setDiagnosisGroupedData([]);
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
      if (selectedClinicalRecordTypes.length > 0) {
        filterParams.clinical_record_type_ids = selectedClinicalRecordTypes.map(clinicalRecordType => clinicalRecordType?.id).filter(Boolean);
      }
      if (selectedSpecialists.length > 0) {
        filterParams.user_ids = selectedSpecialists.map(doctor => doctor?.id).filter(Boolean);
      }
      if (selectedSpecialties.length > 0) {
        filterParams.specialty_ids = selectedSpecialties.map(specialty => specialty?.id).filter(Boolean);
      }
      if (selectedCie11.length > 0) {
        filterParams.cie11 = selectedCie11.map(cie11 => cie11?.codigo).filter(Boolean);
      }

      // Cargar datos para el tab activo
      if (activeTab === "productivity") {
        await loadProductivityData(filterParams);
      } else if (activeTab === "diagnosis") {
        await loadDiagnosisData(filterParams);
      } else if (activeTab === "diagnosisGrouped") {
        await loadDiagnosisGroupedData(filterParams);
      }
    } catch (error) {
      console.error("Error filtering data:", error);
    }
  };
  const formatDate = date => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };
  const search = async event => {
    try {
      const response = await cie11Service.getCie11ByCode(event.query);
      setCie11(response || []);
    } catch (error) {
      console.error("Error buscando CIE11:", error);
      setCie11([]);
    }
  };
  const itemTemplate = item => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ml-2 text-sm text-gray-500"
    }, item?.codigo || ""), /*#__PURE__*/React.createElement("span", {
      className: "font-bold"
    }, " - " + (item?.descripcion?.toLowerCase() || "")));
  };
  const handleExportPDF = (mainNode, data, tab) => {
    switch (tab) {
      case "average":
        return generateFormatAverageBySpecialist(data, mainNode, dateRange, "Impresion");
      case "diagnosis":
        return generateFormatDiagnosis(data, dateRange, "Impresion");
      case "diagnosisGroupedByPatient":
        return generateFormatDiagnosisGroupedByPatient(data, mainNode, dateRange, "Impresion");
      default:
        return null;
    }
  };
  const handleExportExcel = (mainNode, data, tab) => {
    let dataToExport = [];
    let fileName = "";
    switch (tab) {
      case "average":
        dataToExport = mappedDataReportAverage(data);
        fileName = "Promedio_Especialista";
        break;
      case "diagnosisGroupedByPatient":
        dataToExport = mappedDataToDiagnosisGrouped(data);
        fileName = "Diagnosticos_Paciente";
        break;
      default:
        break;
    }
    exportToExcel({
      data: dataToExport,
      fileName: `${fileName}_${(mainNode?.full_name || "sin_nombre").replace(/ /g, "_")}_${new Date().toISOString().slice(0, 10)}`
    });
  };
  const mappedDataReportAverage = data => {
    return (data || []).map(item => {
      return {
        Paciente: `${item?.appointment?.patient?.full_name?.toLowerCase() ?? "Sin nombre"}`,
        Documento: item?.appointment?.patient?.document_number ?? "Sin documento",
        "Fecha y hora cita": (item?.appointment?.appointment_date ?? "") + ", " + (item?.appointment?.appointment_time ?? ""),
        "Inicio consulta": item?.start_time ? formatDateUtils(item.start_time) : "Sin inicio",
        "Fin consulta": item?.created_at_formatted ?? "Sin fin",
        "Duración consulta": item?.consultation_duration ?? "00:00:00",
        Tipo: item?.clinical_record_type?.name ?? "Sin tipo"
      };
    });
  };
  const mappedDataToDiagnosisGrouped = data => {
    return (data || []).map(item => {
      return {
        Paciente: `${item?.appointment?.patient?.first_name ?? ""} ${item?.appointment?.patient?.middle_name ?? ""} ${item?.appointment?.patient?.last_name ?? ""} ${item?.appointment?.patient?.second_last_name ?? ""}`,
        Documento: item?.appointment?.patient?.document_number ?? "Sin documento",
        Edad: getAge(item?.appointment?.patient?.date_of_birth) || "--",
        Genero: genders[item?.appointment?.patient?.gender] || "--",
        "Motivo cita": item?.appointment?.consultation_type || "--",
        "Fecha - cita": (item?.appointment?.appointment_date ?? "") + ", " + (item?.appointment?.appointment_time ?? "") || "--",
        Especialista: `${item?.created_by_user?.first_name ?? ""} ${item?.created_by_user?.middle_name ?? ""} ${item?.created_by_user?.last_name ?? ""} ${item?.created_by_user?.second_last_name ?? ""}`,
        Especialidad: item?.created_by_user?.specialty?.name || "--",
        "Tipo consulta": item?.clinical_record_type?.name || "--",
        Diagnóstico: (item?.diagnosis_main ?? "-") + "-" + (item?.cie11_description?.toLowerCase() ?? "-") || "--"
      };
    });
  };
  const headerTemplate = (mainNode, data, tab) => {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-center w-full p-4"
    }, /*#__PURE__*/React.createElement("div", null, tab === "average" ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, mainNode?.full_name || "Sin nombre"), " - Promedio:", `${mainNode?.average_consultation_duration?.hours || "00"}:${mainNode?.average_consultation_duration?.minutes || "00"}:${mainNode?.average_consultation_duration?.seconds || "00"}`) : /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, (mainNode?.full_name || "sin nombre").toLowerCase()), " - Consultas:", " ", `${data?.length || 0}`)), /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      className: "p-button-rounded p-button-success p-button-sm",
      onClick: e => {
        e.stopPropagation();
        e.preventDefault();
        handleExportExcel(mainNode, data, tab);
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
        handleExportPDF(mainNode, data, tab);
      },
      tooltip: `Exportar a PDF`,
      tooltipOptions: {
        position: "right"
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-file-pdf"
    }))));
  };
  const renderProductivityTable = () => {
    if (tableLoading) {
      return /*#__PURE__*/React.createElement("div", {
        className: "flex justify-content-center align-items-center",
        style: {
          height: "200px"
        }
      }, /*#__PURE__*/React.createElement(ProgressSpinner, null));
    }
    if (!productivityData || productivityData.length === 0) {
      return /*#__PURE__*/React.createElement("p", null, "No hay datos para mostrar");
    }
    return /*#__PURE__*/React.createElement(Accordion, {
      activeIndex: activeIndex,
      onTabChange: e => setActiveIndex(e.index)
    }, productivityData.map((specialist, index) => {
      if (!specialist) return null;
      return /*#__PURE__*/React.createElement(AccordionTab, {
        key: specialist?.id || index,
        header: headerTemplate(specialist, specialist?.clinical_records || [], "average")
      }, /*#__PURE__*/React.createElement(DataTable, {
        value: specialist?.clinical_records || [],
        emptyMessage: `No hay citas`,
        className: "p-datatable-sm",
        showGridlines: true,
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
          return rowData?.appointment?.patient?.full_name?.toLowerCase() || "Sin nombre";
        },
        sortable: true,
        style: {
          minWidth: "200px"
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "patient.id",
        header: "N\xB0 Documento",
        body: rowData => {
          return rowData?.appointment?.patient?.document_number ?? "No agendada";
        },
        sortable: true,
        style: {
          minWidth: "150px"
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "date",
        header: "Fecha y hora - Cita",
        body: rowData => (rowData?.appointment?.appointment_date || "") + ", " + (rowData?.appointment?.appointment_time || "") || "No agendada",
        sortable: true,
        style: {
          minWidth: "180px"
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "start_time",
        header: "Inicio consulta",
        body: rowData => /*#__PURE__*/React.createElement("span", {
          className: "font-bold"
        }, rowData?.start_time ? formatDateUtils(rowData.start_time) : "Sin inicio"),
        sortable: true,
        style: {
          minWidth: "150px"
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "created_at",
        header: "Fin consulta",
        body: rowData => /*#__PURE__*/React.createElement("span", {
          className: "font-bold"
        }, rowData?.created_at_formatted || "Sin fin"),
        sortable: true,
        style: {
          minWidth: "150px"
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "consultation_duration",
        header: "Duraci\xF3n consulta",
        body: rowData => /*#__PURE__*/React.createElement("span", {
          className: "font-bold"
        }, rowData?.consultation_duration ?? "00:00:00"),
        sortable: true,
        style: {
          minWidth: "150px"
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "clinical_record_type",
        header: "Tipo",
        body: rowData => /*#__PURE__*/React.createElement("span", {
          className: "font-bold"
        }, rowData?.clinical_record_type?.name ?? "Sin tipo"),
        sortable: true,
        style: {
          minWidth: "150px"
        }
      })));
    }));
  };
  const renderDiagnosisTable = () => {
    if (tableLoading) {
      return /*#__PURE__*/React.createElement("div", {
        className: "flex justify-content-center align-items-center",
        style: {
          height: "200px"
        }
      }, /*#__PURE__*/React.createElement(ProgressSpinner, null));
    }
    if (!diagnosisData || diagnosisData.length === 0) {
      return /*#__PURE__*/React.createElement("p", null, "No hay datos para mostrar");
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex flex-column gap-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-end align-items-center mb-3"
    }, /*#__PURE__*/React.createElement(Button, {
      className: "p-button-rounded p-button-secondary p-button-sm",
      onClick: e => {
        e.stopPropagation();
        e.preventDefault();
        handleExportPDF(diagnosisData, diagnosisData, "diagnosis");
      },
      tooltip: `Exportar a PDF`,
      tooltipOptions: {
        position: "right"
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-file-pdf"
    }))), /*#__PURE__*/React.createElement(DataTable, {
      value: diagnosisData,
      emptyMessage: `No hay citas`,
      className: "p-datatable-sm",
      showGridlines: true,
      paginator: true,
      rows: 10,
      rowsPerPageOptions: [5, 10, 25],
      scrollable: true,
      scrollHeight: "400px",
      globalFilter: globalFilter
    }, /*#__PURE__*/React.createElement(Column, {
      field: "patient",
      header: "Paciente",
      body: rowData => {
        const patientFullName = `${rowData?.appointment?.patient?.first_name ?? ""} ${rowData?.appointment?.patient?.middle_name ?? ""} ${rowData?.appointment?.patient?.last_name ?? ""} ${rowData?.appointment?.patient?.second_last_name ?? ""}`;
        return patientFullName.toLowerCase() || "--";
      },
      sortable: true,
      style: {
        minWidth: "200px"
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "documentNumber",
      header: "N\xB0 Documento",
      body: rowData => rowData?.appointment?.patient?.document_number || "--",
      sortable: true,
      style: {
        minWidth: "150px"
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "age",
      header: "Edad",
      body: rowData => {
        return getAge(rowData?.appointment?.patient?.date_of_birth) || "--";
      },
      sortable: true,
      style: {
        minWidth: "100px"
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "gender",
      header: "Genero",
      body: rowData => {
        return genders[rowData?.appointment?.patient?.gender] || "--";
      },
      sortable: true,
      style: {
        minWidth: "120px"
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "consultationType",
      header: "Motivo de cita",
      body: rowData => {
        return rowData?.appointment?.consultation_type || "--";
      },
      sortable: true,
      style: {
        minWidth: "150px"
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "appointmentDate",
      header: "Fecha - cita",
      body: rowData => {
        return (rowData?.appointment?.appointment_date || "") + ", " + (rowData?.appointment?.appointment_time || "") || "--";
      },
      sortable: true,
      style: {
        minWidth: "180px"
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "specialist",
      header: "Especialista",
      body: rowData => {
        const doctorFullName = `${rowData?.created_by_user?.first_name ?? ""} ${rowData?.created_by_user?.middle_name ?? ""} ${rowData?.created_by_user?.last_name ?? ""} ${rowData?.created_by_user?.second_last_name ?? ""}`;
        return doctorFullName || "--";
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
      }, rowData?.created_by_user?.specialty?.name || "--"),
      sortable: true,
      style: {
        minWidth: "150px"
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "diagnosis",
      header: "Diagnostico",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        className: "font-bold"
      }, (rowData?.diagnosis_main ?? "-") + "-" + (rowData?.cie11_description?.toLowerCase() ?? "-") || "--"),
      sortable: true,
      style: {
        minWidth: "200px"
      }
    })));
  };
  const renderDiagnosisGroupedTable = () => {
    if (tableLoading) {
      return /*#__PURE__*/React.createElement("div", {
        className: "flex justify-content-center align-items-center",
        style: {
          height: "200px"
        }
      }, /*#__PURE__*/React.createElement(ProgressSpinner, null));
    }
    if (!diagnosisGroupedData || diagnosisGroupedData.length === 0) {
      return /*#__PURE__*/React.createElement("p", null, "No hay datos para mostrar");
    }
    return /*#__PURE__*/React.createElement(Accordion, {
      activeIndex: activeIndex,
      onTabChange: e => setActiveIndex(e.index)
    }, diagnosisGroupedData.map((patient, index) => {
      if (!patient) return null;
      return /*#__PURE__*/React.createElement(AccordionTab, {
        key: patient?.id || index,
        header: headerTemplate(patient, patient?.clinical_records || [], "diagnosisGroupedByPatient")
      }, /*#__PURE__*/React.createElement(DataTable, {
        value: patient?.clinical_records || [],
        emptyMessage: `No hay citas`,
        className: "p-datatable-sm",
        showGridlines: true,
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
          const patientFullName = `${rowData?.appointment?.patient?.first_name ?? ""} ${rowData?.appointment?.patient?.middle_name ?? ""} ${rowData?.appointment?.patient?.last_name ?? ""} ${rowData?.appointment?.patient?.second_last_name ?? ""}`;
          return patientFullName.toLowerCase() || "--";
        },
        sortable: true,
        style: {
          minWidth: "200px"
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "documentNumber",
        header: "N\xB0 Documento",
        body: rowData => rowData?.appointment?.patient?.document_number || "--",
        sortable: true,
        style: {
          minWidth: "150px"
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "age",
        header: "Edad",
        body: rowData => {
          return getAge(rowData?.appointment?.patient?.date_of_birth) || "--";
        },
        sortable: true,
        style: {
          minWidth: "100px"
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "gender",
        header: "Genero",
        body: rowData => {
          return genders[rowData?.appointment?.patient?.gender] || "--";
        },
        sortable: true,
        style: {
          minWidth: "120px"
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "consultationType",
        header: "Motivo de cita",
        body: rowData => {
          return rowData?.appointment?.consultation_type || "--";
        },
        sortable: true,
        style: {
          minWidth: "150px"
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "appointmentDate",
        header: "Fecha - cita",
        body: rowData => {
          return (rowData?.appointment?.appointment_date || "") + ", " + (rowData?.appointment?.appointment_time || "") || "--";
        },
        sortable: true,
        style: {
          minWidth: "180px"
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "specialist",
        header: "Especialista",
        body: rowData => {
          const doctorFullName = `${rowData?.created_by_user?.first_name ?? ""} ${rowData?.created_by_user?.middle_name ?? ""} ${rowData?.created_by_user?.last_name ?? ""} ${rowData?.created_by_user?.second_last_name ?? ""}`;
          return doctorFullName || "--";
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
        }, rowData?.created_by_user?.specialty?.name || "--"),
        sortable: true,
        style: {
          minWidth: "150px"
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "diagnosis",
        header: "Diagnostico",
        body: rowData => /*#__PURE__*/React.createElement("span", {
          className: "font-bold"
        }, (rowData?.diagnosis_main ?? "-") + "-" + (rowData?.cie11_description?.toLowerCase() ?? "-") || "--"),
        sortable: true,
        style: {
          minWidth: "200px"
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
  }, "Tipo de consulta"), /*#__PURE__*/React.createElement(MultiSelect, {
    value: selectedClinicalRecordTypes,
    onChange: e => setSelectedClinicalRecordTypes(e.value),
    options: clinicalRecordTypes,
    optionLabel: "name",
    filter: true,
    placeholder: "Seleccione tipo de historia",
    maxSelectedLabels: 3,
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Especialista"), /*#__PURE__*/React.createElement(MultiSelect, {
    value: selectedSpecialists,
    onChange: e => setSelectedSpecialists(e.value),
    options: userSpecialists,
    optionLabel: "fullName",
    filter: true,
    placeholder: "Seleccione especialista",
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
    placeholder: "Seleccione especialidad",
    maxSelectedLabels: 3,
    className: "w-100"
  })), (activeTab === "diagnosis" || activeTab === "diagnosisGrouped") && /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "CIE-11"), /*#__PURE__*/React.createElement(AutoComplete, {
    field: "codigo",
    multiple: true,
    value: selectedCie11,
    suggestions: cie11,
    completeMethod: search,
    placeholder: "Escribe para buscar el CIE-11 por su c\xF3digo",
    onChange: e => setSelectedCie11(e.value),
    itemTemplate: itemTemplate,
    delay: 300,
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
    className: `tab-item ${activeTab === "productivity" ? "active" : ""}`,
    onClick: () => setActiveTab("productivity")
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-chart-line"
  }), "Productividad"), /*#__PURE__*/React.createElement("button", {
    className: `tab-item ${activeTab === "diagnosis" ? "active" : ""}`,
    onClick: () => setActiveTab("diagnosis")
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-stethoscope"
  }), "Diagnosticos"), /*#__PURE__*/React.createElement("button", {
    className: `tab-item ${activeTab === "diagnosisGrouped" ? "active" : ""}`,
    onClick: () => setActiveTab("diagnosisGrouped")
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-users"
  }), "Diagnosticos Agrupados")), /*#__PURE__*/React.createElement("div", {
    className: "tabs-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: `tab-panel ${activeTab === "productivity" ? "active" : ""}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xl font-semibold"
  }, "Productividad Promedio - Especialista"), /*#__PURE__*/React.createElement("span", {
    className: "p-input-icon-left"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-search"
  }), /*#__PURE__*/React.createElement(InputText, {
    type: "search",
    onInput: e => setGlobalFilter(e.currentTarget.value),
    placeholder: "Buscar..."
  }))), renderProductivityTable()), /*#__PURE__*/React.createElement("div", {
    className: `tab-panel ${activeTab === "diagnosis" ? "active" : ""}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xl font-semibold"
  }, "Diagnosticos"), /*#__PURE__*/React.createElement("span", {
    className: "p-input-icon-left"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-search"
  }), /*#__PURE__*/React.createElement(InputText, {
    type: "search",
    onInput: e => setGlobalFilter(e.currentTarget.value),
    placeholder: "Buscar..."
  }))), renderDiagnosisTable()), /*#__PURE__*/React.createElement("div", {
    className: `tab-panel ${activeTab === "diagnosisGrouped" ? "active" : ""}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xl font-semibold"
  }, "Diagnosticos Agrupados - Pacientes"), /*#__PURE__*/React.createElement("span", {
    className: "p-input-icon-left"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-search"
  }), /*#__PURE__*/React.createElement(InputText, {
    type: "search",
    onInput: e => setGlobalFilter(e.currentTarget.value),
    placeholder: "Buscar..."
  }))), renderDiagnosisGroupedTable())))))))));
};