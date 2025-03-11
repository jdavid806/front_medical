import React from "react";
import { AppointmentTableItem } from "../models/models";
import CustomDataTable from "../components/CustomDataTable";
import { ConfigColumns } from "datatables.net-bs5";
import { useFetchAppointments } from "./hooks/useFetchAppointments";
import { appointmentService } from "../../services/api";
import { BranchesSelect } from "../branches/BranchesSelect";
import { appointmentStates, appointmentStatesColors } from "../../services/commons";

export const AppointmentsTable: React.FC = () => {
  const { appointments } = useFetchAppointments(appointmentService.active());

  const columns: ConfigColumns[] = [
    { data: "patientName", className: "text-start" },
    { data: "patientDNI", className: "text-start" },
    { data: "date", className: "text-start" },
    { data: "time" },
    { data: "doctorName" },
    { data: "entity" },
    { data: "status" },
  ];

  const handleMakeClinicalRecord = (patientId: string) => {
    window.location.href = `/consultas?patient_id=${patientId}&especialidad=medicina_general&tipo_historia=general`
  }

  const handleCancelAppointment = (appointmentId: string) => {
    console.log('cancel appointment', appointmentId);
  }

  const slots = {
    6: (cell, data: AppointmentTableItem) => (
      <span
        className={`badge badge-phoenix badge-phoenix-${appointmentStatesColors[data.stateId]}`}
      >
        {appointmentStates[data.stateId]}
      </span>
    ),
    7: (cell, data: AppointmentTableItem) => (
      <div className="text-end align-middle">
        <div className="dropdown">
          <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i data-feather="settings"></i> Acciones
          </button>
          <ul className="dropdown-menu" style={{ zIndex: 10000 }}>
            {data.stateId === '2' && (
              <li>
                <a className="dropdown-item" href="#" onClick={(e) => {
                  e.preventDefault();
                  handleMakeClinicalRecord(data.patientId);
                }} data-column="realizar-consulta">
                  <div className="d-flex gap-2 align-items-center">
                    <i className="fa-solid fa-stethoscope" style={{ width: '20px' }}></i>
                    <span>Realizar consulta</span>
                  </div>
                </a>
              </li>
            )}
            {data.stateId === '1' && (
              <li>
                <a className="dropdown-item" href="#" onClick={(e) => {
                  e.preventDefault();
                  handleCancelAppointment(data.id);
                }} data-column="realizar-consulta">
                  <div className="d-flex gap-2 align-items-center">
                    <i className="fa-solid fa-ban" style={{ width: '20px' }}></i>
                    <span>Cancelar cita</span>
                  </div>
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    )
  };

  return (
    <>
      <div className="accordion mb-3">
        <div className="accordion-item">
          <h2 className="accordion-header" id="filters">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#filtersCollapse"
              aria-expanded="false"
              aria-controls="filtersCollapse"
            >
              Filtrar citas
            </button>
          </h2>
          <div
            id="filtersCollapse"
            className="accordion-collapse collapse"
            aria-labelledby="filters"
          >
            <div className="accordion-body">
              <div className="d-flex gap-2">
                <div className="flex-grow-1">
                  <div className="row g-3">
                    <div className="col-12 col-md-3">
                      <BranchesSelect selectId="sucursal" />
                    </div>
                    <div className="col-12 col-md-3">
                      <label htmlFor="rangoFechasCitas" className="form-label">
                        Fecha de consulta (hasta)
                      </label>
                      <input
                        className="form-control datetimepicker flatpickr-input"
                        id="rangoFechasCitas"
                        name="rangoFechaCitas"
                        type="text"
                        placeholder="dd/mm/yyyy"
                        data-options='{"mode":"range","dateFormat":"d/m/y","disableMobile":true}'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card mb-3">
        <div className="card-body">
          <CustomDataTable columns={columns} data={appointments} slots={slots}>
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
                <th className="text-end align-middle pe-0 border-top mb-2" scope="col"></th>
              </tr>
            </thead>
          </CustomDataTable>
        </div>
      </div>
    </>
  );
};
