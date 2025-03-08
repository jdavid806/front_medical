import React from "react";
import CustomDataTable from "../components/CustomDataTable.js";
import { useFetchAppointments } from "./hooks/useFetchAppointments.js";
import { appointmentService } from "../../services/api/index.js";
import { BranchesSelect } from "../branches/BranchesSelect.js";
export const AppointmentsTable = () => {
  const {
    appointments
  } = useFetchAppointments(appointmentService.active());
  const columns = [{
    data: "patientName",
    className: "text-start"
  }, {
    data: "patientDNI",
    className: "text-start"
  }, {
    data: "date",
    className: "text-start"
  }, {
    data: "time"
  }, {
    data: "doctorName"
  }, {
    data: "entity"
  }, {
    data: "status"
  }];
  const slots = {
    7: (cell, data) => /*#__PURE__*/React.createElement("span", {
      className: `badge badge-phoenix ${data.status ? "badge-phoenix-primary" : "badge-phoenix-secondary"}`
    }, data.status ? "Activo" : "Inactivo")
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "accordion mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion-item"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "accordion-header",
    id: "filters"
  }, /*#__PURE__*/React.createElement("button", {
    className: "accordion-button collapsed",
    type: "button",
    "data-bs-toggle": "collapse",
    "data-bs-target": "#filtersCollapse",
    "aria-expanded": "false",
    "aria-controls": "filtersCollapse"
  }, "Filtrar citas")), /*#__PURE__*/React.createElement("div", {
    id: "filtersCollapse",
    className: "accordion-collapse collapse",
    "aria-labelledby": "filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-grow-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-3"
  }, /*#__PURE__*/React.createElement(BranchesSelect, {
    selectId: "sucursal"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "rangoFechasCitas",
    className: "form-label"
  }, "Fecha de consulta (hasta)"), /*#__PURE__*/React.createElement("input", {
    className: "form-control datetimepicker flatpickr-input",
    id: "rangoFechasCitas",
    name: "rangoFechaCitas",
    type: "text",
    placeholder: "dd/mm/yyyy",
    "data-options": "{\"mode\":\"range\",\"dateFormat\":\"d/m/y\",\"disableMobile\":true}"
  }))))))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomDataTable, {
    columns: columns,
    data: appointments,
    slots: slots
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th text-start"
  }, "Nombre"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th text-start"
  }, "N\xFAmero de documento"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th text-start"
  }, "Fecha Consulta"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th text-start"
  }, "Hora Consulta"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th text-start"
  }, "Profesional asignado"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th text-start"
  }, "Entidad"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th text-start"
  }, "Estado")))))));
};