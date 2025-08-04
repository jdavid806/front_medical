import React from 'react';
import { AppointmentFormModal } from "./appointments/AppointmentFormModal.js";
export const AppointmentsSummaryCard = () => {
  const [showAppointmentFormModal, setShowAppointmentFormModal] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      "maxWidth": '18rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, /*#__PURE__*/React.createElement("span", {
    "data-feather": "calendar"
  }), " Citas Generadas"), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("h3", {
    id: "appointmentsActiveCount"
  }, "Cargando..."), "Citas generadas este mes"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-phoenix-secondary me-1 mb-1",
    type: "button",
    onClick: () => setShowAppointmentFormModal(true)
  }, /*#__PURE__*/React.createElement("span", {
    className: "far fa-calendar-plus"
  }), " Nueva Cita"), /*#__PURE__*/React.createElement(AppointmentFormModal, {
    isOpen: showAppointmentFormModal,
    onClose: () => setShowAppointmentFormModal(false)
  })));
};