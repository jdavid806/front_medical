import React from 'react';
import { CustomModal } from "../components/CustomModal.js";
import { useState } from 'react';
export const RescheduleAppointmentModal = ({
  show,
  onHide,
  selectedAppointments
}) => {
  const formId = 'rescheduleAppointments';
  const [automaticReschedule, setAutomaticReschedule] = useState(true);
  const handleSubmit = e => {
    e.preventDefault();
    console.log(selectedAppointments, e);
  };
  return /*#__PURE__*/React.createElement(CustomModal, {
    show: show,
    onHide: onHide,
    title: "Reagendar citas",
    footerTemplate: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn btn-danger",
      "data-bs-dismiss": "modal"
    }, "Cancelar cita"), /*#__PURE__*/React.createElement("button", {
      type: "submit",
      form: formId,
      className: "btn btn-primary",
      id: "btnReagendar"
    }, "Reagendar"))
  }, /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "razonReagendamiento",
    className: "form-label"
  }, "Raz\xF3n de reagendamiento"), /*#__PURE__*/React.createElement("textarea", {
    className: "form-control",
    id: "razonReagendamiento",
    rows: 3
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-check"
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-check-input",
    type: "checkbox",
    id: "autoReagendar",
    name: "autoReagendar",
    checked: automaticReschedule,
    onChange: e => setAutomaticReschedule(e.target.checked)
  }), /*#__PURE__*/React.createElement("label", {
    className: "form-check-label",
    htmlFor: "autoReagendar"
  }, "Reagendar autom\xE1ticamente"))), !automaticReschedule && /*#__PURE__*/React.createElement("div", {
    className: "d-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "especialidadReagendar",
    className: "form-label"
  }, "Especialidad"), /*#__PURE__*/React.createElement("select", {
    className: "form-select",
    id: "especialidadReagendar",
    "aria-label": "Especialidad",
    defaultValue: ""
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Seleccione una especialidad"))), /*#__PURE__*/React.createElement("div", {
    className: "row g-2 mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "fechaReagendar",
    className: "form-label"
  }, "Fecha"), /*#__PURE__*/React.createElement("input", {
    className: "form-control datetimepicker flatpickr-input",
    id: "fechaReagendar",
    name: "fechaReagendar",
    type: "text",
    placeholder: "dd/mm/yyyy",
    "data-options": "{\"dateFormat\":\"d/m/y\",\"disableMobile\":true}"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "horaReagendar",
    className: "form-label"
  }, "Hora"), /*#__PURE__*/React.createElement("input", {
    className: "form-control datetimepicker flatpickr-input",
    id: "horaReagendar",
    name: "horaReagendar",
    type: "text",
    placeholder: "HH:MM",
    "data-options": "{\"enableTime\":true,\"noCalendar\":true,\"dateFormat\":\"H:i\",\"disableMobile\":true,\"allowInput\":true}"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "doctorReagendar",
    className: "form-label"
  }, "Doctor(a)"), /*#__PURE__*/React.createElement("select", {
    className: "form-select",
    id: "doctorReagendar",
    required: true,
    name: "assigned_user_id",
    defaultValue: ""
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Seleccione a quien sera asignada")), /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback"
  }, "Por favor seleccione a quien sera asignada.")))));
};