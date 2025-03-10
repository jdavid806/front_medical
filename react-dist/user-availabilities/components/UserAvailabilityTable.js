import React from 'react';
import { useUserAvailabilitiesTable } from "../hooks/useUserAvailabilitiesTable.js";
import { UserTableActions } from "../../users/UserTableActions.js";
import CustomDataTable from "../../components/CustomDataTable.js";
export const UserAvailabilityTable = () => {
  const {
    availabilities
  } = useUserAvailabilitiesTable();
  const columns = [{
    data: 'doctorName'
  }, {
    data: 'appointmentType'
  }, {
    data: 'daysOfWeek'
  }, {
    data: 'startTime'
  }, {
    data: 'endTime'
  }, {
    data: 'branchName'
  }, {
    orderable: false,
    searchable: false
  }];
  const slots = {
    6: (cell, data) => /*#__PURE__*/React.createElement(UserTableActions, null)
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomDataTable, {
    data: availabilities,
    slots: slots,
    columns: columns
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Usuario"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Tipo de Cita"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "D\xEDa de la Semana"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Hora de Inicio"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Hora de Fin"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Sucursal"), /*#__PURE__*/React.createElement("th", {
    className: "text-end align-middle pe-0 border-top mb-2",
    scope: "col"
  })))))));
};