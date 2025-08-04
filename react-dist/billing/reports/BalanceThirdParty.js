import React, { useEffect, useState } from "react";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useGeneralJournal } from "./hooks/useGeneralJournal.js";
export const BalanceThirdParty = ({
  fetchData
}) => {
  const [dates, setDates] = useState(null);
  const [expandedRows, setExpandedRows] = useState(null);
  const [groupedData, setGroupedData] = useState([]);
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

  // Agrupa los datos por tercero
  const groupByThirdParty = data => {
    const grouped = {};
    data.forEach(item => {
      const tercero = item.tercero || 'Sin tercero';
      if (!grouped[tercero]) {
        grouped[tercero] = [];
      }
      grouped[tercero].push(item);
    });

    // Convertir el objeto agrupado en un array para la DataTable
    return Object.keys(grouped).map(tercero => ({
      tercero,
      totalDebe: grouped[tercero].reduce((sum, item) => sum + parseFloat(item.debe || 0), 0),
      totalHaber: grouped[tercero].reduce((sum, item) => sum + parseFloat(item.haber || 0), 0),
      items: grouped[tercero]
    }));
  };
  useEffect(() => {
    if (generalJournal) {
      setGroupedData(groupByThirdParty(generalJournal));
    }
  }, [generalJournal]);

  // Columnas para la tabla principal (agrupada por tercero)
  const mainColumns = [{
    field: 'tercero',
    header: 'Tercero',
    body: rowData => rowData.tercero || 'Sin tercero'
  }, {
    field: 'totalDebe',
    header: 'Total Debe',
    body: rowData => formatCurrency(rowData.totalDebe.toString()),
    style: {
      textAlign: 'right'
    }
  }, {
    field: 'totalHaber',
    header: 'Total Haber',
    body: rowData => formatCurrency(rowData.totalHaber.toString()),
    style: {
      textAlign: 'right'
    }
  }, {
    field: 'saldo',
    header: 'Saldo',
    body: rowData => {
      const saldo = rowData.totalDebe - rowData.totalHaber;
      return formatCurrency(saldo.toString());
    },
    style: {
      textAlign: 'right',
      fontWeight: 'bold'
    }
  }];

  // Columnas para la tabla expandida (detalle por asiento)
  const detailColumns = [{
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
  }];

  // Plantilla para la expansión de filas
  const rowExpansionTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "p-3"
    }, /*#__PURE__*/React.createElement(DataTable, {
      value: rowData.items,
      className: "p-datatable-gridlines",
      tableStyle: {
        minWidth: '100%'
      }
    }, detailColumns.map((col, i) => /*#__PURE__*/React.createElement(Column, {
      key: i,
      field: col.field,
      header: col.header,
      body: col.body,
      style: col.style,
      sortable: true
    }))));
  };
  const expandAll = () => {
    const expanded = {};
    groupedData.forEach(item => {
      expanded[item.tercero] = true;
    });
    setExpandedRows(expanded);
  };
  const collapseAll = () => {
    setExpandedRows(null);
  };
  const header = /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-plus",
    label: "Expandir Todo",
    onClick: expandAll,
    text: true
  }), /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-minus",
    label: "Colapsar Todo",
    onClick: collapseAll,
    text: true
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Balance de Prueba por Tercero",
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
  }))), /*#__PURE__*/React.createElement(DataTable, {
    value: groupedData,
    expandedRows: expandedRows,
    onRowToggle: e => setExpandedRows(e.data),
    rowExpansionTemplate: rowExpansionTemplate,
    dataKey: "tercero",
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    stripedRows: true,
    className: "p-datatable-gridlines",
    emptyMessage: "No se encontraron movimientos",
    tableStyle: {
      minWidth: "100%"
    },
    header: header
  }, /*#__PURE__*/React.createElement(Column, {
    expander: true,
    style: {
      width: '3rem'
    }
  }), mainColumns.map((col, i) => /*#__PURE__*/React.createElement(Column, {
    key: i,
    field: col.field,
    header: col.header,
    body: col.body,
    style: col.style,
    sortable: true
  })))));
};