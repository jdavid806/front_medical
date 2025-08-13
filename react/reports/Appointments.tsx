import React, { useState, useEffect, use } from "react";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { Accordion, AccordionTab } from "primereact/accordion";
import { TabView, TabPanel } from "primereact/tabview";
import { exportToExcel } from "../accounting/utils/ExportToExcelOptions";
import { generatePDFFromHTML } from "../../funciones/funcionesJS/exportPDF";
import { useCompany } from "../hooks/useCompany";

// Import your services
import {
  appointmentService,
  userSpecialtyService,
  userService,
  appointmentStateService,
} from "../../services/api/index";
import {
  appointmentStatesByKeyTwo,
  appointmentStateFilters,
} from "../../services/commons";

interface Appointment {
  id: string;
  state: string;
  patient: {
    first_name: string;
    last_name: string;
    document_number: string;
    city_id: string;
  };
  product_id: string;
  created_at: string;
  appointment_state: {
    name: string;
  };
  assigned_user_availability?: {
    user: {
      id: string;
      first_name: string;
      middle_name: string;
      last_name: string;
      second_last_name: string;
      specialty: {
        id: string;
        name: string;
      };
    };
  };
  userAvailability?: null;
  appointment_time?: string;
}

type GroupedByState = Record<string, Appointment[]>;
type GroupedBySpecialtyDoctor = Record<
  string,
  {
    specialty: string;
    doctorName: string;
    count: number;
    appointments: Appointment[];
  }[]
>;

export const Appointments = () => {
  const today = new Date();
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(today.getDate() - 5);

  // State for filters
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    fiveDaysAgo,
    today,
  ]);
  const [reportData, setReportData] = useState<Appointment[]>([]);
  const [groupedByState, setGroupedByState] = useState<GroupedByState>({});
  const [groupedBySpecialtyDoctor, setGroupedBySpecialtyDoctor] =
    useState<GroupedBySpecialtyDoctor>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | number[]>(0);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [loadedTabs, setLoadedTabs] = useState<number[]>([]);
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointmentStates, setAppointmentStates] = useState<any[]>([]);
  const { company, setCompany, fetchCompany } = useCompany();
  const [selectedSpecialties, setSelectedSpecialties] = useState<any[]>([]);
  const [selectedDoctors, setSelectedDoctors] = useState<any[]>([]);
  const [selectedStates, setSelectedStates] = useState<any[]>([]);

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
      const responseFiltered = response
        .map((user: any) => ({
          ...user,
          full_name: `${user.first_name ?? ""} ${user.middle_name ?? ""} ${user.last_name ?? ""} ${user.second_last_name ?? ""}`
        }))
        .filter((user: any) => user.role.group === "DOCTOR");
      setDoctors(responseFiltered);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  }

  async function loadAppointmentStates() {
    try {
      const response = await appointmentStateService.getAll();
      const responseMapped = response.map((state: any) => {
        return {
          ...state,
          nameState: appointmentStateFilters[state.name],
        };
      });
      setAppointmentStates(responseMapped);
    } catch (error) {
      console.error("Error fetching appointment states:", error);
    }
  }

  const loadDataForTab = async (tabIndex: number, filterParams: any = {
    start_date: dateRange[0] ? formatDate(dateRange[0]) : "",
    end_date: dateRange[1] ? formatDate(dateRange[1]) : "",
  }) => {
    setTableLoading(true);
    try {
      const response = await appointmentService.appointmentsWithFilters(
        filterParams
      );
      const data = response.data || response;

      if (!Array.isArray(data)) {
        throw new Error("La respuesta no es un array de citas");
      }

      const processedData = handlerDataAppointments(data);
      setReportData(processedData);

      if (tabIndex === 0) {
        // Agrupamiento original (solo por estado)
        const grouped: GroupedByState = {};
        processedData.forEach((appointment) => {
          if (!grouped[appointment.state]) {
            grouped[appointment.state] = [];
          }
          grouped[appointment.state].push(appointment);
        });
        setGroupedByState(grouped);
      } else {
        // Nuevo agrupamiento (estado -> array de {especialidad, médico, count})
        const grouped: GroupedBySpecialtyDoctor = {};

        processedData.forEach((appointment) => {
          const state = appointment.state;
          const specialty =
            appointment.assigned_user_availability?.user?.specialty?.name ||
            "Sin especialidad";
          const doctorId =
            appointment.assigned_user_availability?.user?.id || "unknown";
          const doctorName =
            [
              appointment.assigned_user_availability?.user?.first_name,
              appointment.assigned_user_availability?.user?.middle_name,
              appointment.assigned_user_availability?.user?.last_name,
              appointment.assigned_user_availability?.user?.second_last_name,
            ]
              .filter(Boolean)
              .join(" ") || "Sin nombre";

          if (!grouped[state]) {
            grouped[state] = [];
          }

          // Buscar si ya existe esta combinación especialidad-médico
          const existingEntry = grouped[state].find(
            (entry) =>
              entry.specialty === specialty && entry.doctorName === doctorName
          );

          if (existingEntry) {
            existingEntry.count++;
            existingEntry.appointments.push(appointment);
          } else {
            grouped[state].push({
              specialty,
              doctorName,
              count: 1,
              appointments: [appointment],
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
      const filterParams: any = {
        start_date: dateRange[0] ? formatDate(dateRange[0]) : "",
        end_date: dateRange[1] ? formatDate(dateRange[1]) : "",
      };
      if (selectedStates.length > 0) {
        filterParams.appointment_state_ids = selectedStates.map((state: any) => state.id);
      }
      if (selectedDoctors.length > 0) {
        filterParams.user_ids = selectedDoctors.map((doctor: any) => doctor.id);
      }
      if (selectedSpecialties.length > 0) {
        filterParams.specialty_ids = selectedSpecialties.map((specialty: any) => specialty.id);
      }

      // Cargar datos solo para el tab activo
      await loadDataForTab(activeTabIndex, filterParams);
    } catch (error) {
      console.error("Error filtering data:", error);
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const handlerDataAppointments = (data: any[]): Appointment[] => {
    return data.map((item: any) => {
      const state = appointmentStatesByKeyTwo[item.appointment_state?.name];
      return {
        ...item,
        state:
          (typeof state === "object" ? state.CONSULTATION : state) ??
          "Sin estado",
      };
    });
  };

  const handleExportExcel = (state: string, data: any[]) => {
    const dataToExport = data.map((item) => ({
      Estado: item.state,
      Paciente: `${item.patient.first_name} ${item.patient.last_name}`,
      Documento: item.patient.document_number,
      Ciudad: item.patient.city_id,
      Producto: item.product_id,
      Fecha: new Date(item.created_at).toLocaleDateString("es-DO"),
    }));

    exportToExcel({
      data: dataToExport,
      fileName: `Citas_${state.replace(/ /g, "_")}_${new Date()
        .toISOString()
        .slice(0, 10)}`,
    });
  };

  const handleExportPDF = (state: string, data: any[]) => {
    const dataExport = data.map((item) => ({
      state: item.state,
      patient: `${item.patient.first_name} ${item.patient.last_name}`,
      document_number: item.patient.document_number,
      city: item.patient.city_id,
      product: item.product_id,
      date: new Date(item.created_at).toLocaleDateString("es-DO"),
    }));

    const table = `
      <style>
      table { width: 100%; border-collapse: collapse; margin-top: 25px; font-size: 12px; }
      th { background-color: rgb(66, 74, 81); color: white; padding: 10px; text-align: left; font-weight: normal; }
      td { padding: 10px 8px; border-bottom: 1px solid #eee; }
      </style>
      <table>
        <thead>
          <tr>
            <th>Estado</th>
            <th>Paciente</th>
            <th>Documento</th>
            <th>Ciudad</th>
            <th>Producto</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          ${dataExport.reduce(
            (acc: string, item: any) =>
              acc +
              `
            <tr>
              <td>${item.state ?? ""}</td>
              <td>${item.patient ?? ""}</td>
              <td>${item.document_number ?? ""}</td>
              <td>${item.city ?? ""}</td>
              <td>${item.product ?? ""}</td>
              <td>${item.date}</td>
            </tr>`,
            ""
          )}
        </tbody>
      </table>`;

    generatePDFFromHTML(table, company, {
      name: "Citas - " + state,
    });
  };

  const dateTemplate = (rowData: Appointment) => {
    return (
      new Date(rowData.created_at).toLocaleDateString("es-DO") +
      ", " +
      (rowData.appointment_time || "")
    );
  };

  const headerTemplate = (
    state: string,
    count: number,
    data: Appointment[]
  ) => {
    return (
      <div className="d-flex justify-content-between align-items-center w-full p-4">
        <div>
          <span>
            <strong>{state}</strong> - Total: {count}
          </span>
        </div>
        <div className="d-flex gap-2">
          <Button
            className="p-button-rounded p-button-success p-button-sm"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleExportExcel(state, data);
            }}
            tooltip={`Exportar ${state} a Excel`}
            tooltipOptions={{ position: "right" }}
          >
            <i className="fa-solid fa-file-excel"></i>
          </Button>
          <Button
            className="p-button-rounded p-button-secondary p-button-sm"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleExportPDF(state, data);
            }}
            tooltip={`Exportar ${state} a PDF`}
            tooltipOptions={{ position: "right" }}
          >
            <i className="fa-solid fa-file-pdf"></i>
          </Button>
        </div>
      </div>
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
          <h2 className="mb-4">Reporte de Citas</h2>

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
                  <label className="form-label">Estado</label>
                  <MultiSelect
                    value={selectedStates}
                    onChange={(e) => { setSelectedStates(e.value)}}
                    options={appointmentStates}
                    optionLabel="nameState"
                    filter
                    placeholder="Seleccione estados"
                    maxSelectedLabels={3}
                    className="w-full"
                  />
                </div>
                <div className="col-6 md:col-6">
                  <label className="form-label">Especialista</label>
                  <MultiSelect
                    value={selectedDoctors}
                    onChange={(e) => setSelectedDoctors(e.value)}
                    options={doctors}
                    optionLabel="full_name"
                    filter
                    placeholder="Seleccione Especialistas"
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
                    placeholder="Seleccione Especialidades"
                    maxSelectedLabels={3}
                    className="w-full"
                  />
                </div>
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
              {/* Tab 1 - Vista por Estado */}
              <TabPanel header="Vista por Estado">
                {tableLoading ? (
                  <div
                    className="flex justify-content-center align-items-center"
                    style={{ height: "200px" }}
                  >
                    <ProgressSpinner />
                  </div>
                ) : Object.keys(groupedByState).length > 0 ? (
                  <Accordion
                    activeIndex={activeIndex}
                    onTabChange={(e) => setActiveIndex(e.index)}
                  >
                    {Object.entries(groupedByState).map(
                      ([state, appointments]) => (
                        <AccordionTab
                          key={state}
                          header={headerTemplate(
                            state,
                            appointments.length,
                            appointments
                          )}
                        >
                          <DataTable
                            value={appointments}
                            emptyMessage={`No hay citas en estado ${state}`}
                            className="p-datatable-sm p-datatable-striped"
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                          >
                            <Column
                              field="patient.first_name"
                              header="Paciente"
                              body={(data) =>
                                `${data.patient.first_name} ${data.patient.last_name}`
                              }
                              sortable
                            />
                            <Column
                              field="patient.document_number"
                              header="Documento"
                              sortable
                            />
                            <Column
                              field="patient.city_id"
                              header="Ciudad"
                              sortable
                            />
                            <Column
                              field="assigned_user_availability.first_name"
                              header="Especialista"
                              body={(data) =>
                                `${
                                  data.assigned_user_availability?.user
                                    ?.first_name || ""
                                } ${
                                  data.assigned_user_availability?.user
                                    ?.last_name || ""
                                }`
                              }
                              sortable
                            />
                            <Column
                              field="assigned_user_availability.user.specialty.name"
                              header="Especialidad"
                              sortable
                            />
                            <Column
                              field="product.name"
                              header="Producto"
                              sortable
                            />
                            <Column
                              field="created_at"
                              header="Fecha"
                              body={dateTemplate}
                              sortable
                            />
                          </DataTable>
                        </AccordionTab>
                      )
                    )}
                  </Accordion>
                ) : (
                  <p>No hay datos para mostrar</p>
                )}
              </TabPanel>

              {/* Tab 2 - Vista por Especialidad y Médico */}
              <TabPanel header="Vista por Especialidad y Médico">
                {tableLoading ? (
                  <div
                    className="flex justify-content-center align-items-center"
                    style={{ height: "200px" }}
                  >
                    <ProgressSpinner />
                  </div>
                ) : Object.keys(groupedBySpecialtyDoctor).length > 0 ? (
                  <Accordion
                    activeIndex={activeIndex}
                    onTabChange={(e) => setActiveIndex(e.index)}
                  >
                    {Object.entries(groupedBySpecialtyDoctor).map(
                      ([state, entries]) => {
                        const totalCount = entries.reduce(
                          (sum, entry) => sum + entry.count,
                          0
                        );
                        const allAppointments = entries.flatMap(
                          (entry) => entry.appointments
                        );

                        return (
                          <AccordionTab
                            key={state}
                            header={headerTemplate(
                              state,
                              totalCount,
                              allAppointments
                            )}
                          >
                            <DataTable
                              value={entries}
                              emptyMessage={`No hay citas en estado ${state}`}
                              className="p-datatable-sm p-datatable-striped"
                              paginator
                              rows={10}
                              rowsPerPageOptions={[5, 10, 25]}
                              sortMode="multiple"
                            >
                              <Column
                                field="specialty"
                                header="Especialidad"
                                sortable
                                filter
                                filterPlaceholder="Buscar especialidad"
                              />
                              <Column
                                field="doctorName"
                                header="Médico"
                                sortable
                                filter
                                filterPlaceholder="Buscar médico"
                              />
                              <Column
                                field="count"
                                header="Cantidad"
                                sortable
                                body={(rowData) => (
                                  <span className="font-bold">
                                    {rowData.count}
                                  </span>
                                )}
                              />
                            </DataTable>
                          </AccordionTab>
                        );
                      }
                    )}
                  </Accordion>
                ) : (
                  <p>No hay datos para mostrar</p>
                )}
              </TabPanel>
            </TabView>
          </div>
        </div>
      </div>
    </main>
  );
};
