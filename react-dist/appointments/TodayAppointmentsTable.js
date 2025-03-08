import React from 'react';
import CustomDataTable from "../components/CustomDataTable.js";
import { useFetchAppointments } from "./hooks/useFetchAppointments.js";
import { admissionService } from "../../services/api/index.js";
export const TodayAppointmentsTable = () => {
  const {
    appointments
  } = useFetchAppointments(admissionService.getAdmisionsAll());
  const columns = [{
    data: 'patientName',
    className: 'text-start'
  }, {
    data: 'patientDNI',
    className: 'text-start'
  }, {
    data: 'date',
    className: 'text-start'
  }, {
    data: 'time'
  }, {
    data: 'doctorName'
  }, {
    data: 'entity'
  }, {
    data: 'status'
  }, {
    orderable: false,
    searchable: false
  }];
  const slots = {
    6: (cell, data) => /*#__PURE__*/React.createElement("span", {
      className: `badge badge-phoenix ${data.status ? 'badge-phoenix-primary' : 'badge-phoenix-secondary'}`
    }, data.status ? 'Activo' : 'Inactivo'),
    7: (cell, data) => /*#__PURE__*/React.createElement("div", {
      className: "align-middle white-space-nowrap pe-0 p-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "btn-group me-1"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn dropdown-toggle mb-1 btn-primary",
      type: "button",
      "data-bs-toggle": "dropdown",
      "aria-haspopup": "true",
      "aria-expanded": "false"
    }, "Acciones"), /*#__PURE__*/React.createElement("div", {
      className: "dropdown-menu"
    }, /*#__PURE__*/React.createElement("a", {
      href: `generar_admision?id_cita=${data.id}`,
      className: "dropdown-item",
      id: "generar-admision"
    }, " Generar admisi\xF3n"), /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#"
    }, " Generar link de pago"))))
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
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
  }, "Estado"), /*#__PURE__*/React.createElement("th", {
    className: "text-end align-middle pe-0 border-top mb-2"
  })))))));
};