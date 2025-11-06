import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { useStatusResult } from "./hooks/useStatusResult.js";
import { useComparativeStatusResult } from "./hooks/useComparativeStatusResult.js";
import { useStatusResultFormat } from "../../documents-generation/hooks/useStatusResultFormat.js";
import { useComparativeStatusResultFormat } from "../../documents-generation/hooks/useComparativeStatusResultFormat.js";
export const StatusResult = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const {
    dateRange,
    setDateRange,
    statusResult: incomeStatementData,
    fetchStatusResult
  } = useStatusResult();
  const {
    dateRangePeriodOne,
    setDateRangePeriodOne,
    dateRangePeriodTwo,
    setDateRangePeriodTwo,
    comparativeStatusResult: comparativeIncomeStatementData,
    fetchComparativeStatusResult
  } = useComparativeStatusResult();
  const {
    generateStatusResultFormat
  } = useStatusResultFormat();
  const {
    generateComparativeStatusResultFormat
  } = useComparativeStatusResultFormat();
  const formatCurrency = value => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numValue);
  };
  const formatPercentage = value => {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('es-DO', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };
  const getPercentageColor = value => {
    if (value === null) return 'secondary';
    return value > 0 ? 'success' : value < 0 ? 'danger' : 'info';
  };
  const exportToPdfSimpleReport = () => {
    generateStatusResultFormat(incomeStatementData, 'Impresion');
  };
  const exportToPdfComparativeReport = () => {
    generateComparativeStatusResultFormat(comparativeIncomeStatementData, 'Impresion');
  };
  const renderAccountTable = (accounts, title) => {
    return /*#__PURE__*/React.createElement(Panel, {
      header: title,
      toggleable: true,
      className: "mb-4"
    }, /*#__PURE__*/React.createElement(DataTable, {
      value: accounts,
      className: "p-datatable-sm",
      showGridlines: true,
      paginator: true,
      rows: 10,
      paginatorTemplate: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",
      currentPageReportTemplate: "Mostrando {first} a {last} de {totalRecords} cuentas"
    }, /*#__PURE__*/React.createElement(Column, {
      field: "codigo",
      header: "C\xF3digo",
      style: {
        width: '120px'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "nombre",
      header: "Cuenta"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "total_creditos",
      header: "Cr\xE9ditos",
      body: rowData => formatCurrency(rowData.total_creditos),
      style: {
        textAlign: 'right',
        width: '150px'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "total_debitos",
      header: "D\xE9bitos",
      body: rowData => formatCurrency(rowData.total_debitos),
      style: {
        textAlign: 'right',
        width: '150px'
      }
    })));
  };
  const renderComparativeAccountTable = (accounts, title, period) => {
    return /*#__PURE__*/React.createElement(Panel, {
      header: `${title} (${period === 'current' ? 'Periodo Actual' : 'Periodo Anterior'})`,
      toggleable: true,
      className: "mb-4"
    }, /*#__PURE__*/React.createElement(DataTable, {
      value: accounts,
      className: "p-datatable-sm",
      showGridlines: true,
      paginator: true,
      rows: 10,
      paginatorTemplate: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",
      currentPageReportTemplate: "Mostrando {first} a {last} de {totalRecords} cuentas"
    }, /*#__PURE__*/React.createElement(Column, {
      field: "codigo",
      header: "C\xF3digo",
      style: {
        width: '100px'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "nombre",
      header: "Cuenta",
      style: {
        width: '200px'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "total_creditos",
      header: "Cr\xE9ditos",
      body: rowData => formatCurrency(rowData.total_creditos),
      style: {
        textAlign: 'right',
        width: '150px'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "total_debitos",
      header: "D\xE9bitos",
      body: rowData => formatCurrency(rowData.total_debitos),
      style: {
        textAlign: 'right',
        width: '150px'
      }
    })));
  };
  const renderSimpleReport = () => {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Card, {
      className: "mb-4 shadow-sm"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row g-3 align-items-end"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-6"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label fw-semibold"
    }, "Rango de Fechas"), /*#__PURE__*/React.createElement(Calendar, {
      value: dateRange,
      onChange: e => setDateRange(e.value),
      selectionMode: "range",
      readOnlyInput: true,
      className: "w-100",
      placeholder: "Seleccione un rango de fechas",
      showIcon: true
    })), /*#__PURE__*/React.createElement("div", {
      className: "col-md-6 d-flex gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      label: "Generar Reporte",
      className: " p-btn-primary flex-grow-1",
      onClick: fetchStatusResult
    }, " ", /*#__PURE__*/React.createElement("i", {
      className: "fa fa-refresh",
      "aria-hidden": "true"
    })), /*#__PURE__*/React.createElement(Button, {
      icon: "pi pi-file-pdf",
      label: "Exportar PDF",
      className: "p-button-danger flex-grow-1",
      onClick: exportToPdfSimpleReport
    })))), /*#__PURE__*/React.createElement(Card, {
      title: /*#__PURE__*/React.createElement("div", {
        className: "d-flex justify-content-between align-items-center"
      }, /*#__PURE__*/React.createElement("span", null, "Estado de Resultados"), /*#__PURE__*/React.createElement(Badge, {
        value: `${incomeStatementData.periodo.desde} al ${incomeStatementData.periodo.hasta}`,
        className: "p-2"
      })),
      className: "shadow-sm"
    }, /*#__PURE__*/React.createElement(Panel, {
      header: "Resumen Ejecutivo",
      toggleable: true,
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row g-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card border-0 bg-light-success"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-body text-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-arrow-up-right text-success mb-2",
      style: {
        fontSize: '1.5rem'
      }
    }), /*#__PURE__*/React.createElement("h5", {
      className: "text-success"
    }, formatCurrency(incomeStatementData.resumen.ingresos)), /*#__PURE__*/React.createElement("small", {
      className: "text-muted"
    }, "Ingresos Totales")))), /*#__PURE__*/React.createElement("div", {
      className: "col-md-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card border-0 bg-light-warning"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-body text-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-chart-line text-warning mb-2",
      style: {
        fontSize: '1.5rem'
      }
    }), /*#__PURE__*/React.createElement("h5", {
      className: "text-warning"
    }, formatCurrency(incomeStatementData.resumen.utilidad_bruta)), /*#__PURE__*/React.createElement("small", {
      className: "text-muted"
    }, "Utilidad Bruta")))), /*#__PURE__*/React.createElement("div", {
      className: "col-md-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card border-0 bg-light-primary"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-body text-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-dollar text-primary mb-2",
      style: {
        fontSize: '1.5rem'
      }
    }), /*#__PURE__*/React.createElement("h5", {
      className: "text-primary"
    }, formatCurrency(incomeStatementData.resumen.utilidad_neta)), /*#__PURE__*/React.createElement("small", {
      className: "text-muted"
    }, "Utilidad Neta"))))), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("table", {
      className: "table table-hover"
    }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
      className: "fw-semibold"
    }, "Ingresos"), /*#__PURE__*/React.createElement("td", {
      className: "text-end text-success fw-bold"
    }, formatCurrency(incomeStatementData.resumen.ingresos))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
      className: "fw-semibold"
    }, "Costos"), /*#__PURE__*/React.createElement("td", {
      className: "text-end text-danger fw-bold"
    }, formatCurrency(incomeStatementData.resumen.costos))), /*#__PURE__*/React.createElement("tr", {
      className: "table-active"
    }, /*#__PURE__*/React.createElement("td", {
      className: "fw-bold"
    }, "Utilidad Bruta"), /*#__PURE__*/React.createElement("td", {
      className: "text-end fw-bold"
    }, formatCurrency(incomeStatementData.resumen.utilidad_bruta))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
      className: "fw-semibold"
    }, "Gastos"), /*#__PURE__*/React.createElement("td", {
      className: "text-end text-warning fw-bold"
    }, formatCurrency(incomeStatementData.resumen.gastos))), /*#__PURE__*/React.createElement("tr", {
      className: "table-success"
    }, /*#__PURE__*/React.createElement("td", {
      className: "fw-bold"
    }, "Utilidad Neta"), /*#__PURE__*/React.createElement("td", {
      className: "text-end fw-bold"
    }, formatCurrency(incomeStatementData.resumen.utilidad_neta)))))), /*#__PURE__*/React.createElement(Panel, {
      header: "Detalles por Categor\xEDa",
      toggleable: true,
      className: "mb-4"
    }, /*#__PURE__*/React.createElement(DataTable, {
      value: incomeStatementData.detalles,
      className: "p-datatable-sm",
      showGridlines: true,
      paginator: true,
      rows: 5
    }, /*#__PURE__*/React.createElement(Column, {
      field: "categoria",
      header: "Categor\xEDa"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "total_creditos",
      header: "Total Cr\xE9ditos",
      body: rowData => formatCurrency(rowData.total_creditos),
      style: {
        textAlign: 'right'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "total_debitos",
      header: "Total D\xE9bitos",
      body: rowData => formatCurrency(rowData.total_debitos),
      style: {
        textAlign: 'right'
      }
    }))), renderAccountTable(incomeStatementData.cuentas, "Detalle de Cuentas")));
  };
  const renderComparativeReport = () => {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Card, {
      className: "mb-4 shadow-sm"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row g-3 align-items-end"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-4"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label fw-semibold"
    }, "Periodo Actual"), /*#__PURE__*/React.createElement(Calendar, {
      value: dateRangePeriodOne,
      onChange: e => setDateRangePeriodOne(e.value),
      selectionMode: "range",
      readOnlyInput: true,
      className: "w-100",
      placeholder: "Seleccione rango de fechas",
      showIcon: true
    })), /*#__PURE__*/React.createElement("div", {
      className: "col-md-4"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label fw-semibold"
    }, "Periodo Anterior"), /*#__PURE__*/React.createElement(Calendar, {
      value: dateRangePeriodTwo,
      onChange: e => setDateRangePeriodTwo(e.value),
      selectionMode: "range",
      readOnlyInput: true,
      className: "w-100",
      placeholder: "Seleccione rango de fechas",
      showIcon: true
    })), /*#__PURE__*/React.createElement("div", {
      className: "col-md-4 d-flex gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      label: "Comparar",
      className: "p-btn-primary w-100",
      onClick: fetchComparativeStatusResult
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa fa-refresh me-2"
    })), /*#__PURE__*/React.createElement(Button, {
      label: "Exportar PDF",
      className: "p-button-danger w-100",
      onClick: exportToPdfComparativeReport
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-file-pdf"
    }))))), /*#__PURE__*/React.createElement(Card, {
      title: "Estado de Resultados Comparativo",
      className: "shadow-sm"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row mb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card bg-primary text-white"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-calendar mr-3",
      style: {
        fontSize: '2rem'
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h6", {
      className: "mb-1 text-white font-medium"
    }, "Periodo Actual"), /*#__PURE__*/React.createElement("p", {
      className: "mb-0 fw-bold"
    }, comparativeIncomeStatementData.periodo.desde.current, " al ", comparativeIncomeStatementData.periodo.hasta.current)))))), /*#__PURE__*/React.createElement("div", {
      className: "col-md-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card bg-secondary text-white"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-calendar-times mr-3",
      style: {
        fontSize: '2rem'
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h6", {
      className: "mb-1 text-white font-medium  "
    }, "Periodo Anterior"), /*#__PURE__*/React.createElement("p", {
      className: "mb-0 fw-bold"
    }, comparativeIncomeStatementData.periodo.desde.previous, " al ", comparativeIncomeStatementData.periodo.hasta.previous))))))), /*#__PURE__*/React.createElement(Panel, {
      header: "Resumen Comparativo",
      toggleable: true,
      className: "mb-4"
    }, /*#__PURE__*/React.createElement(DataTable, {
      value: [{
        concepto: 'Ingresos',
        ...comparativeIncomeStatementData.resumen.ingresos
      }, {
        concepto: 'Costos',
        ...comparativeIncomeStatementData.resumen.costos
      }, {
        concepto: 'Utilidad Bruta',
        ...comparativeIncomeStatementData.resumen.utilidad_bruta
      }, {
        concepto: 'Gastos',
        ...comparativeIncomeStatementData.resumen.gastos
      }, {
        concepto: 'Utilidad Neta',
        ...comparativeIncomeStatementData.resumen.utilidad_neta
      }],
      className: "p-datatable-sm",
      showGridlines: true
    }, /*#__PURE__*/React.createElement(Column, {
      field: "concepto",
      header: "Concepto"
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Periodo Actual",
      body: rowData => formatCurrency(rowData.current),
      style: {
        textAlign: 'right'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Periodo Anterior",
      body: rowData => formatCurrency(rowData.previous),
      style: {
        textAlign: 'right'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Diferencia",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        className: `fw-bold ${rowData.difference > 0 ? 'text-success' : rowData.difference < 0 ? 'text-danger' : 'text-muted'}`
      }, formatCurrency(rowData.difference)),
      style: {
        textAlign: 'right'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      header: "% Cambio",
      body: rowData => /*#__PURE__*/React.createElement(Badge, {
        value: formatPercentage(rowData.percentage_change),
        severity: getPercentageColor(rowData.percentage_change)
      }),
      style: {
        textAlign: 'center'
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-6"
    }, /*#__PURE__*/React.createElement(Panel, {
      header: "Detalles - Periodo Actual",
      toggleable: true,
      className: "h-100"
    }, /*#__PURE__*/React.createElement(DataTable, {
      value: comparativeIncomeStatementData.detalles.current,
      className: "p-datatable-sm",
      showGridlines: true,
      paginator: true,
      rows: 5
    }, /*#__PURE__*/React.createElement(Column, {
      field: "categoria",
      header: "Categor\xEDa"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "total_creditos",
      header: "Cr\xE9ditos",
      body: rowData => formatCurrency(rowData.total_creditos),
      style: {
        textAlign: 'right'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "total_debitos",
      header: "D\xE9bitos",
      body: rowData => formatCurrency(rowData.total_debitos),
      style: {
        textAlign: 'right'
      }
    })))), /*#__PURE__*/React.createElement("div", {
      className: "col-md-6"
    }, /*#__PURE__*/React.createElement(Panel, {
      header: "Detalles - Periodo Anterior",
      toggleable: true,
      className: "h-100"
    }, /*#__PURE__*/React.createElement(DataTable, {
      value: comparativeIncomeStatementData.detalles.previous,
      className: "p-datatable-sm",
      showGridlines: true,
      paginator: true,
      rows: 5
    }, /*#__PURE__*/React.createElement(Column, {
      field: "categoria",
      header: "Categor\xEDa"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "total_creditos",
      header: "Cr\xE9ditos",
      body: rowData => formatCurrency(rowData.total_creditos),
      style: {
        textAlign: 'right'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "total_debitos",
      header: "D\xE9bitos",
      body: rowData => formatCurrency(rowData.total_debitos),
      style: {
        textAlign: 'right'
      }
    }))))), renderComparativeAccountTable(comparativeIncomeStatementData.cuentas.current, "Detalle de Cuentas", 'current'), renderComparativeAccountTable(comparativeIncomeStatementData.cuentas.previous, "Detalle de Cuentas", 'previous')));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4"
  }, /*#__PURE__*/React.createElement(Card, {
    title: /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-chart-line mr-3 text-primary",
      style: {
        fontSize: '1.5rem'
      }
    }), /*#__PURE__*/React.createElement("span", null, "Reporte de Estados de Resultados")),
    className: "shadow border-0"
  }, /*#__PURE__*/React.createElement(TabView, {
    activeIndex: activeIndex,
    onTabChange: e => setActiveIndex(e.index),
    panelContainerClassName: "p-3"
  }, /*#__PURE__*/React.createElement(TabPanel, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-chart-bar mr-2"
    }), /*#__PURE__*/React.createElement("span", null, "Reporte Simple"))
  }, renderSimpleReport()), /*#__PURE__*/React.createElement(TabPanel, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-chart-line mr-2"
    }), /*#__PURE__*/React.createElement("span", null, "An\xE1lisis Comparativo"))
  }, renderComparativeReport()))));
};