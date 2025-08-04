import React from "react";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useGeneralJournal } from "./hooks/useGeneralJournal.js";
export const GeneralJournal = ({
  fetchData
}) => {
  const {
    dateRange,
    setDateRange,
    generalJournal,
    fetchGeneralJournal,
    loading
  } = useGeneralJournal();
  const formatCurrency = value => {
    return value ? `$${parseFloat(value).toFixed(2)}` : '';
  };
  const columns = [{
    field: 'fecha',
    header: 'Fecha',
    body: rowData => new Date(rowData.fecha).toLocaleDateString()
  }, {
    field: 'numero_asiento',
    header: 'N° Asiento'
  }, {
    field: 'cuenta',
    header: 'Cuenta'
  }, {
    field: 'debe',
    header: 'Debe',
    body: rowData => formatCurrency(rowData.debe),
    style: {
      textAlign: 'right'
    }
  }, {
    field: 'haber',
    header: 'Haber',
    body: rowData => formatCurrency(rowData.haber),
    style: {
      textAlign: 'right'
    }
  }, {
    field: 'descripcion',
    header: 'Descripción'
  }, {
    field: 'tercero',
    header: 'Tercero'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Libro Diario de Contabilidad",
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "dateRange",
    className: "form-label"
  }, "Rango de fechas"), /*#__PURE__*/React.createElement(Calendar, {
    id: "dateRange",
    selectionMode: "range",
    value: dateRange,
    onChange: e => setDateRange(e.value),
    className: "w-100",
    showIcon: true,
    dateFormat: "dd/mm/yy",
    placeholder: "Seleccione un rango",
    appendTo: document.body
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-2 d-flex align-items-end"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Filtrar",
    icon: "pi pi-filter",
    onClick: fetchGeneralJournal,
    className: "w-100",
    disabled: !dateRange || dateRange.length !== 2
  }))), /*#__PURE__*/React.createElement(DataTable, {
    value: generalJournal,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    stripedRows: true,
    className: "p-datatable-gridlines",
    emptyMessage: "No se encontraron asientos contables",
    tableStyle: {
      minWidth: "100%"
    },
    header: "Asientos Contables"
  }, columns.map((col, i) => /*#__PURE__*/React.createElement(Column, {
    key: i,
    field: col.field,
    header: col.header,
    body: col.body,
    style: col.style,
    sortable: true
  })))));
};