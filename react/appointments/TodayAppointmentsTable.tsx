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
import { useState } from "react";

interface TodayAppointmentsTableProps {
  onPrintItem?: (id: string, title: string) => void;
  onDownloadItem?: (id: string, title: string) => void;
  onShareItem?: (id: string, title: string, type: string) => void;
}

export const TodayAppointmentsTable: React.FC<TodayAppointmentsTableProps> = ({
  onPrintItem,
  onDownloadItem,
  onShareItem,
}) => {
  const { appointments } = useFetchAppointments(
    admissionService.getAdmisionsAll()
  );
  const [filterAppointments, setFilterAppointments] = useState<
    AppointmentTableItem[]
  >([]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Obtener la fecha actual en formato "YYYY-MM-DD"
    setFilterAppointments(
      appointments.filter(
        (appointment) =>
          appointment.stateKey === "pending" && appointment.date === today
      )
    );
  }, [appointments]);

  const columns: ConfigColumns[] = [
    { data: "patientName", className: "text-start" },
    { data: "patientDNI", className: "text-start" },
    { data: "date", className: "text-start" },
    { data: "time" },
    { data: "doctorName" },
    { data: "entity" },
    { orderable: false, searchable: false },
  ];

  const slots = {
    6: (cell, data: AppointmentTableItem) => (
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
            {/* <a className="dropdown-item" href="#">
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
            <PrintTableAction onTrigger={() => {
              //@ts-ignore
              generateInvoice(data.id, false);
            }}></PrintTableAction>
            <DownloadTableAction onTrigger={() => {
              //@ts-ignore
              generateInvoice(data.id, true);
            }}></DownloadTableAction>
            <ShareTableAction shareType="whatsapp" onTrigger={() => console.log("compartir por whatsapp")}></ShareTableAction>
            <ShareTableAction shareType="email" onTrigger={() => console.log("compartir por correo")}></ShareTableAction> */}
          </div>
        </div>
      </div>
    ),
  };

  return (
    <>
      <div
        className="mb-3 text-body-emphasis rounded-3 shadow-sm p-3 w-100 w-md-100 w-lg-100 mx-auto"
        style={{ minHeight: "300px" }}
      >
        <div className="card-body h-100 w-100 d-flex flex-column">
          <CustomDataTable
            columns={columns}
            data={filterAppointments}
            slots={slots}
            customOptions={{
              ordering: false,
              columnDefs: [
                { targets: 0, orderable: false }, // Desactiva el ordenamiento para la primera columna (name)
              ],
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
                <th className="text-end align-middle pe-0 border-top mb-2"></th>
              </tr>
            </thead>
          </CustomDataTable>
        </div>
      </div>
    </>
  );
};
