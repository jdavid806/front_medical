import React from 'react';
import CustomDataTable from "../../components/CustomDataTable.js";
import TableActionsWrapper from "../../components/table-actions/TableActionsWrapper.js";
import { EditTableAction } from "../../components/table-actions/EditTableAction.js";
import { DeleteTableAction } from "../../components/table-actions/DeleteTableAction.js";
export const UserAvailabilityTable = ({
  availabilities,
  onEditItem,
  onDeleteItem
}) => {
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
    6: (cell, data) => /*#__PURE__*/React.createElement(TableActionsWrapper, null, /*#__PURE__*/React.createElement(EditTableAction, {
      onTrigger: () => onEditItem && onEditItem(data.id)
    }), /*#__PURE__*/React.createElement(DeleteTableAction, {
      onTrigger: () => onDeleteItem && onDeleteItem(data.id)
    }))
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