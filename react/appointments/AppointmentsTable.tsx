import React, { useEffect } from "react";
import { AppointmentTableItem } from "../models/models";
import CustomDataTable from "../components/CustomDataTable";
import { ConfigColumns } from "datatables.net-bs5";
import { useFetchAppointments } from "./hooks/useFetchAppointments";
import { appointmentService } from "../../services/api";
import {
  appointmentStates,
  appointmentStatesColors,
} from "../../services/commons";
import UserManager from "../../services/userManager";
import { useBranchesForSelect } from "../branches/hooks/useBranchesForSelect";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";

export const AppointmentsTable: React.FC = () => {
  const { appointments } = useFetchAppointments(appointmentService.active());
  const { branches } = useBranchesForSelect();

  const [selectedBranch, setSelectedBranch] = React.useState<string | null>(
    null
  );
  const [selectedDate, setSelectedDate] =
    React.useState<Nullable<(Date | null)[]>>(null);
  const [filteredAppointments, setFilteredAppointments] = React.useState<
    AppointmentTableItem[]
  >([]);

  const columns: ConfigColumns[] = [
    { data: "patientName", className: "text-start", orderable: true },
    { data: "patientDNI", className: "text-start", orderable: true },
    { data: "date", className: "text-start", orderable: true, type: "date" },
    { data: "time", orderable: true },
    { data: "doctorName", orderable: true },
    { data: "entity", orderable: true },
    { data: "status", orderable: true },
  ];

  useEffect(() => {
    let filtered = [...appointments];

    // Filtro por sucursal
    if (selectedBranch) {
      filtered = filtered.filter(
        (appointment) => appointment.branchId === selectedBranch
      );
    }

    // Filtro por rango de fechas
    if (selectedDate?.length === 2 && selectedDate[0] && selectedDate[1]) {
      const startDate = new Date(selectedDate[0]);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(selectedDate[1]);
      endDate.setHours(23, 59, 59, 999);

      filtered = filtered.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= startDate && appointmentDate <= endDate;
      });
    }

    // Ordenar por fecha de consulta
    filtered.sort((a, b) => {
      return b.date.localeCompare(a.date);
    });

    setFilteredAppointments(filtered);
  }, [appointments, selectedBranch, selectedDate]);

  const handleMakeClinicalRecord = (patientId: string) => {
    UserManager.onAuthChange((isAuthenticated, user) => {
      if (user) {
        window.location.href = `consultas-especialidad?patient_id=${patientId}&especialidad=${user.specialty.name}`;
      }
    });
  };

  const handleCancelAppointment = (appointmentId: string) => {
    console.log("cancel appointment", appointmentId);
  };

  const slots = {
    6: (cell, data: AppointmentTableItem) => (
      <span
        className={`badge badge-phoenix badge-phoenix-${
          appointmentStatesColors[data.stateId]
        }`}
      >
        {appointmentStates[data.stateId]}
      </span>
    ),
    7: (cell, data: AppointmentTableItem) => (
      <div className="text-end align-middle">
        <div className="dropdown">
          <button
            className="btn btn-primary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i data-feather="settings"></i> Acciones
          </button>
          <ul className="dropdown-menu" style={{ zIndex: 10000 }}>
            {data.stateId === "2" && (
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMakeClinicalRecord(data.patientId);
                  }}
                  data-column="realizar-consulta"
                >
                  <div className="d-flex gap-2 align-items-center">
                    <i
                      className="fa-solid fa-stethoscope"
                      style={{ width: "20px" }}
                    ></i>
                    <span>Realizar consulta</span>
                  </div>
                </a>
              </li>
            )}
            {data.stateId === "1" && (
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCancelAppointment(data.id);
                  }}
                  data-column="realizar-consulta"
                >
                  <div className="d-flex gap-2 align-items-center">
                    <i
                      className="fa-solid fa-ban"
                      style={{ width: "20px" }}
                    ></i>
                    <span>Cancelar cita</span>
                  </div>
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <>
      <div className="card mb-3">
        <div className="card-body">
          <CustomDataTable
            columns={columns}
            data={filteredAppointments}
            slots={slots}
            customOptions={{
              order: [[2, "desc"]],
              ordering: true,
              columnDefs: [{ orderable: false, targets: [7] }],
            }}
          >
            <thead>
              <tr>
                <th className="border-top custom-th text-start">Nombre</th>
                <th className="border-top custom-th text-start">
                  Número de documento
                </th>
                <th className="border-top custom-th text-start">
                  Fecha Consulta
                </th>
                <th className="border-top custom-th text-start">
                  Hora Consulta
                </th>
                <th className="border-top custom-th text-start">
                  Profesional asignado
                </th>
                <th className="border-top custom-th text-start">Entidad</th>
                <th className="border-top custom-th text-start">Estado</th>
                <th
                  className="text-end align-middle pe-0 border-top mb-2"
                  scope="col"
                ></th>
              </tr>
            </thead>
          </CustomDataTable>
        </div>
      </div>
    </>
  );
};
