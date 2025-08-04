import React from "react";
import { useFetchAppointments } from "./hooks/useFetchAppointments.js";
import { CustomPRTable } from "../components/CustomPRTable.js";
export const TodayAppointmentsTable = () => {
  const customFilters = () => {
    return {
      appointmentState: 'pending',
      appointmentDate: new Date().toISOString().split('T')[0],
      sort: '-appointment_date,appointment_time'
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
    perPage
  } = useFetchAppointments(customFilters);
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
    field: "",
    header: "",
    body: rowData => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
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
      href: `generar_admision_rd?id_cita=${rowData.id}`,
      className: "dropdown-item",
      id: "generar-admision"
    }, "Generar admisi\xF3n")))))
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "300px"
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
  }))));
};