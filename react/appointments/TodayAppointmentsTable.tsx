import React from "react";
import { AppointmentTableItem } from "../models/models";
import CustomDataTable from "../components/CustomDataTable";
import { ConfigColumns } from "datatables.net-bs5";
import { useFetchAppointments } from "./hooks/useFetchAppointments";
import { admissionService } from "../../services/api";
import { useEffect } from "react";
import { PrintTableAction } from "../components/table-actions/PrintTableAction";
import { DownloadTableAction } from "../components/table-actions/DownloadTableAction";
import { ShareTableAction } from "../components/table-actions/ShareTableAction";

export const TodayAppointmentsTable: React.FC = () => {
  const { appointments } = useFetchAppointments(
    admissionService.getAdmisionsAll()
  );

  useEffect(() => {
    console.log(appointments);
  }, [appointments]);

  const columns: ConfigColumns[] = [
    { data: "patientName", className: "text-start" },
    { data: "patientDNI", className: "text-start" },
    { data: "date", className: "text-start" },
    { data: "time" },
    { data: "doctorName" },
    { data: "entity" },
    { data: "status" },
    { orderable: false, searchable: false },
  ];

  const slots = {
    6: (cell, data: AppointmentTableItem) => (
      console.log("cita admision:", data),
      (
        <span
          className={`badge badge-phoenix ${data.status ? "badge-phoenix-primary" : "badge-phoenix-secondary"
            }`}
        >
          {data.status ? "Activo" : "Inactivo"}
        </span>
      )
    ),
    7: (cell, data: AppointmentTableItem) => (
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
              href={`generar_admision?id_cita=${data.id}`}
              className="dropdown-item"
              id="generar-admision"
            >
              Generar admisión
            </a>
            <a className="dropdown-item" href="#">
              Generar link de pago
            </a>
            <a className="dropdown-item" href="#">
              Descargar Factura
            </a>
            <a className="dropdown-item" href="#">
              Imprimir factura
            </a>
            <a className="dropdown-item" href="#">
              Compartir por whatsapp y correo
            </a>
            <a className="dropdown-item" href="#">
              Nota credito
            </a>
            <hr />
            <PrintTableAction onTrigger={() => console.log("imprimir")}></PrintTableAction>
            <DownloadTableAction onTrigger={() => console.log("descargar")}></DownloadTableAction>
            <ShareTableAction shareType="whatsapp" onTrigger={() => console.log("compartir por whatsapp")}></ShareTableAction>
            <ShareTableAction shareType="email" onTrigger={() => console.log("compartir por correo")}></ShareTableAction>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <>
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
                <th className="text-end align-middle pe-0 border-top mb-2"></th>
              </tr>
            </thead>
          </CustomDataTable>
        </div>
      </div>
    </>
  );
};
