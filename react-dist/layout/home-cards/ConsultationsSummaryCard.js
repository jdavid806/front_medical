// ConsultationsSummaryCard.js
import React from 'react';
import { useAppointmentsConsultationsToday } from "./hooks/useAppointmentsConsultationsToday.js";
import { Toast } from 'primereact/toast';
export const ConsultationsSummaryCard = () => {
  const handleViewAppointments = () => {
    window.location.href = 'pacientes';
  };
  const {
    apointmentCount,
    fetchAppointmentConsultationsToday,
    toast: ToastConsultationError
  } = useAppointmentsConsultationsToday();
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: ToastConsultationError
  }), /*#__PURE__*/React.createElement("div", {
    className: "card dashboard-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-magnifying-glass"
  }), " Consultas"), /*#__PURE__*/React.createElement("div", {
    className: "card-content"
  }, /*#__PURE__*/React.createElement("h3", null, apointmentCount?.display), /*#__PURE__*/React.createElement("span", {
    className: "text-span-descripcion"
  }, "Consultas para Hoy")), /*#__PURE__*/React.createElement("div", {
    className: "card-button"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-phoenix-secondary me-1 mb-1",
    type: "button",
    onClick: handleViewAppointments
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-magnifying-glass"
  }), " Ver Consultas")))));
};