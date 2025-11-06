import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Calendar } from 'primereact/calendar';
import { useAuxiliaryMovementReport } from "./hooks/useAuxiliaryMovementReport.js";
export const AuxiliaryMovement = () => {
  // Estado para los datos de la tabla
  const {
    cuentasContables,
    fetchAuxiliaryMovementReport,
    loading
  } = useAuxiliaryMovementReport();
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [totalSaldoFinal, setTotalSaldoFinal] = useState(0);
  const [expandedRows, setExpandedRows] = useState(null);

  // Estado para el filtro de fecha
  const [rangoFechas, setRangoFechas] = useState([new Date(), new Date()]);
  useEffect(() => {
    aplicarFiltros();
  }, [rangoFechas]);

  // Cargar datos mockeados
  useEffect(() => {
    calcularTotales(cuentasContables);
  }, [cuentasContables]);
  const calcularTotales = datos => {
    let totalReg = 0;
    let totalSaldo = 0;
    datos.forEach(cuenta => {
      totalReg += cuenta.movimientos.length;
      totalSaldo += cuenta.saldo_final;
    });
    setTotalRegistros(totalReg);
    setTotalSaldoFinal(totalSaldo);
  };
  const aplicarFiltros = () => {
    if (!rangoFechas || !rangoFechas[0] || !rangoFechas[1]) return;
    fetchAuxiliaryMovementReport({
      from: rangoFechas[0].toISOString(),
      to: rangoFechas[1].toISOString()
    });
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setRangoFechas(null);
  };

  // Formatear número para saldos monetarios
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

  // Template para expandir/contraer filas
  const rowExpansionTemplate = data => {
    return /*#__PURE__*/React.createElement("div", {
      className: "p-3"
    }, /*#__PURE__*/React.createElement("h5", null, "Movimientos de la cuenta ", data.cuenta, " - ", data.nombre), /*#__PURE__*/React.createElement(DataTable, {
      value: data.movimientos,
      size: "small",
      responsiveLayout: "scroll"
    }, /*#__PURE__*/React.createElement(Column, {
      field: "fecha",
      header: "Fecha",
      body: rowData => formatDate(rowData.fecha)
    }), /*#__PURE__*/React.createElement(Column, {
      field: "asiento",
      header: "Asiento"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "descripcion",
      header: "Descripci\xF3n"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "tercero",
      header: "Tercero"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "debit",
      header: "D\xE9bito",
      body: rowData => formatCurrency(parseFloat(rowData.debit)),
      style: {
        textAlign: 'right'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "credit",
      header: "Cr\xE9dito",
      body: rowData => formatCurrency(rowData.credit),
      style: {
        textAlign: 'right'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "saldo",
      header: "Saldo",
      body: rowData => formatCurrency(rowData.saldo),
      style: {
        textAlign: 'right'
      }
    })));
  };

  // Footer para los totales
  const footerTotales = /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("strong", null, "Total Movimientos:"), " ", totalRegistros), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("strong", null, "Total Saldo Final:"), /*#__PURE__*/React.createElement("span", {
    className: "text-primary cursor-pointer ml-2"
  }, formatCurrency(totalSaldoFinal))));
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4",
    style: {
      padding: '0 15px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("h2", null, "Movimiento Auxiliar x Cuenta Contable")), /*#__PURE__*/React.createElement(Card, {
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
    title: "Cuentas Contables y Movimientos"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: cuentasContables,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    emptyMessage: "No se encontraron cuentas contables",
    className: "p-datatable-striped p-datatable-gridlines",
    responsiveLayout: "scroll",
    footer: footerTotales,
    expandedRows: expandedRows,
    onRowToggle: e => setExpandedRows(e.data),
    rowExpansionTemplate: rowExpansionTemplate,
    dataKey: "cuenta"
  }, /*#__PURE__*/React.createElement(Column, {
    expander: true,
    style: {
      width: '3em'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "cuenta",
    header: "C\xF3digo Cuenta",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "nombre",
    header: "Nombre Cuenta",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "saldo_inicial",
    header: "Saldo Inicial",
    body: rowData => formatCurrency(parseFloat(rowData.saldo_inicial)),
    style: {
      textAlign: 'right'
    },
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "saldo_final",
    header: "Saldo Final",
    body: rowData => formatCurrency(rowData.saldo_final),
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