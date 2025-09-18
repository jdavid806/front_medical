import React from "react";
import { Button } from 'primereact/button';
export const getDocumentColumns = ({
  onView,
  onEdit,
  onDelete,
  onSign
}) => [{
  field: "fecha",
  header: "Fecha",
  sortable: true,
  body: rowData => {
    if (!rowData.fecha) return '-';
    return new Date(rowData.fecha).toLocaleDateString('es-ES');
  }
}, {
  field: "titulo",
  header: "Título",
  sortable: true,
  body: rowData => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "fw-bold"
  }, rowData.titulo || 'Sin título'), rowData.motivo && /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, rowData.motivo))
}, {
  field: 'firmado',
  header: 'Estado Firma',
  body: rowData => rowData.firmado === true ? /*#__PURE__*/React.createElement("span", {
    className: "badge bg-success"
  }, "Firmado") : /*#__PURE__*/React.createElement("span", {
    className: "badge bg-warning text-dark"
  }, "Pendiente"),
  sortable: false
}, {
  field: "",
  header: "Acciones",
  style: {
    width: '120px',
    textAlign: 'center'
  },
  body: rowData => /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center gap-1"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-rounded p-button-text p-button-sm p-button-info",
    tooltip: "Ver documento",
    onClick: e => {
      e.stopPropagation();
      onView(rowData.id ?? '');
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-eye"
  })), /*#__PURE__*/React.createElement(Button, {
    className: "p-button-rounded p-button-text p-button-sm p-button-warning",
    tooltip: "Editar documento",
    onClick: e => {
      e.stopPropagation();
      onEdit(rowData.id ?? '');
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-pencil-alt"
  })), /*#__PURE__*/React.createElement(Button, {
    className: "p-button-rounded p-button-text p-button-sm p-button-danger",
    tooltip: "Eliminar documento",
    onClick: e => {
      e.stopPropagation();
      onDelete(rowData.id ?? '');
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-trash"
  })), /*#__PURE__*/React.createElement(Button, {
    className: "p-button-rounded p-button-text p-button-sm p-button-warning",
    tooltip: "Firmar documento",
    onClick: e => {
      e.stopPropagation();
      onSign(rowData.id ?? '');
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-signature"
  })))
}];