import React, { useEffect, useRef, useState } from "react";
import { AppointmentTableItem } from "../models/models";
import { useFetchAppointments } from "./hooks/useFetchAppointments";
import {
  CustomPRTable,
  CustomPRTableColumnProps,
} from "../components/CustomPRTable";
import AdmissionBilling from "../admission/admission-billing/AdmissionBilling";
import { Dialog } from "primereact/dialog";
import { PrimeReactProvider } from "primereact/api";
import { Button } from "primereact/button";
import { TicketTable } from "../tickets/components/TicketTable";
import { GenerateTicket } from "../tickets/GenerateTicket";
import { AppointmentFormModal } from "./AppointmentFormModal";
import { Menu } from "primereact/menu";
import { getLocalTodayISODate } from "../../services/utilidades";
import { appointmentService } from "../../services/api";
import { SwalManager } from "../../services/alertManagerImported";
import { RescheduleAppointmentModalV2 } from "./RescheduleAppointmentModalV2";
import { usePRToast } from "../hooks/usePRToast";
import { Toast } from "primereact/toast";

interface TodayAppointmentsTableProps {
  onPrintItem?: (id: string, title: string) => void;
  onDownloadItem?: (id: string, title: string) => void;
  onShareItem?: (id: string, title: string, type: string) => void;
}

export const TodayAppointmentsTable: React.FC<
  TodayAppointmentsTableProps
> = () => {
  const [showBillingDialog, setShowBillingDialog] = useState(false);
  const [showTicketControl, setShowTicketControl] = useState(false);
  const [showTicketRequest, setShowTicketRequest] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentTableItem | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const { toast, showSuccessToast } = usePRToast();

  const customFilters = () => {
    return {
      appointmentState: "pending",
      appointmentDate: getLocalTodayISODate(),
      sort: "-appointment_date,appointment_time",
    };
  };

  const {
    appointments,
    handlePageChange,
    handleSearchChange,
    refresh,
    totalRecords,
    first,
    loading,
    perPage,
  } = useFetchAppointments(customFilters);

  useEffect(() => {
    console.log("appointments", appointments);
  }, [appointments]);

  const handleFacturarAdmision = (appointment: AppointmentTableItem) => {
    setSelectedAppointment({
      ...appointment,
      patient: appointment.patient
    });
    setShowBillingDialog(true);
  };

  const handleBillingSuccess = () => {
    setShowBillingDialog(false);
    setSelectedAppointment(null);
    refresh();
  };

  const handleBillingHide = () => {
    setShowBillingDialog(false);
    setSelectedAppointment(null);
  };

  // Función para cancelar cita
  const handleCancelAppointment = async (appointment: AppointmentTableItem) => {
    SwalManager.confirmCancel(async () => {
      try {
        await appointmentService.changeStatus(Number(appointment.id), "cancelled");
        SwalManager.success({ text: "Cita cancelada exitosamente" });
        refresh();
      } catch (error) {
        console.error("Error al cancelar la cita:", error);
        SwalManager.error({ text: "Error al cancelar la cita" });
      }
    });
  };


  const handleAppointmentCreated = () => {
    refresh();
    showSuccessToast({
      title: "Cita creada",
      message: "La cita se ha creado exitosamente y se ha actualizado la tabla"
    });
    setShowAppointmentForm(false);
  };


  // Función para abrir modal de reagendar
  const openRescheduleAppointmentModal = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setShowRescheduleModal(true);
  };

  const handleRescheduleSuccess = () => {
    setShowRescheduleModal(false);
    setSelectedAppointmentId(null);
    refresh();
  };

  const columns: CustomPRTableColumnProps[] = [
    {
      field: "patientName",
      header: "Nombre",
      body: (rowData: AppointmentTableItem) => (
        <>
          <a href={`verPaciente?id=${rowData.patientId}`}>
            {rowData.patientName}
          </a>
        </>
      ),
    },
    { field: "patientDNI", header: "Número de documento" },
    { field: "date", header: "Fecha Consulta" },
    { field: "time", header: "Hora Consulta" },
    { field: "doctorName", header: "Profesional asignado" },
    { field: "entity", header: "Entidad" },

    {
      field: "actions",
      header: "Acciones",
      body: (rowData: AppointmentTableItem) => {
        return (
          <div>
            <TableMenu
              onFacturarAdmision={() => handleFacturarAdmision(rowData)}
              onCancelAppointment={() => handleCancelAppointment(rowData)}
              onRescheduleAppointment={() => openRescheduleAppointmentModal(rowData.id)}
              rowData={rowData}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Toast ref={toast} />
      <div className="d-flex justify-content-end gap-3 mb-4">
        <Button
          label="Control de turnos"
          icon={<i className="fa-solid fa-clock me-2">‌</i>}
          className="p-button-primary me-2"
          onClick={() => setShowTicketControl(true)}
        />
        <Button
          label="Solicitar turno"
          icon={<i className="fa-solid fa-clipboard-check me-2">‌</i>}
          className="p-button-primary me-2"
          onClick={() => setShowTicketRequest(true)}
        />
        <Button
          label="Crear Cita"
          icon={<i className="fa-solid fa-comment-medical me-2">‌</i>}
          className="p-button-primary"
          onClick={() => setShowAppointmentForm(true)}
        />
      </div>

      <div
        className="card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto"
        style={{ minHeight: "400px" }}
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
          />
        </div>
      </div>

      <AdmissionBilling
        visible={showBillingDialog}
        onHide={handleBillingHide}
        onSuccess={handleBillingSuccess}
        appointmentData={selectedAppointment}
      />

      <RescheduleAppointmentModalV2
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        appointmentId={selectedAppointmentId}
        onSuccess={handleRescheduleSuccess}
      />

      <Dialog
        header="Control de Turnos"
        visible={showTicketControl}
        style={{ width: "90vw", maxWidth: "1200px" }}
        onHide={() => setShowTicketControl(false)}
        maximizable
        modal
      >
        <PrimeReactProvider>
          <TicketTable />
        </PrimeReactProvider>
      </Dialog>

      <Dialog
        header="Solicitud de Turnos"
        visible={showTicketRequest}
        style={{ width: "70vw" }}
        onHide={() => setShowTicketRequest(false)}
        modal
      >
        <GenerateTicket />
      </Dialog>

      <Dialog
        header="Crear Nueva Cita"
        visible={showAppointmentForm}
        style={{ width: "50vw" }}
        onHide={() => setShowAppointmentForm(false)}
        modal
      >
        <AppointmentFormModal
          isOpen={showAppointmentForm}
          onClose={() => setShowAppointmentForm(false)}
          onAppointmentCreated={handleAppointmentCreated}
        />
      </Dialog>
    </>
  );
};

const TableMenu: React.FC<{
  rowData: AppointmentTableItem,
  onFacturarAdmision: () => void,
  onCancelAppointment: () => void,
  onRescheduleAppointment: () => void
}> = ({ rowData, onFacturarAdmision, onCancelAppointment, onRescheduleAppointment }) => {

  const menu = useRef<Menu>(null);

  return <>
    <Button
      className="btn-primary flex items-center gap-2"
      onClick={(e) => menu.current?.toggle(e)}
      aria-controls={`popup_menu_${rowData.id}`}
      aria-haspopup
    >
      Acciones
      <i className="fa fa-cog ml-2"></i>
    </Button>
    <Menu
      model={[
        {
          label: "Facturar admisión",
          icon: <i className="fa-solid fa-receipt me-2"></i>,
          command: () => onFacturarAdmision(),
        },
        {
          label: "Cancelar",
          icon: <i className="fa fa-times me-2"></i>,
          command: () => onCancelAppointment(),
        },
        {
          label: "Reagendar",
          icon: <i className="fa fa-calendar me-2"></i>,
          command: () => onRescheduleAppointment(),
        }
      ]}
      popup
      ref={menu}
      id={`popup_menu_${rowData.id}`}
      style={{ zIndex: 9999 }}
    />
  </>
};