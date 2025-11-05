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
import {
  clinicalRecordService,
  userService,
  userSpecialtyService,
  clinicalRecordTypeService,
  cie11Service,
} from "../../services/api/index";
import {
  formatDate as formatDateUtils,
  getAge,
} from "../../services/utilidades.js";
import { genders } from "../../services/commons.js";
import { useAverageBySpecialistFormat } from "../documents-generation/hooks/reports-medical/clinicalRecords/useAverageBySpecialistFormat";
import { useDiagnosisGroupedByPatientFormat } from "../documents-generation/hooks/reports-medical/clinicalRecords/useDiagnosisGroupedByPatient.js";
import { useDiagnosisFormat } from "../documents-generation/hooks/reports-medical/clinicalRecords/useDiagnosisFormat.js";
import { exportToExcel } from "../accounting/utils/ExportToExcelOptions";

export const ClinicalRecord = () => {
  const today = new Date();
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(today.getDate() - 5);

  // State for filters
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    fiveDaysAgo,
    today,
  ]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | number[]>(0);
  const [activeTab, setActiveTab] = useState("productivity");
  const [loadedTabs, setLoadedTabs] = useState<string[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Estados para datos de cada tab
  const [productivityData, setProductivityData] = useState<any[]>([]);
  const [diagnosisData, setDiagnosisData] = useState<any[]>([]);
  const [diagnosisGroupedData, setDiagnosisGroupedData] = useState<any[]>([]);

  // Estados para filtros
  const [clinicalRecordTypes, setClinicalRecordTypes] = useState<any[]>([]);
  const [userSpecialists, setUserSpecialists] = useState<any[]>([]);
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [cie11, setCie11] = useState<any[]>([]);

  const [selectedSpecialties, setSelectedSpecialties] = useState<any[]>([]);
  const [selectedSpecialists, setSelectedSpecialists] = useState<any[]>([]);
  const [selectedClinicalRecordTypes, setSelectedClinicalRecordTypes] =
    useState<any[]>([]);
  const [selectedCie11, setSelectedCie11] = useState<any[]>([]);

  const { generateFormatAverageBySpecialist } = useAverageBySpecialistFormat();
  const { generateFormatDiagnosisGroupedByPatient } =
    useDiagnosisGroupedByPatientFormat();
  const { generateFormatDiagnosis } = useDiagnosisFormat();

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
      const dataFiltered = (response || [])
        .filter((user: any) => user?.role?.group === "DOCTOR")
        .map((user: any) => {
          const fullName = `${user?.first_name ?? ""} ${user?.middle_name ?? ""
            } ${user?.last_name ?? ""} ${user?.second_last_name ?? ""}`;

          return {
            ...user,
            fullName,
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

  const loadProductivityData = async (
    filterParams: any = {
      start_date: dateRange[0] ? formatDate(dateRange[0]) : "",
      end_date: dateRange[1] ? formatDate(dateRange[1]) : "",
    }
  ) => {
    setTableLoading(true);
    try {
      const response = await clinicalRecordService.reportToAverage(
        filterParams
      );
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

  const loadDiagnosisData = async (
    filterParams: any = {
      start_date: dateRange[0] ? formatDate(dateRange[0]) : "",
      end_date: dateRange[1] ? formatDate(dateRange[1]) : "",
    }
  ) => {
    setTableLoading(true);
    try {
      const response = await clinicalRecordService.reportOfDiagnosis(
        filterParams
      );
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

  const loadDiagnosisGroupedData = async (
    filterParams: any = {
      start_date: dateRange[0] ? formatDate(dateRange[0]) : "",
      end_date: dateRange[1] ? formatDate(dateRange[1]) : "",
    }
  ) => {
    setTableLoading(true);
    try {
      const response =
        await clinicalRecordService.reportOfDiagnosisPatientsGrouped(
          filterParams
        );
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
      const filterParams: any = {
        start_date: dateRange[0] ? formatDate(dateRange[0]) : "",
        end_date: dateRange[1] ? formatDate(dateRange[1]) : "",
      };

      if (selectedClinicalRecordTypes.length > 0) {
        filterParams.clinical_record_type_ids = selectedClinicalRecordTypes.map(
          (clinicalRecordType: any) => clinicalRecordType?.id
        ).filter(Boolean);
      }
      if (selectedSpecialists.length > 0) {
        filterParams.user_ids = selectedSpecialists.map(
          (doctor: any) => doctor?.id
        ).filter(Boolean);
      }
      if (selectedSpecialties.length > 0) {
        filterParams.specialty_ids = selectedSpecialties.map(
          (specialty: any) => specialty?.id
        ).filter(Boolean);
      }

      if (selectedCie11.length > 0) {
        filterParams.cie11 = selectedCie11.map((cie11: any) => cie11?.codigo).filter(Boolean);
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

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const search = async (event: any) => {
    try {
      const response = await cie11Service.getCie11ByCode(event.query);
      setCie11(response || []);
    } catch (error) {
      console.error("Error buscando CIE11:", error);
      setCie11([]);
    }
  };

  const itemTemplate = (item: any) => {
    return (
      <div className="flex align-items-center">
        <span className="ml-2 text-sm text-gray-500">{item?.codigo || ""}</span>
        <span className="font-bold">
          {" - " + (item?.descripcion?.toLowerCase() || "")}
        </span>
      </div>
    );
  };

  const handleExportPDF = (mainNode: any, data: any[], tab: string) => {
    switch (tab) {
      case "average":
        return generateFormatAverageBySpecialist(
          data,
          mainNode,
          dateRange,
          "Impresion"
        );
      case "diagnosis":
        return generateFormatDiagnosis(data, dateRange, "Impresion");
      case "diagnosisGroupedByPatient":
        return generateFormatDiagnosisGroupedByPatient(
          data,
          mainNode,
          dateRange,
          "Impresion"
        );
      default:
        return null;
    }
  };

  const handleExportExcel = (mainNode: any, data: any[], tab: string) => {
    let dataToExport: any = [];
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
      fileName: `${fileName}_${(mainNode?.full_name || "sin_nombre").replace(
        / /g,
        "_"
      )}_${new Date().toISOString().slice(0, 10)}`,
    });
  };

  const mappedDataReportAverage = (data: any) => {
    return (data || []).map((item: any) => {
      return {
        Paciente: `${item?.appointment?.patient?.full_name?.toLowerCase() ?? "Sin nombre"
          }`,
        Documento: item?.appointment?.patient?.document_number ?? "Sin documento",
        "Fecha y hora cita":
          (item?.appointment?.appointment_date ?? "") +
          ", " +
          (item?.appointment?.appointment_time ?? ""),
        "Inicio consulta": item?.start_time
          ? formatDateUtils(item.start_time)
          : "Sin inicio",
        "Fin consulta": item?.created_at_formatted ?? "Sin fin",
        "Duración consulta": item?.consultation_duration ?? "00:00:00",
        Tipo: item?.clinical_record_type?.name ?? "Sin tipo",
      };
    });
  };

  const mappedDataToDiagnosisGrouped = (data: any) => {
    return (data || []).map((item: any) => {
      return {
        Paciente: `${item?.appointment?.patient?.first_name ?? ""} ${item?.appointment?.patient?.middle_name ?? ""
          } ${item?.appointment?.patient?.last_name ?? ""} ${item?.appointment?.patient?.second_last_name ?? ""
          }`,
        Documento: item?.appointment?.patient?.document_number ?? "Sin documento",
        Edad: getAge(item?.appointment?.patient?.date_of_birth) || "--",
        Genero: genders[item?.appointment?.patient?.gender] || "--",
        "Motivo cita": item?.appointment?.consultation_type || "--",
        "Fecha - cita":
          (item?.appointment?.appointment_date ?? "") +
          ", " +
          (item?.appointment?.appointment_time ?? "") || "--",
        Especialista: `${item?.created_by_user?.first_name ?? ""} ${item?.created_by_user?.middle_name ?? ""
          } ${item?.created_by_user?.last_name ?? ""} ${item?.created_by_user?.second_last_name ?? ""
          }`,
        Especialidad: item?.created_by_user?.specialty?.name || "--",
        "Tipo consulta": item?.clinical_record_type?.name || "--",
        Diagnóstico:
          (item?.diagnosis_main ?? "-") +
          "-" +
          (item?.cie11_description?.toLowerCase() ?? "-") || "--",
      };
    });
  };

  const headerTemplate = (mainNode: any, data: any, tab: any) => {
    return (
      <div className="d-flex justify-content-between align-items-center w-full p-4">
        <div>
          {tab === "average" ? (
            <span>
              <strong>{mainNode?.full_name || "Sin nombre"}</strong> - Promedio:
              {`${mainNode?.average_consultation_duration?.hours || "00"}:${mainNode?.average_consultation_duration?.minutes || "00"}:${mainNode?.average_consultation_duration?.seconds || "00"}`}
            </span>
          ) : (
            <span>
              <strong>{(mainNode?.full_name || "sin nombre").toLowerCase()}</strong> - Consultas:{" "}
              {`${data?.length || 0}`}
            </span>
          )}
        </div>

        <div className="d-flex gap-2">
          <Button
            className="p-button-rounded p-button-success p-button-sm"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleExportExcel(mainNode, data, tab);
            }}
            tooltip={`Exportar a Excel`}
            tooltipOptions={{ position: "right" }}
          >
            <i className="fa-solid fa-file-excel"></i>
          </Button>
          <Button
            className="p-button-rounded p-button-secondary p-button-sm"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleExportPDF(mainNode, data, tab);
            }}
            tooltip={`Exportar a PDF`}
            tooltipOptions={{ position: "right" }}
          >
            <i className="fa-solid fa-file-pdf"></i>
          </Button>
        </div>
      </div>
    );
  };

  const renderProductivityTable = () => {
    if (tableLoading) {
      return (
        <div
          className="flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <ProgressSpinner />
        </div>
      );
    }

    if (!productivityData || productivityData.length === 0) {
      return <p>No hay datos para mostrar</p>;
    }

    return (
      <Accordion
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        {productivityData.map((specialist: any, index) => {
          if (!specialist) return null;

          return (
            <AccordionTab
              key={specialist?.id || index}
              header={headerTemplate(
                specialist,
                specialist?.clinical_records || [],
                "average"
              )}
            >
              <DataTable
                value={specialist?.clinical_records || []}
                emptyMessage={`No hay citas`}
                className="p-datatable-sm"
                showGridlines
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                sortMode="multiple"
                scrollable
                scrollHeight="400px"
                globalFilter={globalFilter}
              >
                <Column
                  field="patient"
                  header="Paciente"
                  body={(rowData) => {
                    return (
                      rowData?.appointment?.patient?.full_name?.toLowerCase() ||
                      "Sin nombre"
                    );
                  }}
                  sortable
                  style={{ minWidth: "200px" }}
                />
                <Column
                  field="patient.id"
                  header="N° Documento"
                  body={(rowData) => {
                    return (
                      rowData?.appointment?.patient?.document_number ??
                      "No agendada"
                    );
                  }}
                  sortable
                  style={{ minWidth: "150px" }}
                />
                <Column
                  field="date"
                  header="Fecha y hora - Cita"
                  body={(rowData) =>
                    (rowData?.appointment?.appointment_date || "") +
                    ", " +
                    (rowData?.appointment?.appointment_time || "") || "No agendada"
                  }
                  sortable
                  style={{ minWidth: "180px" }}
                />
                <Column
                  field="start_time"
                  header="Inicio consulta"
                  body={(rowData) => (
                    <span className="font-bold">
                      {rowData?.start_time
                        ? formatDateUtils(rowData.start_time)
                        : "Sin inicio"}
                    </span>
                  )}
                  sortable
                  style={{ minWidth: "150px" }}
                />
                <Column
                  field="created_at"
                  header="Fin consulta"
                  body={(rowData) => (
                    <span className="font-bold">
                      {rowData?.created_at_formatted || "Sin fin"}
                    </span>
                  )}
                  sortable
                  style={{ minWidth: "150px" }}
                />
                <Column
                  field="consultation_duration"
                  header="Duración consulta"
                  body={(rowData) => (
                    <span className="font-bold">
                      {rowData?.consultation_duration ?? "00:00:00"}
                    </span>
                  )}
                  sortable
                  style={{ minWidth: "150px" }}
                />
                <Column
                  field="clinical_record_type"
                  header="Tipo"
                  body={(rowData) => (
                    <span className="font-bold">
                      {rowData?.clinical_record_type?.name ?? "Sin tipo"}
                    </span>
                  )}
                  sortable
                  style={{ minWidth: "150px" }}
                />
              </DataTable>
            </AccordionTab>
          );
        })}
      </Accordion>
    );
  };

  const renderDiagnosisTable = () => {
    if (tableLoading) {
      return (
        <div
          className="flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <ProgressSpinner />
        </div>
      );
    }

    if (!diagnosisData || diagnosisData.length === 0) {
      return <p>No hay datos para mostrar</p>;
    }

    return (
      <div className="d-flex flex-column gap-2">
        <div className="d-flex justify-content-end align-items-center mb-3">
          <Button
            className="p-button-rounded p-button-secondary p-button-sm"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleExportPDF(diagnosisData, diagnosisData, "diagnosis");
            }}
            tooltip={`Exportar a PDF`}
            tooltipOptions={{ position: "right" }}
          >
            <i className="fa-solid fa-file-pdf"></i>
          </Button>
        </div>
        <DataTable
          value={diagnosisData}
          emptyMessage={`No hay citas`}
          className="p-datatable-sm"
          showGridlines
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          scrollable
          scrollHeight="400px"
          globalFilter={globalFilter}
        >
          <Column
            field="patient"
            header="Paciente"
            body={(rowData) => {
              const patientFullName = `${rowData?.appointment?.patient?.first_name ?? ""
                } ${rowData?.appointment?.patient?.middle_name ?? ""} ${rowData?.appointment?.patient?.last_name ?? ""
                } ${rowData?.appointment?.patient?.second_last_name ?? ""}`;
              return patientFullName.toLowerCase() || "--";
            }}
            sortable
            style={{ minWidth: "200px" }}
          />
          <Column
            field="documentNumber"
            header="N° Documento"
            body={(rowData) =>
              rowData?.appointment?.patient?.document_number || "--"
            }
            sortable
            style={{ minWidth: "150px" }}
          />
          <Column
            field="age"
            header="Edad"
            body={(rowData) => {
              return (
                getAge(rowData?.appointment?.patient?.date_of_birth) || "--"
              );
            }}
            sortable
            style={{ minWidth: "100px" }}
          />
          <Column
            field="gender"
            header="Genero"
            body={(rowData: any) => {
              return genders[rowData?.appointment?.patient?.gender] || "--";
            }}
            sortable
            style={{ minWidth: "120px" }}
          />
          <Column
            field="consultationType"
            header="Motivo de cita"
            body={(rowData) => {
              return rowData?.appointment?.consultation_type || "--";
            }}
            sortable
            style={{ minWidth: "150px" }}
          />
          <Column
            field="appointmentDate"
            header="Fecha - cita"
            body={(rowData) => {
              return (
                (rowData?.appointment?.appointment_date || "") +
                ", " +
                (rowData?.appointment?.appointment_time || "") || "--"
              );
            }}
            sortable
            style={{ minWidth: "180px" }}
          />
          <Column
            field="specialist"
            header="Especialista"
            body={(rowData) => {
              const doctorFullName = `${rowData?.created_by_user?.first_name ?? ""
                } ${rowData?.created_by_user?.middle_name ?? ""} ${rowData?.created_by_user?.last_name ?? ""
                } ${rowData?.created_by_user?.second_last_name ?? ""}`;
              return doctorFullName || "--";
            }}
            sortable
            style={{ minWidth: "200px" }}
          />
          <Column
            field="specialty"
            header="Especialidad"
            body={(rowData) => (
              <span className="font-bold">
                {rowData?.created_by_user?.specialty?.name || "--"}
              </span>
            )}
            sortable
            style={{ minWidth: "150px" }}
          />
          <Column
            field="diagnosis"
            header="Diagnostico"
            body={(rowData) => (
              <span className="font-bold">
                {(rowData?.diagnosis_main ?? "-") +
                  "-" +
                  (rowData?.cie11_description?.toLowerCase() ?? "-") || "--"}
              </span>
            )}
            sortable
            style={{ minWidth: "200px" }}
          />
        </DataTable>
      </div>
    );
  };

  const renderDiagnosisGroupedTable = () => {
    if (tableLoading) {
      return (
        <div
          className="flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <ProgressSpinner />
        </div>
      );
    }

    if (!diagnosisGroupedData || diagnosisGroupedData.length === 0) {
      return <p>No hay datos para mostrar</p>;
    }

    return (
      <Accordion
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        {diagnosisGroupedData.map((patient: any, index) => {
          if (!patient) return null;

          return (
            <AccordionTab
              key={patient?.id || index}
              header={headerTemplate(
                patient,
                patient?.clinical_records || [],
                "diagnosisGroupedByPatient"
              )}
            >
              <DataTable
                value={patient?.clinical_records || []}
                emptyMessage={`No hay citas`}
                className="p-datatable-sm"
                showGridlines
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                sortMode="multiple"
                scrollable
                scrollHeight="400px"
                globalFilter={globalFilter}
              >
                <Column
                  field="patient"
                  header="Paciente"
                  body={(rowData) => {
                    const patientFullName = `${rowData?.appointment?.patient?.first_name ?? ""
                      } ${rowData?.appointment?.patient?.middle_name ?? ""} ${rowData?.appointment?.patient?.last_name ?? ""
                      } ${rowData?.appointment?.patient?.second_last_name ?? ""}`;
                    return patientFullName.toLowerCase() || "--";
                  }}
                  sortable
                  style={{ minWidth: "200px" }}
                />
                <Column
                  field="documentNumber"
                  header="N° Documento"
                  body={(rowData) =>
                    rowData?.appointment?.patient?.document_number || "--"
                  }
                  sortable
                  style={{ minWidth: "150px" }}
                />
                <Column
                  field="age"
                  header="Edad"
                  body={(rowData) => {
                    return (
                      getAge(rowData?.appointment?.patient?.date_of_birth) ||
                      "--"
                    );
                  }}
                  sortable
                  style={{ minWidth: "100px" }}
                />
                <Column
                  field="gender"
                  header="Genero"
                  body={(rowData: any) => {
                    return genders[rowData?.appointment?.patient?.gender] || "--";
                  }}
                  sortable
                  style={{ minWidth: "120px" }}
                />
                <Column
                  field="consultationType"
                  header="Motivo de cita"
                  body={(rowData) => {
                    return rowData?.appointment?.consultation_type || "--";
                  }}
                  sortable
                  style={{ minWidth: "150px" }}
                />
                <Column
                  field="appointmentDate"
                  header="Fecha - cita"
                  body={(rowData) => {
                    return (
                      (rowData?.appointment?.appointment_date || "") +
                      ", " +
                      (rowData?.appointment?.appointment_time || "") || "--"
                    );
                  }}
                  sortable
                  style={{ minWidth: "180px" }}
                />
                <Column
                  field="specialist"
                  header="Especialista"
                  body={(rowData) => {
                    const doctorFullName = `${rowData?.created_by_user?.first_name ?? ""
                      } ${rowData?.created_by_user?.middle_name ?? ""} ${rowData?.created_by_user?.last_name ?? ""
                      } ${rowData?.created_by_user?.second_last_name ?? ""}`;
                    return doctorFullName || "--";
                  }}
                  sortable
                  style={{ minWidth: "200px" }}
                />
                <Column
                  field="specialty"
                  header="Especialidad"
                  body={(rowData) => (
                    <span className="font-bold">
                      {rowData?.created_by_user?.specialty?.name || "--"}
                    </span>
                  )}
                  sortable
                  style={{ minWidth: "150px" }}
                />
                <Column
                  field="diagnosis"
                  header="Diagnostico"
                  body={(rowData) => (
                    <span className="font-bold">
                      {(rowData?.diagnosis_main ?? "-") +
                        "-" +
                        (rowData?.cie11_description?.toLowerCase() ?? "-") ||
                        "--"}
                    </span>
                  )}
                  sortable
                  style={{ minWidth: "200px" }}
                />
              </DataTable>
            </AccordionTab>
          );
        })}
      </Accordion>
    );
  };

  if (loading) {
    return (
      <div
        className="flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <main className="main" id="top">

      {loading ? (
        <div
          className="flex justify-content-center align-items-center"
          style={{
            height: "50vh",
            marginLeft: "900px",
            marginTop: "300px",
          }}
        >
          <ProgressSpinner />
        </div>
      ) : (
        <>
          <div className="row g-3 justify-content-between align-items-start mb-4">
            <div className="col-12">
              <div
                className="card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto"
                style={{ minHeight: "400px" }}
              >
                <div className="card-body h-100 w-100 d-flex flex-column" style={{ marginTop: "-40px" }}>
                  <div className="tabs-professional-container mt-4">
                    <Accordion>
                      <AccordionTab header="Filtros">
                        <div className="row">
                          <div className="col-12 col-md-6 mb-3">
                            <label
                              className="form-label"
                              htmlFor="dateRange"
                            >
                              Rango de fechas
                            </label>
                            <Calendar
                              value={dateRange}
                              onChange={(e) =>
                                setDateRange(e.value as [Date | null, Date | null])
                              }
                              selectionMode="range"
                              readOnlyInput
                              dateFormat="dd/mm/yy"
                              placeholder="Seleccione un rango"
                              className="w-100"
                              showIcon
                            />
                          </div>
                          <div className="col-12 col-md-6 mb-3">
                            <label className="form-label">
                              Tipo de consulta
                            </label>
                            <MultiSelect
                              value={selectedClinicalRecordTypes}
                              onChange={(e) => setSelectedClinicalRecordTypes(e.value)}
                              options={clinicalRecordTypes}
                              optionLabel="name"
                              filter
                              placeholder="Seleccione tipo de historia"
                              maxSelectedLabels={3}
                              className="w-100"
                            />
                          </div>
                          <div className="col-12 col-md-6 mb-3">
                            <label className="form-label">
                              Especialista
                            </label>
                            <MultiSelect
                              value={selectedSpecialists}
                              onChange={(e) => setSelectedSpecialists(e.value)}
                              options={userSpecialists}
                              optionLabel="fullName"
                              filter
                              placeholder="Seleccione especialista"
                              maxSelectedLabels={3}
                              className="w-100"
                            />
                          </div>
                          <div className="col-12 col-md-6 mb-3">
                            <label className="form-label">
                              Especialidad
                            </label>
                            <MultiSelect
                              value={selectedSpecialties}
                              onChange={(e) => setSelectedSpecialties(e.value)}
                              options={specialties}
                              optionLabel="name"
                              filter
                              placeholder="Seleccione especialidad"
                              maxSelectedLabels={3}
                              className="w-100"
                            />
                          </div>
                          {(activeTab === "diagnosis" || activeTab === "diagnosisGrouped") && (
                            <div className="col-12 col-md-6 mb-3">
                              <label className="form-label">CIE-11</label>
                              <AutoComplete
                                field="codigo"
                                multiple
                                value={selectedCie11}
                                suggestions={cie11}
                                completeMethod={search}
                                placeholder="Escribe para buscar el CIE-11 por su código"
                                onChange={(e) => setSelectedCie11(e.value)}
                                itemTemplate={itemTemplate}
                                delay={300}
                                className="w-100"
                              />
                            </div>
                          )}
                          <div className="col-12">
                            <div className="d-flex justify-content-end m-2">
                              <Button
                                label="Filtrar"
                                icon="pi pi-filter"
                                onClick={handleFilter}
                                loading={tableLoading}
                                className="p-button-primary"
                              />
                            </div>
                          </div>
                        </div>
                      </AccordionTab>
                    </Accordion>
                    <div className="tabs-header">
                      <button
                        className={`tab-item ${activeTab === "productivity" ? "active" : ""}`}
                        onClick={() => setActiveTab("productivity")}
                      >
                        <i className="fas fa-chart-line"></i>
                        Productividad
                      </button>
                      <button
                        className={`tab-item ${activeTab === "diagnosis" ? "active" : ""}`}
                        onClick={() => setActiveTab("diagnosis")}
                      >
                        <i className="fas fa-stethoscope"></i>
                        Diagnosticos
                      </button>
                      <button
                        className={`tab-item ${activeTab === "diagnosisGrouped" ? "active" : ""}`}
                        onClick={() => setActiveTab("diagnosisGrouped")}
                      >
                        <i className="fas fa-users"></i>
                        Diagnosticos Agrupados
                      </button>
                    </div>

                    <div className="tabs-content">
                      {/* Panel de Productividad */}
                      <div className={`tab-panel ${activeTab === "productivity" ? "active" : ""}`}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <span className="text-xl font-semibold">Productividad Promedio - Especialista</span>
                          <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText
                              type="search"
                              onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                              placeholder="Buscar..."
                            />
                          </span>
                        </div>
                        {renderProductivityTable()}
                      </div>

                      {/* Panel de Diagnosticos */}
                      <div className={`tab-panel ${activeTab === "diagnosis" ? "active" : ""}`}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <span className="text-xl font-semibold">Diagnosticos</span>
                          <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText
                              type="search"
                              onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                              placeholder="Buscar..."
                            />
                          </span>
                        </div>
                        {renderDiagnosisTable()}
                      </div>

                      {/* Panel de Diagnosticos Agrupados */}
                      <div className={`tab-panel ${activeTab === "diagnosisGrouped" ? "active" : ""}`}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <span className="text-xl font-semibold">Diagnosticos Agrupados - Pacientes</span>
                          <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText
                              type="search"
                              onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                              placeholder="Buscar..."
                            />
                          </span>
                        </div>
                        {renderDiagnosisGroupedTable()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};