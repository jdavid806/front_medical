import React, { useEffect, useState } from "react";
import { AppointmentTableItem } from "../models/models";
import CustomDataTable from "../components/CustomDataTable";
import { ConfigColumns } from "datatables.net-bs5";
import { useFetchAppointments } from "./hooks/useFetchAppointments";
import { appointmentService } from "../../services/api";
import {
  appointmentStateColorsByKey,
  appointmentStates,
  appointmentStatesByKey,
  appointmentStatesColors,
} from "../../services/commons";
import UserManager from "../../services/userManager";
import { useBranchesForSelect } from "../branches/hooks/useBranchesForSelect";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { CustomFormModal } from "../components/CustomFormModal";
import { PreadmissionForm } from "./PreadmissionForm";
import { PrintTableAction } from "../components/table-actions/PrintTableAction";
import { DownloadTableAction } from "../components/table-actions/DownloadTableAction";
import { ShareTableAction } from "../components/table-actions/ShareTableAction";

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

  console.log("Citas: ", appointments);

  const columns: ConfigColumns[] = [
    { data: "patientName", className: "text-start", orderable: true },
    { data: "patientDNI", className: "text-start", orderable: true },
    { data: "date", className: "text-start", orderable: true, type: "date" },
    { data: "time", orderable: true },
    { data: "doctorName", orderable: true },
    { data: "entity", orderable: true },
    { data: "status", orderable: true },
  ];

  const [showFormModal, setShowFormModal] = useState({
    isShow: false,
    data: {},
  });

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

  const handleCancelAppointment = (appointmentId: string) => {};

  const handleHideFormModal = () => {
    setShowFormModal({ isShow: false, data: {} });
  };

  const handleLoadExamResults = (
    patientId: string,
    productId: string,
    examId = ""
  ) => {
    window.location.href = `cargarResultadosExamen?patient_id=${patientId}&product_id=${productId}&exam_id=${examId}`;
  };

  const slots = {
    6: (cell, data: AppointmentTableItem) => {
      const color =
        appointmentStatesColors[data.stateId] ||
        appointmentStateColorsByKey[data.stateKey];
      const text =
        appointmentStates[data.stateId] ||
        appointmentStatesByKey[`${data.stateKey}.${data.attentionType}`] ||
        appointmentStatesByKey[data.stateKey];
      return (
        <span className={`badge badge-phoenix badge-phoenix-${color}`}>
          {text}
        </span>
      );
    },
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
            <li>
              <a
                className="dropdown-item"
                onClick={() =>
                  setShowFormModal({
                    isShow: true,
                    data: data,
                  })
                }
              >
                <div className="d-flex gap-2 align-items-center">
                  <i
                    className="fa-solid far fa-hospital"
                    style={{ width: "20px" }}
                  ></i>
                  <span>Generar preadmision</span>
                </div>
              </a>
            </li>
            {(data.stateId === "2" ||
              data.stateKey === "pending_consultation") &&
              data.attentionType === "CONSULTATION" && (
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
            {(data.stateId === "2" ||
              data.stateKey === "pending_consultation") &&
              data.attentionType === "PROCEDURE" && (
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLoadExamResults(data.patientId, data.productId);
                    }}
                    data-column="realizar-consulta"
                  >
                    <div className="d-flex gap-2 align-items-center">
                      <i
                        className="fa-solid fa-stethoscope"
                        style={{ width: "20px" }}
                      ></i>
                      <span>Realizar examen</span>
                    </div>
                  </a>
                </li>
              )}
            {data.stateId === "1" ||
              (data.stateKey === "pending" && (
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
              ))}
            <hr />
            <PrintTableAction
              onTrigger={() => {
                //@ts-ignore
                generateInvoice(data.id, false);
              }}
            ></PrintTableAction>
            <DownloadTableAction
              onTrigger={() => {
                //@ts-ignore
                generateInvoice(data.id, true);
              }}
            ></DownloadTableAction>
            <ShareTableAction
              shareType="whatsapp"
              onTrigger={() => {
                //@ts-ignore
                sendInvoice(data.id, data.patientId);
              }}
            ></ShareTableAction>
            <ShareTableAction
              shareType="email"
              onTrigger={() => {
                //@ts-ignore
                sendInvoice(data.id, data.patientId);
              }}
            ></ShareTableAction>
          </ul>
        </div>
      </div>
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
                    <div className="col">
                      <label htmlFor="branch_id" className="form-label">
                        Sucursal
                      </label>
                      <Dropdown
                        inputId="branch_id"
                        options={branches}
                        optionLabel="label"
                        optionValue="value"
                        filter
                        placeholder="Filtrar por sucursal"
                        className="w-100"
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.value)}
                        showClear
                      />
                    </div>
                    <div className="col">
                      <label htmlFor="rangoFechasCitas" className="form-label">
                        Rango de fechas
                      </label>
                      <Calendar
                        id="rangoFechasCitas"
                        name="rangoFechaCitas"
                        selectionMode="range"
                        dateFormat="dd/mm/yy"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.value)}
                        className="w-100"
                        placeholder="Seleccione un rango"
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

      <CustomFormModal
        formId={"createPreadmission"}
        show={showFormModal.isShow}
        onHide={handleHideFormModal}
        title={"Crear Preadmision" + " - " + showFormModal.data["patientName"]}
      >
        <PreadmissionForm
          initialValues={showFormModal.data}
          formId="createPreadmission"
        ></PreadmissionForm>
      </CustomFormModal>
    </>
  );
};
