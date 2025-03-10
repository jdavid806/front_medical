import React from "react";
import { AppointmentTableItem } from "../models/models";
import CustomDataTable from "../components/CustomDataTable";
import { ConfigColumns } from "datatables.net-bs5";
import { useFetchAppointments } from "./hooks/useFetchAppointments";
import { appointmentService } from "../../services/api";
import { BranchesSelect } from "../branches/BranchesSelect";

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

  const slots = {
    6: (cell, data: AppointmentTableItem) => (
      <span
        className={`badge badge-phoenix ${
          data.status ? "badge-phoenix-primary" : "badge-phoenix-secondary"
        }`}
      >
        {data.status ? "Activo" : "Inactivo"}
      </span>
    ),
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
              </tr>
            </thead>
          </CustomDataTable>
        </div>
      </div>
    </>
  );
};
