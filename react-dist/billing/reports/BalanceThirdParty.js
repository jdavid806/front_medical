import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { useBalanceThirdParty } from "./hooks/useBalanceThirdParty.js";
import { ThirdPartyDropdown } from "../../fields/dropdowns/ThirdPartyDropdown.js";
import { AccountingAccountsRange } from "../../fields/ranges/AccountingAccountsRange.js";
export const BalanceThirdParty = () => {
  const [expandedRows, setExpandedRows] = useState(null);
  const {
    dateRange,
    setDateRange,
    thirdPartyId,
    setThirdPartyId,
    balanceThirdParty,
    loading,
    startAccount,
    endAccount,
    setStartAccount,
    setEndAccount
  } = useBalanceThirdParty();
  const formatCurrency = value => {
    return `$${value.toFixed(2)}`;
  };

  // Columnas para la tabla principal
  const mainColumns = [{
    field: 'tercero_nombre',
    header: 'Tercero',
    body: rowData => rowData.tercero_nombre || 'Sin tercero'
  }, {
    field: 'debe_total',
    header: 'Total Debe',
    body: rowData => formatCurrency(rowData.debe_total),
    style: {
      textAlign: 'right'
    }
  }, {
    field: 'haber_total',
    header: 'Total Haber',
    body: rowData => formatCurrency(rowData.haber_total),
    style: {
      textAlign: 'right'
    }
  }, {
    field: 'saldo_final',
    header: 'Saldo',
    body: rowData => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: 'right',
        fontWeight: 'bold',
        color: rowData.saldo_final < 0 ? '#e74c3c' : rowData.saldo_final > 0 ? '#27ae60' : '#000000'
      }
    }, formatCurrency(rowData.saldo_final)))
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Balance de Prueba por Tercero",
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2 mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
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
  })), /*#__PURE__*/React.createElement(ThirdPartyDropdown, {
    value: thirdPartyId,
    handleChange: e => setThirdPartyId(e.value)
  }), /*#__PURE__*/React.createElement(AccountingAccountsRange, {
    startValue: startAccount,
    endValue: endAccount,
    handleStartChange: e => setStartAccount(e.value),
    handleEndChange: e => setEndAccount(e.value)
  })), /*#__PURE__*/React.createElement(DataTable, {
    value: balanceThirdParty,
    expandedRows: expandedRows,
    onRowToggle: e => setExpandedRows(e.data),
    dataKey: "tercero_id",
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    stripedRows: true,
    className: "p-datatable-gridlines",
    emptyMessage: "No se encontraron movimientos",
    tableStyle: {
      minWidth: "100%"
    }
  }, mainColumns.map((col, i) => /*#__PURE__*/React.createElement(Column, {
    key: i,
    field: col.field,
    header: col.header,
    body: col.body,
    style: col.style,
    sortable: true
  })))));
};