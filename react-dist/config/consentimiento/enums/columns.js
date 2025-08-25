import React from "react";
import { Button } from 'primereact/button';
export const getColumns = ({
  editConsentimiento,
  deleteConsentimiento
}) => [
// { field: "tenant_id", header: "ID del Tenant" },
{
  field: "title",
  header: "Título"
}, {
  field: "data",
  header: "Datos"
}, {
  field: "description",
  header: "Descripción"
}, {
  field: "",
  header: "Acciones",
  style: {
    width: '60px'
  },
  body: rowData => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-rounded p-button-text p-button-sm",
    onClick: e => {
      e.stopPropagation();
      editConsentimiento(rowData.id ?? '');
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-pencil-alt"
  })), /*#__PURE__*/React.createElement(Button, {
    className: "p-button-rounded p-button-text p-button-sm p-button-danger",
    onClick: e => {
      e.stopPropagation();
      deleteConsentimiento(rowData.id ?? '');
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-trash"
  })))
}];