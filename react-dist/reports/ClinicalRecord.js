import React, { useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { Accordion, AccordionTab } from "primereact/accordion";
import { TabView, TabPanel } from "primereact/tabview";
import { clinicalRecordService, userService, userSpecialtyService, clinicalRecordTypeService, cie11Service } from "../../services/api/index.js";
import { formatDate as formatDateUtils, getAge } from "../../services/utilidades.js";
import { genders } from "../../services/commons.js";
import { useAverageBySpecialistFormat } from "../documents-generation/hooks/reports-medical/clinicalRecords/useAverageBySpecialistFormat.js";
import { useDiagnosisGroupedByPatientFormat } from "../documents-generation/hooks/reports-medical/clinicalRecords/useDiagnosisGroupedByPatient.js";
import { useDiagnosisFormat } from "../documents-generation/hooks/reports-medical/clinicalRecords/useDiagnosisFormat.js";
import { exportToExcel } from "../accounting/utils/ExportToExcelOptions.js";
import { AutoComplete } from "primereact/autocomplete";
export const ClinicalRecord = () => {
  const today = new Date();
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(today.getDate() - 5);

  // State for filters
  const [dateRange, setDateRange] = useState([fiveDaysAgo, today]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [loadedTabs, setLoadedTabs] = useState([]);

  // Estados para datos de cada tab
  const [tab1Data, setTab1Data] = useState([]);
  const [tab2Data, setTab2Data] = useState([]);
  const [tab3Data, setTab3Data] = useState([]);

  // Estados para filtros (puedes personalizar según necesites)
  const [clinicalRecordTypes, setClinicalRecordTypes] = useState([]);
  const [userSpecialists, setUserSpecialists] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedSpecialists, setSelectedSpecialists] = useState([]);
  const [selectedClinicalRecordTypes, setSelectedClinicalRecordTypes] = useState([]);
  const [selectedCie11, setSelectedCie11] = useState([]);
  const [cie11, setCie11] = useState([]);
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
    // Cargar datos cuando se cambia de tab (lazy loading)
    if (activeTabIndex === 0) {
      loadTab1Data();
    } else if (activeTabIndex === 1) {
      loadTab2Data();
    } else if (activeTabIndex === 2) {
      loadTab3Data();
    }
  }, [activeTabIndex]);
  useEffect(() => {
    fetchClinicalRecordTypes();
    fetchSpecialists();
    fetchSpecialties();
  }, []);
  async function fetchClinicalRecordTypes() {
    try {
      const response = await clinicalRecordTypeService.getAll();
      setClinicalRecordTypes(response);
    } catch (error) {
      console.error("Error fetching clinical record types:", error);
    }
  }
  async function fetchSpecialists() {
    try {
      const response = await userService.getAll();
      const dataFiltered = response.filter(user => user.role.group === "DOCTOR").map(user => {
        const fullName = `${user.first_name ?? ""} ${user.middle_name ?? ""} ${user.last_name ?? ""} ${user.second_last_name ?? ""}`;
        return {
          ...user,
          fullName
        };
      });
      setUserSpecialists(dataFiltered);
    } catch (error) {
      console.error("Error fetching specialists:", error);
    }
  }
  async function fetchSpecialties() {
    try {
      const response = await userSpecialtyService.getAll();
      setSpecialties(response);
    } catch (error) {
      console.error("Error fetching specialties:", error);
    }
  }
  const loadTab1Data = async (filterParams = {
    start_date: dateRange[0] ? formatDate(dateRange[0]) : "",
    end_date: dateRange[1] ? formatDate(dateRange[1]) : ""
  }) => {
    setTableLoading(true);
    try {
      const response = await clinicalRecordService.reportToAverage(filterParams);
      const data = response.data || response;
      setTab1Data(data);

      // Marcar tab como cargado
      if (!loadedTabs.includes(0)) {
        setLoadedTabs([...loadedTabs, 0]);
      }
    } catch (error) {
      console.error("Error loading Tab 1 data:", error);
    } finally {
      setTableLoading(false);
    }
  };
  const loadTab2Data = async (filterParams = {
    start_date: dateRange[0] ? formatDate(dateRange[0]) : "",
    end_date: dateRange[1] ? formatDate(dateRange[1]) : ""
  }) => {
    setTableLoading(true);
    try {
      const response = await clinicalRecordService.reportOfDiagnosis(filterParams);
      setTab2Data(response);

      // Marcar tab como cargado
      if (!loadedTabs.includes(1)) {
        setLoadedTabs([...loadedTabs, 1]);
      }
    } catch (error) {
      console.error("Error loading Tab 2 data:", error);
    } finally {
      setTableLoading(false);
    }
  };
  const loadTab3Data = async (filterParams = {
    start_date: dateRange[0] ? formatDate(dateRange[0]) : "",
    end_date: dateRange[1] ? formatDate(dateRange[1]) : ""
  }) => {
    setTableLoading(true);
    try {
      const response = await clinicalRecordService.reportOfDiagnosisPatientsGrouped(filterParams);
      setTab3Data(response);

      // Marcar tab como cargado
      if (!loadedTabs.includes(2)) {
        setLoadedTabs([...loadedTabs, 2]);
      }
    } catch (error) {
      console.error("Error loading Tab 3 data:", error);
    } finally {
      setTableLoading(false);
    }
  };
  const handleFilter = async () => {
    try {
      const filterParams = {
        start_date: dateRange[0] ? formatDate(dateRange[0]) : "",
        end_date: dateRange[1] ? formatDate(dateRange[1]) : ""
        // Agregar más parámetros según necesites
      };
      if (selectedClinicalRecordTypes.length > 0) {
        filterParams.clinical_record_type_ids = selectedClinicalRecordTypes.map(clinicalRecordType => clinicalRecordType.id);
      }
      if (selectedSpecialists.length > 0) {
        filterParams.user_ids = selectedSpecialists.map(doctor => doctor.id);
      }
      if (selectedSpecialties.length > 0) {
        filterParams.specialty_ids = selectedSpecialties.map(specialty => specialty.id);
      }
      if (selectedCie11.length > 0) {
        filterParams.cie11 = selectedCie11.map(cie11 => cie11.codigo);
      }

      // Cargar datos para el tab activo
      if (activeTabIndex === 0) {
        await loadTab1Data(filterParams);
      } else if (activeTabIndex === 1) {
        await loadTab2Data(filterParams);
      } else if (activeTabIndex === 2) {
        await loadTab3Data(filterParams);
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
      // Ejecutar endpoint con el término de búsqueda
      const response = await cie11Service.getCie11ByCode(event.query);
      setCie11(response);
    } catch (error) {
      console.error("Error buscando países:", error);
      setCie11([]);
    }
  };
  const itemTemplate = item => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ml-2 text-sm text-gray-500"
    }, item.codigo), /*#__PURE__*/React.createElement("span", {
      className: "font-bold"
    }, " - " + item.descripcion.toLowerCase()));
  };
  const handleExportPDF = (mainNode, data, tab) => {
    switch (tab) {
      case "average":
        return generateFormatAverageBySpecialist(data, mainNode, dateRange, "Impresion");
      case "diagnosis":
        return generateFormatDiagnosis(data, dateRange, "Impresion");
      case "diagnosisGroupedByPatient":
        return generateFormatDiagnosisGroupedByPatient(data, mainNode, dateRange, "Impresion");
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
      fileName: `${fileName}_${mainNode.full_name.replace(/ /g, "_")}_${new Date().toISOString().slice(0, 10)}`
    });
  };
  const mappedDataReportAverage = data => {
    return data.map(item => {
      return {
        Paciente: `${item.appointment?.patient?.full_name.toLowerCase() ?? "Sin nombre"}`,
        Documento: item?.appointment?.patient?.document_number,
        "Fecha y hora cita": item?.appointment?.appointment_date + ", " + item?.appointment?.appointment_time,
        "Inicio consulta": item?.start_time ? formatDateUtils(item.start_time) : "Sin inicio",
        "Fin consulta": item?.created_at_formatted,
        "Duración consulta": item?.consultation_duration ?? "00:00:00",
        Tipo: item?.clinical_record_type?.name ?? "Sin tipo"
      };
    });
  };
  const mappedDataToDiagnosisGrouped = data => {
    return data.map(item => {
      return {
        Paciente: `${item?.appointment?.patient?.first_name ?? ""} ${item?.appointment?.patient?.middle_name ?? ""} ${item?.appointment?.patient?.last_name ?? ""} ${item?.appointment?.patient?.second_last_name ?? ""}`,
        Documento: item?.appointment?.patient?.document_number,
        Edad: getAge(item?.appointment?.patient?.date_of_birth) || "--",
        Genero: genders[item?.appointment?.patient?.gender],
        "Motivo cita": item?.appointment?.consultation_type || "--",
        "Fecha - cita": item?.appointment?.appointment_date + ", " + item?.appointment?.appointment_time || "--",
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
    }, /*#__PURE__*/React.createElement("div", null, tab === "average" ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, mainNode.full_name), " - Promedio:", `${mainNode.average_consultation_duration.hours}:${mainNode.average_consultation_duration.minutes}:${mainNode.average_consultation_duration.seconds}`) : /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, mainNode.full_name.toLowerCase()), " - Consultas:", " ", `${data.length}`)), /*#__PURE__*/React.createElement("div", {
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
  const renderTab1Content = () => {
    if (tableLoading) {
      return /*#__PURE__*/React.createElement("div", {
        className: "flex justify-content-center align-items-center",
        style: {
          height: "200px"
        }
      }, /*#__PURE__*/React.createElement(ProgressSpinner, null));
    }
    if (tab1Data.length === 0) {
      return /*#__PURE__*/React.createElement("p", null, "No hay datos para mostrar");
    }

    // TODO: Implementar renderizado específico para Tab 1
    return /*#__PURE__*/React.createElement(Accordion, {
      activeIndex: activeIndex,
      onTabChange: e => setActiveIndex(e.index)
    }, tab1Data.map((specialist, index) => {
      return /*#__PURE__*/React.createElement(AccordionTab, {
        key: specialist.id || index,
        header: headerTemplate(specialist, specialist.clinical_records || [], "average")
      }, /*#__PURE__*/React.createElement(DataTable, {
        value: specialist.clinical_records,
        emptyMessage: `No hay citas`,
        className: "p-datatable-sm",
        showGridlines: true,
        paginator: true,
        rows: 10,
        rowsPerPageOptions: [5, 10, 25],
        sortMode: "multiple"
      }, /*#__PURE__*/React.createElement(Column, {
        field: "patient",
        header: "Paciente",
        body: rowData => {
          return rowData?.appointment?.patient?.full_name.toLowerCase() || "Sin nombre";
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "patient.id",
        header: "N\xB0 Documento",
        body: rowData => {
          return rowData?.appointment?.patient.document_number ?? "No agendada";
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "date",
        header: "Fecha y hora - Cita",
        body: rowData => rowData?.appointment?.appointment_date + ", " + rowData?.appointment?.appointment_time || "No agendada"
      }), /*#__PURE__*/React.createElement(Column, {
        field: "start_time",
        header: "Inicio consulta",
        body: rowData => /*#__PURE__*/React.createElement("span", {
          className: "font-bold"
        }, rowData.start_time ? formatDateUtils(rowData.start_time) : "Sin inicio")
      }), /*#__PURE__*/React.createElement(Column, {
        field: "created_at",
        header: "Fin consulta",
        body: rowData => /*#__PURE__*/React.createElement("span", {
          className: "font-bold"
        }, rowData.created_at_formatted)
      }), /*#__PURE__*/React.createElement(Column, {
        field: "consultation_duration",
        header: "Duraci\xF3n consulta",
        body: rowData => /*#__PURE__*/React.createElement("span", {
          className: "font-bold"
        }, rowData.consultation_duration ?? "00:00:00")
      }), /*#__PURE__*/React.createElement(Column, {
        field: "consultation_duration",
        header: "Tipo",
        body: rowData => /*#__PURE__*/React.createElement("span", {
          className: "font-bold"
        }, rowData.clinical_record_type.name ?? "Sin tipo")
      })));
    }));
  };
  const renderTab2Content = () => {
    if (tableLoading) {
      return /*#__PURE__*/React.createElement("div", {
        className: "flex justify-content-center align-items-center",
        style: {
          height: "200px"
        }
      }, /*#__PURE__*/React.createElement(ProgressSpinner, null));
    }
    if (tab2Data.length === 0) {
      return /*#__PURE__*/React.createElement("p", null, "No hay datos para mostrar");
    }

    // TODO: Implementar renderizado específico para Tab 2
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex flex-column gap-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-end align-items-center"
    }, /*#__PURE__*/React.createElement(Button, {
      className: "p-button-rounded p-button-secondary p-button-sm",
      onClick: e => {
        e.stopPropagation();
        e.preventDefault();
        handleExportPDF(tab2Data, tab2Data, "diagnosis");
      },
      tooltip: `Exportar a PDF`,
      tooltipOptions: {
        position: "right"
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-file-pdf"
    }))), /*#__PURE__*/React.createElement(DataTable, {
      value: tab2Data,
      emptyMessage: `No hay citas`,
      className: "p-datatable-sm",
      showGridlines: true,
      paginator: true,
      rows: 10,
      rowsPerPageOptions: [5, 10, 25]
    }, /*#__PURE__*/React.createElement(Column, {
      field: "patient",
      header: "Paciente",
      body: rowData => {
        const patientFullName = `${rowData?.appointment?.patient?.first_name ?? ""} ${rowData?.appointment?.patient?.middle_name ?? ""} ${rowData?.appointment?.patient?.last_name ?? ""} ${rowData?.appointment?.patient?.second_last_name ?? ""}`;
        return patientFullName.toLowerCase() || "--";
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "documentNumber",
      header: "N\xB0 Documento",
      body: rowData => rowData?.appointment?.patient?.document_number || "--"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "age",
      header: "Edad",
      body: rowData => {
        return getAge(rowData?.appointment?.patient?.date_of_birth) || "--";
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "gender",
      header: "Genero",
      body: rowData => {
        return genders[rowData?.appointment?.patient?.gender];
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "consultationType",
      header: "Motivo de cita",
      body: rowData => {
        return rowData?.appointment?.consultation_type || "--";
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "appointmentDate",
      header: "Fecha - cita",
      body: rowData => {
        return rowData?.appointment?.appointment_date + ", " + rowData?.appointment?.appointment_time || "--";
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "specialist",
      header: "Especialista",
      body: rowData => {
        const doctorFullName = `${rowData?.created_by_user?.first_name ?? ""} ${rowData?.created_by_user?.middle_name ?? ""} ${rowData?.created_by_user?.last_name ?? ""} ${rowData?.created_by_user?.second_last_name ?? ""}`;
        return doctorFullName;
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "specialty",
      header: "Especialidad",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        className: "font-bold"
      }, rowData?.created_by_user?.specialty?.name)
    }), /*#__PURE__*/React.createElement(Column, {
      field: "diagnosis",
      header: "Diagnostico",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        className: "font-bold"
      }, (rowData?.diagnosis_main ?? "-") + "-" + (rowData?.cie11_description?.toLowerCase() ?? "-") || "--")
    })));
  };
  const renderTab3Content = () => {
    if (tableLoading) {
      return /*#__PURE__*/React.createElement("div", {
        className: "flex justify-content-center align-items-center",
        style: {
          height: "200px"
        }
      }, /*#__PURE__*/React.createElement(ProgressSpinner, null));
    }
    if (tab3Data.length === 0) {
      return /*#__PURE__*/React.createElement("p", null, "No hay datos para mostrar en el Tab 3");
    }
    return /*#__PURE__*/React.createElement(Accordion, {
      activeIndex: activeIndex,
      onTabChange: e => setActiveIndex(e.index)
    }, tab3Data.map((patient, index) => {
      return /*#__PURE__*/React.createElement(AccordionTab, {
        key: patient.id || index,
        header: headerTemplate(patient, patient.clinical_records || [], "diagnosisGroupedByPatient")
      }, /*#__PURE__*/React.createElement(DataTable, {
        value: patient.clinical_records,
        emptyMessage: `No hay citas`,
        className: "p-datatable-sm",
        showGridlines: true,
        paginator: true,
        rows: 10,
        rowsPerPageOptions: [5, 10, 25],
        sortMode: "multiple"
      }, /*#__PURE__*/React.createElement(Column, {
        field: "patient",
        header: "Paciente",
        body: rowData => {
          const patientFullName = `${rowData?.appointment?.patient?.first_name ?? ""} ${rowData?.appointment?.patient?.middle_name ?? ""} ${rowData?.appointment?.patient?.last_name ?? ""} ${rowData?.appointment?.patient?.second_last_name ?? ""}`;
          return patientFullName.toLowerCase() || "--";
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "documentNumber",
        header: "N\xB0 Documento",
        body: rowData => rowData?.appointment?.patient?.document_number || "--"
      }), /*#__PURE__*/React.createElement(Column, {
        field: "age",
        header: "Edad",
        body: rowData => {
          return getAge(rowData?.appointment?.patient?.date_of_birth) || "--";
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "gender",
        header: "Genero",
        body: rowData => {
          return genders[rowData?.appointment?.patient?.gender];
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "consultationType",
        header: "Motivo de cita",
        body: rowData => {
          return rowData?.appointment?.consultation_type || "--";
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "appointmentDate",
        header: "Fecha - cita",
        body: rowData => {
          return rowData?.appointment?.appointment_date + ", " + rowData?.appointment?.appointment_time || "--";
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "consultationType",
        header: "Especialista",
        body: rowData => {
          const doctorFullName = `${rowData?.created_by_user?.first_name ?? ""} ${rowData?.created_by_user?.middle_name ?? ""} ${rowData?.created_by_user?.last_name ?? ""} ${rowData?.created_by_user?.second_last_name ?? ""}`;
          return doctorFullName;
        }
      }), /*#__PURE__*/React.createElement(Column, {
        field: "specialty",
        header: "Especialidad",
        body: rowData => /*#__PURE__*/React.createElement("span", {
          className: "font-bold"
        }, rowData?.created_by_user?.specialty?.name)
      }), /*#__PURE__*/React.createElement(Column, {
        field: "diagnosis",
        header: "Diagnostico",
        body: rowData => /*#__PURE__*/React.createElement("span", {
          className: "font-bold"
        }, (rowData?.diagnosis_main ?? "-") + "-" + (rowData?.cie11_description?.toLowerCase() ?? "-") || "--")
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
  }, /*#__PURE__*/React.createElement("div", {
    className: "content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pb-9"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "mb-4"
  }, "Reporte Consultas"), /*#__PURE__*/React.createElement("div", {
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
  }, "Tipo de consulta "), /*#__PURE__*/React.createElement(MultiSelect, {
    value: selectedClinicalRecordTypes,
    onChange: e => setSelectedClinicalRecordTypes(e.value),
    options: clinicalRecordTypes // TODO: Poblar con opciones
    ,
    optionLabel: "name",
    filter: true,
    placeholder: "Seleccione tipo de historia",
    maxSelectedLabels: 3,
    className: "w-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-6 md:col-6"
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
    placeholder: "Seleccione especialidad",
    maxSelectedLabels: 3,
    className: "w-full"
  })), activeTabIndex === 1 || activeTabIndex === 2 ? /*#__PURE__*/React.createElement("div", {
    className: "col-6 md:col-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Cie11"), /*#__PURE__*/React.createElement(AutoComplete, {
    field: "codigo",
    multiple: true,
    value: selectedCie11,
    suggestions: cie11,
    completeMethod: search,
    placeholder: "Escribe para buscar el cie11 por su c\xF3digo",
    onChange: e => setSelectedCie11(e.value),
    itemTemplate: itemTemplate,
    delay: 300
  })) : ""), /*#__PURE__*/React.createElement("div", {
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
    header: "Productividad Promedio - Especialista"
  }, renderTab1Content()), /*#__PURE__*/React.createElement(TabPanel, {
    header: "Diagnosticos"
  }, renderTab2Content()), /*#__PURE__*/React.createElement(TabPanel, {
    header: "Diagnosticos agrupado - Pacientes"
  }, renderTab3Content()))))));
};