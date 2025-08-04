import React from "react";
import { AppointmentTableItem } from "../models/models";
import { useFetchAppointments } from "./hooks/useFetchAppointments";
import { CustomPRTable, CustomPRTableColumnProps } from "../components/CustomPRTable";

interface TodayAppointmentsTableProps {
  onPrintItem?: (id: string, title: string) => void;
  onDownloadItem?: (id: string, title: string) => void;
  onShareItem?: (id: string, title: string, type: string) => void;
}

export const TodayAppointmentsTable: React.FC<TodayAppointmentsTableProps> = () => {

  const customFilters = () => {
    return {
      appointmentState: 'pending',
      appointmentDate: new Date().toISOString().split('T')[0],
      sort: '-appointment_date,appointment_time'
    };
  }

  const { appointments, handlePageChange, handleSearchChange, refresh, totalRecords, first, loading, perPage } = useFetchAppointments(customFilters);

  const columns: CustomPRTableColumnProps[] = [
    {
      field: "patientName", header: "Nombre", body: (rowData: AppointmentTableItem) => <>
        <a href={`verPaciente?id=${rowData.patientId}`}>
          {rowData.patientName}
        </a>
      </>
    },
    { field: "patientDNI", header: "Número de documento" },
    { field: "date", header: "Fecha Consulta" },
    { field: "time", header: "Hora Consulta" },
    { field: "doctorName", header: "Profesional asignado" },
    { field: "entity", header: "Entidad" },
    {
      field: "", header: "", body: (rowData: AppointmentTableItem) => <>
        <div className="align-middle white-space-nowrap pe-0 p-3">
          <div className="btn-group me-1">
            <button
              className="btn dropdown-toggle mb-1 btn-primary"
              type="button"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Acciones
            </button>
            <div className="dropdown-menu">
              <a
                href={`generar_admision_rd?id_cita=${rowData.id}`}
                className="dropdown-item"
                id="generar-admision"
              >
                Generar admisión
              </a>
            </div>
          </div>
        </div>
      </>
    },
  ];

  return (
    <>
      <div
        className="card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto"
        style={{ minHeight: "300px" }}
      >
        <div className="card-body h-100 w-100 d-flex flex-column">
          <CustomPRTable
            columns={columns}
            data={appointments}
            lazy
            first={first}
            rows={perPage}
            totalRecords={totalRecords}
            loading={loading}
            onPage={handlePageChange}
            onSearch={handleSearchChange}
            onReload={refresh}
          >
          </CustomPRTable>
        </div>
      </div>
    </>
  );
};
