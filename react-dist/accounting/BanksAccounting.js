import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Calendar } from 'primereact/calendar';
import { useBankAccountingReport } from "./hooks/useBankAccountingReport.js";
export const BanksAccounting = () => {
  // Estado para los datos de la tabla
  const {
    metodosPago,
    fetchBankAccountingReport,
    loading
  } = useBankAccountingReport();
  const [expandedRows, setExpandedRows] = useState(null);

  // Estado para el filtro de fecha
  const [rangoFechas, setRangoFechas] = useState([new Date(), new Date()]);
  useEffect(() => {
    aplicarFiltros();
  }, [rangoFechas]);
  const aplicarFiltros = () => {
    if (!rangoFechas || !rangoFechas[0] || !rangoFechas[1]) return;
    fetchBankAccountingReport({
      from: rangoFechas[0].toISOString(),
      to: rangoFechas[1].toISOString()
    });
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setRangoFechas(null);
  };

  // Formatear número para montos monetarios
  const formatCurrency = value => {
    return value.toLocaleString('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Formatear fecha
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-DO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Template para el tipo de método de pago
  const tipoTemplate = rowData => {
    return /*#__PURE__*/React.createElement("span", {
      className: `badge ${rowData.tipo === 'sale' ? 'bg-success' : 'bg-warning'}`
    }, rowData.tipo === 'sale' ? 'Venta' : 'Compra');
  };

  // Template para indicar si es efectivo
  const efectivoTemplate = rowData => {
    return /*#__PURE__*/React.createElement("span", {
      className: `badge ${rowData.es_efectivo ? 'bg-primary' : 'bg-secondary'}`
    }, rowData.es_efectivo ? 'Sí' : 'No');
  };

  // Template para expandir/contraer filas
  const rowExpansionTemplate = data => {
    return /*#__PURE__*/React.createElement("div", {
      className: "p-3"
    }, /*#__PURE__*/React.createElement("h5", null, "Bancos"), /*#__PURE__*/React.createElement(DataTable, {
      value: data.movimientos,
      size: "small",
      responsiveLayout: "scroll",
      paginator: true,
      rows: 10,
      rowsPerPageOptions: [5, 10, 25]
    }, /*#__PURE__*/React.createElement(Column, {
      field: "fecha",
      header: "Fecha",
      body: rowData => formatDate(rowData.fecha),
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      field: "monto",
      header: "Monto",
      body: rowData => formatCurrency(parseFloat(rowData.monto)),
      style: {
        textAlign: 'right'
      },
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      field: "banco_o_tarjeta",
      header: "Banco/Tarjeta",
      body: rowData => rowData.banco_o_tarjeta || 'N/A'
    }), /*#__PURE__*/React.createElement(Column, {
      field: "nro_referencia",
      header: "N\xB0 Referencia",
      body: rowData => rowData.nro_referencia || 'N/A'
    }), /*#__PURE__*/React.createElement(Column, {
      field: "cuenta",
      header: "Cuenta",
      body: rowData => rowData.cuenta || 'N/A'
    }), /*#__PURE__*/React.createElement(Column, {
      field: "notas",
      header: "Notas",
      body: rowData => rowData.notas || 'N/A'
    })));
  };
  console.log(metodosPago);
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4",
    style: {
      padding: '0 15px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("h2", null, "Bancos")), /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de B\xFAsqueda",
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Rango de Fechas"), /*#__PURE__*/React.createElement(Calendar, {
    value: rangoFechas,
    onChange: e => setRangoFechas(e.value),
    selectionMode: "range",
    readOnlyInput: true,
    dateFormat: "dd/mm/yy",
    placeholder: "Seleccione rango de fechas",
    className: "w-100",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 d-flex align-items-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar",
    icon: "pi pi-trash",
    className: "btn btn-phoenix-secondary",
    onClick: limpiarFiltros
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Buscar",
    className: "btn btn-primary",
    icon: "pi pi-search",
    onClick: aplicarFiltros,
    loading: loading
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "M\xE9todos de Pago y Movimientos"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: metodosPago,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    emptyMessage: "No se encontraron m\xE9todos de pago",
    className: "p-datatable-striped p-datatable-gridlines",
    responsiveLayout: "scroll",
    expandedRows: expandedRows,
    onRowToggle: e => setExpandedRows(e.data),
    rowExpansionTemplate: rowExpansionTemplate,
    dataKey: "metodo_pago"
  }, /*#__PURE__*/React.createElement(Column, {
    expander: true,
    style: {
      width: '3em'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "metodo_pago",
    header: "M\xE9todo de Pago",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "tipo",
    header: "Tipo",
    body: tipoTemplate,
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "es_efectivo",
    header: "Es Efectivo",
    body: efectivoTemplate,
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "total",
    header: "Total",
    body: rowData => formatCurrency(rowData.total),
    style: {
      textAlign: 'right'
    },
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "movimientos",
    header: "N\xB0 Movimientos",
    body: rowData => rowData.movimientos.length,
    style: {
      textAlign: 'center'
    },
    sortable: true
  }))));
};