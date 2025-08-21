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
import { useProductsToBeInvoiced } from "./hooks/useProductsToBeInvoiced";

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
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentTableItem | null>(null);

  const customFilters = () => {
    return {
      appointmentState: "pending",
      appointmentDate: new Date().toISOString().split("T")[0],
      sort: "-appointment_date,appointment_time",
    };
  };

  const handleFacturarAdmision = (appointment: AppointmentTableItem) => {
    setSelectedAppointment({
      ...appointment,
      patient: appointment.patient
    });
    setShowBillingDialog(true);
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

  const { products, loading: productsLoading } = useProductsToBeInvoiced(
    selectedAppointment?.id || null
  );

  console.log("products", products);

  useEffect(() => {
    console.log("appointments", appointments);

  }, [appointments]);

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
        console.log("rowData", rowData);

        return (
          <div>
            <TableMenu
              onFacturarAdmision={() => handleFacturarAdmision(rowData)}
              rowData={rowData}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
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
        onHide={() => setShowBillingDialog(false)}
        appointmentData={selectedAppointment}
        productsToInvoice={products}
        productsLoading={productsLoading}

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
        />
      </Dialog>
    </>
  );
};

const TableMenu: React.FC<{
  rowData: AppointmentTableItem,
  onFacturarAdmision: () => void
}> = ({ rowData, onFacturarAdmision }) => {

  const menu = useRef<Menu>(null);

  return <>
    <Button
      className="btn-primary flex items-center gap-2"
      onClick={(e) => menu.current.toggle(e)}
      aria-controls={`popup_menu_${rowData.id}`}
      aria-haspopup
    >
      Acciones
      <i className="fa fa-cog	 ml-2"></i>
    </Button>
    <Menu
      model={[
        {
          label: "Generar admisión",
          command: () =>
            (window.location.href = `generar_admision_rd?id_cita=${rowData.id}`),
        },
        {
          label: "Facturar admisión",
          command: () => onFacturarAdmision(),
        }
      ]}
      popup
      ref={menu}
      id={`popup_menu_${rowData.id}`}
      style={{ zIndex: 9999 }}
      onBlur={(e) => menu.current?.hide(e)}
    />
  </>
};