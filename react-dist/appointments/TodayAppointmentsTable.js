import React from "react";
import CustomDataTable from "../components/CustomDataTable.js";
import { useFetchAppointments } from "./hooks/useFetchAppointments.js";
import { admissionService } from "../../services/api/index.js";
import { useEffect } from "react";
export const TodayAppointmentsTable = ({
  onPrintItem,
  onDownloadItem,
  onShareItem
}) => {
  const {
    appointments
  } = useFetchAppointments(admissionService.getAdmisionsAll());
  useEffect(() => {
    console.log('ADMISIONES DE HOY', appointments);
  }, [appointments]);
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
    orderable: false,
    searchable: false
  }];
  const slots = {
    6: (cell, data) => /*#__PURE__*/React.createElement("div", {
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
    }, "Generar admisi\xF3n"))))
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomDataTable, {
    columns: columns,
    data: appointments,
    slots: slots,
    customOptions: {
      ordering: false,
      columnDefs: [{
        targets: 0,
        orderable: false
      } // Desactiva el ordenamiento para la primera columna (name)
      ]
    }
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
    className: "text-end align-middle pe-0 border-top mb-2"
  })))))));
};