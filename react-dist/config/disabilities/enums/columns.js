import React from "react";
import { EditTableAction } from "../../../components/table-actions/EditTableAction.js";
import TableActionsWrapper from "../../../components/table-actions/TableActionsWrapper.js";
export const getColumns = ({
  editDisability
}) => [{
  field: "id",
  header: "ID"
}, {
  field: "start_date",
  header: "Fecha de inicio",
  body: rowData => {
    const date = new Date(rowData.start_date);
    return date.toLocaleDateString('es-ES');
  }
}, {
  field: "end_date",
  header: "Fecha de fin",
  body: rowData => {
    const date = new Date(rowData.end_date);
    return date.toLocaleDateString('es-ES');
  }
}, {
  field: "reason",
  header: "Razón"
}, {
  field: "is_active",
  header: "Estado",
  body: rowData => /*#__PURE__*/React.createElement("span", {
    className: `badge ${rowData.is_active ? 'bg-success' : 'bg-danger'}`
  }, rowData.is_active ? 'Activa' : 'Inactiva')
}, {
  field: "user.first_name",
  header: "Médico",
  body: rowData => `${rowData.user.first_name} ${rowData.user.last_name}`
}, {
  field: "user.specialty.name",
  header: "Especialidad",
  body: rowData => rowData.user.specialty?.name || 'N/A'
}, {
  field: "created_at",
  header: "Fecha de creación",
  body: rowData => {
    const date = new Date(rowData.created_at);
    return date.toLocaleDateString('es-ES');
  }
}, {
  field: "",
  header: "Acciones",
  body: rowData => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TableActionsWrapper, null, /*#__PURE__*/React.createElement(EditTableAction, {
    onTrigger: () => editDisability(rowData.id.toString())
  })))
}];