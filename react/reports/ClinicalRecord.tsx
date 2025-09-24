import React, { useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { Accordion, AccordionTab } from "primereact/accordion";
import { TabView, TabPanel } from "primereact/tabview";
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
import { AutoComplete } from "primereact/autocomplete";
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
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [loadedTabs, setLoadedTabs] = useState<number[]>([]);

  // Estados para datos de cada tab
  const [tab1Data, setTab1Data] = useState<any[]>([]);
  const [tab2Data, setTab2Data] = useState<any[]>([]);
  const [tab3Data, setTab3Data] = useState<any[]>([]);

  // Estados para filtros (puedes personalizar según necesites)
  const [clinicalRecordTypes, setClinicalRecordTypes] = useState<any[]>([]);
  const [userSpecialists, setUserSpecialists] = useState<any[]>([]);
  const [specialties, setSpecialties] = useState<any[]>([]);

  const [selectedSpecialties, setSelectedSpecialties] = useState<any[]>([]);
  const [selectedSpecialists, setSelectedSpecialists] = useState<any[]>([]);
  const [selectedClinicalRecordTypes, setSelectedClinicalRecordTypes] =
    useState<any[]>([]);
  const [selectedCie11, setSelectedCie11] = useState<any[]>([]);
  const [cie11, setCie11] = useState<any[]>([]);

  const { generateFormatAverageBySpecialist } = useAverageBySpecialistFormat();
  const { generateFormatDiagnosisGroupedByPatient } =
    useDiagnosisGroupedByPatientFormat();
  const { generateFormatDiagnosis } = useDiagnosisFormat();

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
      const dataFiltered = response
        .filter((user: any) => user.role.group === "DOCTOR")
        .map((user: any) => {
          const fullName = `${user.first_name ?? ""} ${
            user.middle_name ?? ""
          } ${user.last_name ?? ""} ${user.second_last_name ?? ""}`;

          return {
            ...user,
            fullName,
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

  const loadTab1Data = async (
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

  const loadTab2Data = async (
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

  const loadTab3Data = async (
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
      const filterParams: any = {
        start_date: dateRange[0] ? formatDate(dateRange[0]) : "",
        end_date: dateRange[1] ? formatDate(dateRange[1]) : "",
        // Agregar más parámetros según necesites
      };

      if (selectedClinicalRecordTypes.length > 0) {
        filterParams.clinical_record_type_ids = selectedClinicalRecordTypes.map(
          (clinicalRecordType: any) => clinicalRecordType.id
        );
      }
      if (selectedSpecialists.length > 0) {
        filterParams.user_ids = selectedSpecialists.map(
          (doctor: any) => doctor.id
        );
      }
      if (selectedSpecialties.length > 0) {
        filterParams.specialty_ids = selectedSpecialties.map(
          (specialty: any) => specialty.id
        );
      }

      if (selectedCie11.length > 0) {
        filterParams.cie11 = selectedCie11.map((cie11: any) => cie11.codigo);
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

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const search = async (event: any) => {
    try {
      // Ejecutar endpoint con el término de búsqueda
      const response = await cie11Service.getCie11ByCode(event.query);

      setCie11(response);
    } catch (error) {
      console.error("Error buscando países:", error);
      setCie11([]);
    }
  };

  const itemTemplate = (item: any) => {
    return (
      <div className="flex align-items-center">
        <span className="ml-2 text-sm text-gray-500">{item.codigo}</span>
        <span className="font-bold">
          {" - " + item.descripcion.toLowerCase()}
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
      fileName: `${fileName}_${mainNode.full_name.replace(
        / /g,
        "_"
      )}_${new Date().toISOString().slice(0, 10)}`,
    });
  };

  const mappedDataReportAverage = (data: any) => {
    return data.map((item: any) => {
      return {
        Paciente: `${
          item.appointment?.patient?.full_name.toLowerCase() ?? "Sin nombre"
        }`,
        Documento: item?.appointment?.patient?.document_number,
        "Fecha y hora cita":
          item?.appointment?.appointment_date +
          ", " +
          item?.appointment?.appointment_time,
        "Inicio consulta": item?.start_time
          ? formatDateUtils(item.start_time)
          : "Sin inicio",
        "Fin consulta": item?.created_at_formatted,
        "Duración consulta": item?.consultation_duration ?? "00:00:00",
        Tipo: item?.clinical_record_type?.name ?? "Sin tipo",
      };
    });
  };

  const mappedDataToDiagnosisGrouped = (data: any) => {
    return data.map((item: any) => {
      return {
        Paciente: `${item?.appointment?.patient?.first_name ?? ""} ${
          item?.appointment?.patient?.middle_name ?? ""
        } ${item?.appointment?.patient?.last_name ?? ""} ${
          item?.appointment?.patient?.second_last_name ?? ""
        }`,
        Documento: item?.appointment?.patient?.document_number,
        Edad: getAge(item?.appointment?.patient?.date_of_birth) || "--",
        Genero: genders[item?.appointment?.patient?.gender],
        "Motivo cita": item?.appointment?.consultation_type || "--",
        "Fecha - cita":
          item?.appointment?.appointment_date +
            ", " +
            item?.appointment?.appointment_time || "--",
        Especialista: `${item?.created_by_user?.first_name ?? ""} ${
          item?.created_by_user?.middle_name ?? ""
        } ${item?.created_by_user?.last_name ?? ""} ${
          item?.created_by_user?.second_last_name ?? ""
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
              <strong>{mainNode.full_name}</strong> - Promedio:
              {`${mainNode.average_consultation_duration.hours}:${mainNode.average_consultation_duration.minutes}:${mainNode.average_consultation_duration.seconds}`}
            </span>
          ) : (
            <span>
              {/* Contenido alternativo completo */}
              <strong>{mainNode.full_name.toLowerCase()}</strong> - Consultas:{" "}
              {`${data.length}`}
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

  const renderTab1Content = () => {
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

    if (tab1Data.length === 0) {
      return <p>No hay datos para mostrar</p>;
    }

    // TODO: Implementar renderizado específico para Tab 1
    return (
      <Accordion
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        {tab1Data.map((specialist: any, index) => {
          return (
            <AccordionTab
              key={specialist.id || index}
              header={headerTemplate(
                specialist,
                specialist.clinical_records || [],
                "average"
              )}
            >
              <DataTable
                value={specialist.clinical_records}
                emptyMessage={`No hay citas`}
                className="p-datatable-sm"
                showGridlines
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                sortMode="multiple"
              >
                <Column
                  field="patient"
                  header="Paciente"
                  body={(rowData) => {
                    return (
                      rowData?.appointment?.patient?.full_name.toLowerCase() ||
                      "Sin nombre"
                    );
                  }}
                />
                <Column
                  field="patient.id"
                  header="N° Documento"
                  body={(rowData) => {
                    return (
                      rowData?.appointment?.patient.document_number ??
                      "No agendada"
                    );
                  }}
                />
                <Column
                  field="date"
                  header="Fecha y hora - Cita"
                  body={(rowData) =>
                    rowData?.appointment?.appointment_date +
                      ", " +
                      rowData?.appointment?.appointment_time || "No agendada"
                  }
                />
                <Column
                  field="start_time"
                  header="Inicio consulta"
                  body={(rowData) => (
                    <span className="font-bold">
                      {rowData.start_time
                        ? formatDateUtils(rowData.start_time)
                        : "Sin inicio"}
                    </span>
                  )}
                />
                <Column
                  field="created_at"
                  header="Fin consulta"
                  body={(rowData) => (
                    <span className="font-bold">
                      {rowData.created_at_formatted}
                    </span>
                  )}
                />
                <Column
                  field="consultation_duration"
                  header="Duración consulta"
                  body={(rowData) => (
                    <span className="font-bold">
                      {rowData.consultation_duration ?? "00:00:00"}
                    </span>
                  )}
                />
                <Column
                  field="consultation_duration"
                  header="Tipo"
                  body={(rowData) => (
                    <span className="font-bold">
                      {rowData.clinical_record_type.name ?? "Sin tipo"}
                    </span>
                  )}
                />
              </DataTable>
            </AccordionTab>
          );
        })}
      </Accordion>
    );
  };

  const renderTab2Content = () => {
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

    if (tab2Data.length === 0) {
      return <p>No hay datos para mostrar</p>;
    }

    // TODO: Implementar renderizado específico para Tab 2
    return (
      <div className="d-flex flex-column gap-2">
        <div className="d-flex justify-content-end align-items-center">
          <Button
            className="p-button-rounded p-button-secondary p-button-sm"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleExportPDF(tab2Data, tab2Data, "diagnosis");
            }}
            tooltip={`Exportar a PDF`}
            tooltipOptions={{ position: "right" }}
          >
            <i className="fa-solid fa-file-pdf"></i>
          </Button>
        </div>
        <DataTable
          value={tab2Data}
          emptyMessage={`No hay citas`}
          className="p-datatable-sm"
          showGridlines
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
        >
          <Column
            field="patient"
            header="Paciente"
            body={(rowData) => {
              const patientFullName = `${
                rowData?.appointment?.patient?.first_name ?? ""
              } ${rowData?.appointment?.patient?.middle_name ?? ""} ${
                rowData?.appointment?.patient?.last_name ?? ""
              } ${rowData?.appointment?.patient?.second_last_name ?? ""}`;
              return patientFullName.toLowerCase() || "--";
            }}
          />
          <Column
            field="documentNumber"
            header="N° Documento"
            body={(rowData) =>
              rowData?.appointment?.patient?.document_number || "--"
            }
          />
          <Column
            field="age"
            header="Edad"
            body={(rowData) => {
              return (
                getAge(rowData?.appointment?.patient?.date_of_birth) || "--"
              );
            }}
          />
          <Column
            field="gender"
            header="Genero"
            body={(rowData: any) => {
              return genders[rowData?.appointment?.patient?.gender];
            }}
          />
          <Column
            field="consultationType"
            header="Motivo de cita"
            body={(rowData) => {
              return rowData?.appointment?.consultation_type || "--";
            }}
          />
          <Column
            field="appointmentDate"
            header="Fecha - cita"
            body={(rowData) => {
              return (
                rowData?.appointment?.appointment_date +
                  ", " +
                  rowData?.appointment?.appointment_time || "--"
              );
            }}
          />
          <Column
            field="specialist"
            header="Especialista"
            body={(rowData) => {
              const doctorFullName = `${
                rowData?.created_by_user?.first_name ?? ""
              } ${rowData?.created_by_user?.middle_name ?? ""} ${
                rowData?.created_by_user?.last_name ?? ""
              } ${rowData?.created_by_user?.second_last_name ?? ""}`;
              return doctorFullName;
            }}
          />
          <Column
            field="specialty"
            header="Especialidad"
            body={(rowData) => (
              <span className="font-bold">
                {rowData?.created_by_user?.specialty?.name}
              </span>
            )}
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
          />
        </DataTable>
      </div>
    );
  };

  const renderTab3Content = () => {
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

    if (tab3Data.length === 0) {
      return <p>No hay datos para mostrar en el Tab 3</p>;
    }

    return (
      <Accordion
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        {tab3Data.map((patient: any, index) => {
          return (
            <AccordionTab
              key={patient.id || index}
              header={headerTemplate(
                patient,
                patient.clinical_records || [],
                "diagnosisGroupedByPatient"
              )}
            >
              <DataTable
                value={patient.clinical_records}
                emptyMessage={`No hay citas`}
                className="p-datatable-sm"
                showGridlines
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                sortMode="multiple"
              >
                <Column
                  field="patient"
                  header="Paciente"
                  body={(rowData) => {
                    const patientFullName = `${
                      rowData?.appointment?.patient?.first_name ?? ""
                    } ${rowData?.appointment?.patient?.middle_name ?? ""} ${
                      rowData?.appointment?.patient?.last_name ?? ""
                    } ${rowData?.appointment?.patient?.second_last_name ?? ""}`;
                    return patientFullName.toLowerCase() || "--";
                  }}
                />
                <Column
                  field="documentNumber"
                  header="N° Documento"
                  body={(rowData) =>
                    rowData?.appointment?.patient?.document_number || "--"
                  }
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
                />
                <Column
                  field="gender"
                  header="Genero"
                  body={(rowData: any) => {
                    return genders[rowData?.appointment?.patient?.gender];
                  }}
                />
                <Column
                  field="consultationType"
                  header="Motivo de cita"
                  body={(rowData) => {
                    return rowData?.appointment?.consultation_type || "--";
                  }}
                />
                <Column
                  field="appointmentDate"
                  header="Fecha - cita"
                  body={(rowData) => {
                    return (
                      rowData?.appointment?.appointment_date +
                        ", " +
                        rowData?.appointment?.appointment_time || "--"
                    );
                  }}
                />
                <Column
                  field="consultationType"
                  header="Especialista"
                  body={(rowData) => {
                    const doctorFullName = `${
                      rowData?.created_by_user?.first_name ?? ""
                    } ${rowData?.created_by_user?.middle_name ?? ""} ${
                      rowData?.created_by_user?.last_name ?? ""
                    } ${rowData?.created_by_user?.second_last_name ?? ""}`;
                    return doctorFullName;
                  }}
                />
                <Column
                  field="specialty"
                  header="Especialidad"
                  body={(rowData) => (
                    <span className="font-bold">
                      {rowData?.created_by_user?.specialty?.name}
                    </span>
                  )}
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
      <div className="content">
        <div className="pb-9">
          <h2 className="mb-4">Reporte Consultas</h2>

          {/* Sección de Filtros */}
          <div className="card border border-light mb-4">
            <div className="card-body">
              <div className="grid p-fluid row">
                <div className="col-6 md:col-6">
                  <label className="form-label">Rango de fechas</label>
                  <Calendar
                    value={dateRange}
                    onChange={(e) =>
                      setDateRange(e.value as [Date | null, Date | null])
                    }
                    selectionMode="range"
                    readOnlyInput
                    dateFormat="dd/mm/yy"
                    placeholder="Seleccione un rango"
                    className="w-full"
                    showIcon
                  />
                </div>
                <div className="col-6 md:col-6">
                  <label className="form-label">Tipo de consulta </label>
                  <MultiSelect
                    value={selectedClinicalRecordTypes}
                    onChange={(e) => setSelectedClinicalRecordTypes(e.value)}
                    options={clinicalRecordTypes} // TODO: Poblar con opciones
                    optionLabel="name"
                    filter
                    placeholder="Seleccione tipo de historia"
                    maxSelectedLabels={3}
                    className="w-full"
                  />
                </div>
                <div className="col-6 md:col-6">
                  <label className="form-label">Especialista</label>
                  <MultiSelect
                    value={selectedSpecialists}
                    onChange={(e) => setSelectedSpecialists(e.value)}
                    options={userSpecialists}
                    optionLabel="fullName"
                    filter
                    placeholder="Seleccione especialista"
                    maxSelectedLabels={3}
                    className="w-full"
                  />
                </div>
                <div className="col-6 md:col-6">
                  <label className="form-label">Especialidad</label>
                  <MultiSelect
                    value={selectedSpecialties}
                    onChange={(e) => setSelectedSpecialties(e.value)}
                    options={specialties}
                    optionLabel="name"
                    filter
                    placeholder="Seleccione especialidad"
                    maxSelectedLabels={3}
                    className="w-full"
                  />
                </div>
                {activeTabIndex === 1 || activeTabIndex === 2 ? (
                  <div className="col-6 md:col-6">
                    <label className="form-label">Cie11</label>
                    <AutoComplete
                      field="codigo"
                      multiple
                      value={selectedCie11}
                      suggestions={cie11}
                      completeMethod={search}
                      placeholder="Escribe para buscar el cie11 por su código"
                      onChange={(e) => setSelectedCie11(e.value)}
                      itemTemplate={itemTemplate}
                      delay={300}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="flex justify-content-end mt-3">
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

          {/* Tabs */}
          <div className="card">
            <TabView
              activeIndex={activeTabIndex}
              onTabChange={(e) => setActiveTabIndex(e.index)}
            >
              {/* Tab 1 */}
              <TabPanel header="Productividad Promedio - Especialista">
                {renderTab1Content()}
              </TabPanel>

              {/* Tab 2 */}
              <TabPanel header="Diagnosticos">{renderTab2Content()}</TabPanel>

              {/* Tab 3 */}
              <TabPanel header="Diagnosticos agrupado - Pacientes">
                {renderTab3Content()}
              </TabPanel>
            </TabView>
          </div>
        </div>
      </div>
    </main>
  );
};
