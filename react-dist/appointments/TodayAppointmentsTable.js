import React, { useEffect, useRef, useState } from "react";
import { useFetchAppointments } from "./hooks/useFetchAppointments.js";
import { CustomPRTable } from "../components/CustomPRTable.js";
import AdmissionBilling from "../admission/admission-billing/AdmissionBilling.js";
import { Dialog } from "primereact/dialog";
import { PrimeReactProvider } from "primereact/api";
import { Button } from "primereact/button";
import { TicketTable } from "../tickets/components/TicketTable.js";
import { GenerateTicket } from "../tickets/GenerateTicket.js";
import { AppointmentFormModal } from "./AppointmentFormModal.js";
import { Menu } from "primereact/menu";
import { useProductsToBeInvoiced } from "./hooks/useProductsToBeInvoiced.js";
import { getLocalTodayISODate } from "../../services/utilidades.js";
export const TodayAppointmentsTable = () => {
  const [showBillingDialog, setShowBillingDialog] = useState(false);
  const [showTicketControl, setShowTicketControl] = useState(false);
  const [showTicketRequest, setShowTicketRequest] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const customFilters = () => {
    return {
      appointmentState: "pending",
      appointmentDate: getLocalTodayISODate(),
      sort: "-appointment_date,appointment_time"
    };
  };
  const handleFacturarAdmision = appointment => {
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
    perPage
  } = useFetchAppointments(customFilters);
  const {
    products,
    loading: productsLoading
  } = useProductsToBeInvoiced(selectedAppointment?.id || null);
  console.log("products", products);
  useEffect(() => {
    console.log("appointments", appointments);
  }, [appointments]);
  const columns = [{
    field: "patientName",
    header: "Nombre",
    body: rowData => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
      href: `verPaciente?id=${rowData.patientId}`
    }, rowData.patientName))
  }, {
    field: "patientDNI",
    header: "Número de documento"
  }, {
    field: "date",
    header: "Fecha Consulta"
  }, {
    field: "time",
    header: "Hora Consulta"
  }, {
    field: "doctorName",
    header: "Profesional asignado"
  }, {
    field: "entity",
    header: "Entidad"
  }, {
    field: "actions",
    header: "Acciones",
    body: rowData => {
      console.log("rowData", rowData);
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TableMenu, {
        onFacturarAdmision: () => handleFacturarAdmision(rowData),
        rowData: rowData
      }));
    }
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-3 mb-4"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Control de turnos",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-clock me-2"
    }, "\u200C"),
    className: "p-button-primary me-2",
    onClick: () => setShowTicketControl(true)
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Solicitar turno",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-clipboard-check me-2"
    }, "\u200C"),
    className: "p-button-primary me-2",
    onClick: () => setShowTicketRequest(true)
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Crear Cita",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-comment-medical me-2"
    }, "\u200C"),
    className: "p-button-primary",
    onClick: () => setShowAppointmentForm(true)
  })), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "400px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body h-100 w-100 d-flex flex-column"
  }, /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: appointments,
    lazy: true,
    first: first,
    rows: perPage,
    totalRecords: totalRecords,
    loading: loading,
    onPage: handlePageChange,
    onSearch: handleSearchChange,
    onReload: refresh
  }))), /*#__PURE__*/React.createElement(AdmissionBilling, {
    visible: showBillingDialog,
    onHide: () => setShowBillingDialog(false),
    appointmentData: selectedAppointment,
    productsToInvoice: products,
    productsLoading: productsLoading
  }), /*#__PURE__*/React.createElement(Dialog, {
    header: "Control de Turnos",
    visible: showTicketControl,
    style: {
      width: "90vw",
      maxWidth: "1200px"
    },
    onHide: () => setShowTicketControl(false),
    maximizable: true,
    modal: true
  }, /*#__PURE__*/React.createElement(PrimeReactProvider, null, /*#__PURE__*/React.createElement(TicketTable, null))), /*#__PURE__*/React.createElement(Dialog, {
    header: "Solicitud de Turnos",
    visible: showTicketRequest,
    style: {
      width: "70vw"
    },
    onHide: () => setShowTicketRequest(false),
    modal: true
  }, /*#__PURE__*/React.createElement(GenerateTicket, null)), /*#__PURE__*/React.createElement(Dialog, {
    header: "Crear Nueva Cita",
    visible: showAppointmentForm,
    style: {
      width: "50vw"
    },
    onHide: () => setShowAppointmentForm(false),
    modal: true
  }, /*#__PURE__*/React.createElement(AppointmentFormModal, {
    isOpen: showAppointmentForm,
    onClose: () => setShowAppointmentForm(false)
  })));
};
const TableMenu = ({
  rowData,
  onFacturarAdmision
}) => {
  const menu = useRef(null);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    className: "btn-primary flex items-center gap-2",
    onClick: e => menu.current.toggle(e),
    "aria-controls": `popup_menu_${rowData.id}`,
    "aria-haspopup": true
  }, "Acciones", /*#__PURE__*/React.createElement("i", {
    className: "fa fa-cog\t ml-2"
  })), /*#__PURE__*/React.createElement(Menu, {
    model: [{
      label: "Generar admisión",
      command: () => window.location.href = `generar_admision_rd?id_cita=${rowData.id}`
    }, {
      label: "Facturar admisión",
      command: () => onFacturarAdmision()
    }],
    popup: true,
    ref: menu,
    id: `popup_menu_${rowData.id}`,
    style: {
      zIndex: 9999
    },
    onBlur: e => menu.current?.hide(e)
  }));
};