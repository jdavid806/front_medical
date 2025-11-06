import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useBalanceAccountingAccount } from "./hooks/useBalanceAccountingAccount.js";
import { formatDateRange, formatPrice } from "../../../services/utilidades.js";
import { useBalanceAccountingAccountFormat } from "../../documents-generation/hooks/useBalanceAccountingAccountFormat.js";
import { AccountingAccountsDropdown } from "../../fields/dropdowns/AccountingAccountsDropdown.js";
export const BalanceAccountingAccount = () => {
  const [expandedRows, setExpandedRows] = useState(null);
  const {
    dateRange,
    setDateRange,
    accountId,
    setAccountId,
    balanceAccountingAccount,
    loading
  } = useBalanceAccountingAccount();
  const {
    generarFormatoBalanceAccountingAccount
  } = useBalanceAccountingAccountFormat();

  // Columnas para la tabla principal
  const mainColumns = [{
    field: 'cuenta_codigo',
    header: 'Código',
    body: rowData => rowData.cuenta_codigo || 'Sin código'
  }, {
    field: 'cuenta_nombre',
    header: 'Nombre de Cuenta',
    body: rowData => rowData.cuenta_nombre || 'Sin nombre'
  }, {
    field: 'saldo_inicial',
    header: 'Saldo Inicial',
    body: rowData => formatPrice(rowData.saldo_inicial),
    style: {
      textAlign: 'right'
    }
  }, {
    field: 'debe_total',
    header: 'Total Débito',
    body: rowData => formatPrice(rowData.debe_total),
    style: {
      textAlign: 'right'
    }
  }, {
    field: 'haber_total',
    header: 'Total Crédito',
    body: rowData => formatPrice(rowData.haber_total),
    style: {
      textAlign: 'right'
    }
  }, {
    field: 'saldo_final',
    header: 'Saldo Final',
    body: rowData => /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: 'right',
        fontWeight: 'bold',
        color: rowData.saldo_final < 0 ? '#e74c3c' : rowData.saldo_final > 0 ? '#27ae60' : '#000000'
      }
    }, formatPrice(rowData.saldo_final))
  }];
  const exportToPdfComparativeReport = () => {
    generarFormatoBalanceAccountingAccount(balanceAccountingAccount, formatDateRange(dateRange), 'Impresion');
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2 align-items-center"
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
  })), /*#__PURE__*/React.createElement(AccountingAccountsDropdown, {
    value: accountId,
    handleChange: e => setAccountId(e.value)
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-file-pdf"
    }),
    label: "Exportar a PDF",
    className: "mr-2",
    onClick: exportToPdfComparativeReport
  }))), /*#__PURE__*/React.createElement(DataTable, {
    value: balanceAccountingAccount,
    expandedRows: expandedRows,
    onRowToggle: e => setExpandedRows(e.data),
    dataKey: "cuenta_id",
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