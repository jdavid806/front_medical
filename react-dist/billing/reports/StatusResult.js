import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
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
  const exportToPdfSimpleReport = () => {
    generateStatusResultFormat(incomeStatementData, 'Impresion');
  };
  const exportToPdfComparativeReport = () => {
    generateComparativeStatusResultFormat(comparativeIncomeStatementData, 'Impresion');
  };
  const renderAccountTable = (accounts, title) => {
    return /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("h5", {
      className: "mb-3"
    }, title), /*#__PURE__*/React.createElement(DataTable, {
      value: accounts,
      className: "p-datatable-sm",
      showGridlines: true
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
    return /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("h5", {
      className: "mb-3"
    }, title, " (", period === 'current' ? 'Periodo Actual' : 'Periodo Anterior', ")"), /*#__PURE__*/React.createElement(DataTable, {
      value: accounts,
      className: "p-datatable-sm",
      showGridlines: true
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
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "row mb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-6"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Rango de fechas"), /*#__PURE__*/React.createElement(Calendar, {
      value: dateRange,
      onChange: e => setDateRange(e.value),
      selectionMode: "range",
      readOnlyInput: true,
      className: "w-100",
      placeholder: "Seleccione un rango de fechas"
    })), /*#__PURE__*/React.createElement("div", {
      className: "col-md-6 d-flex align-items-end"
    }, /*#__PURE__*/React.createElement(Button, {
      label: "Generar Reporte",
      icon: "pi pi-refresh",
      className: "btn btn-primary",
      onClick: fetchStatusResult
    }), /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-file-pdf"
      }),
      label: "Exportar a PDF",
      className: "mr-2",
      onClick: exportToPdfSimpleReport
    }))), /*#__PURE__*/React.createElement(Card, {
      title: `Estado de Resultados (${incomeStatementData.periodo.desde} al ${incomeStatementData.periodo.hasta})`
    }, /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("h5", null, "Resumen"), /*#__PURE__*/React.createElement("table", {
      className: "table table-bordered"
    }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Ingresos")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(incomeStatementData.resumen.ingresos))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Costos")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(incomeStatementData.resumen.costos))), /*#__PURE__*/React.createElement("tr", {
      className: "table-secondary"
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Utilidad Bruta")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(incomeStatementData.resumen.utilidad_bruta))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Gastos")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(incomeStatementData.resumen.gastos))), /*#__PURE__*/React.createElement("tr", {
      className: "table-success"
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Utilidad Neta")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(incomeStatementData.resumen.utilidad_neta)))))), /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("h5", null, "Detalles por Categor\xEDa"), /*#__PURE__*/React.createElement(DataTable, {
      value: incomeStatementData.detalles,
      className: "p-datatable-sm",
      showGridlines: true
    }, /*#__PURE__*/React.createElement(Column, {
      field: "categoria",
      header: "Categor\xEDa"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "total_creditos",
      header: "Total Cr\xE9ditos",
      body: rowData => formatCurrency(rowData.total_creditos),
      style: {
        textAlign: 'right',
        width: '150px'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "total_debitos",
      header: "Total D\xE9bitos",
      body: rowData => formatCurrency(rowData.total_debitos),
      style: {
        textAlign: 'right',
        width: '150px'
      }
    }))), renderAccountTable(incomeStatementData.cuentas, "Detalle de Cuentas")));
  };
  const renderComparativeReport = () => {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "row mb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-5"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Periodo Actual"), /*#__PURE__*/React.createElement(Calendar, {
      value: dateRangePeriodOne,
      onChange: e => setDateRangePeriodOne(e.value),
      selectionMode: "range",
      readOnlyInput: true,
      className: "w-100",
      placeholder: "Seleccione rango de fechas"
    })), /*#__PURE__*/React.createElement("div", {
      className: "col-md-5"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Periodo Anterior"), /*#__PURE__*/React.createElement(Calendar, {
      value: dateRangePeriodTwo,
      onChange: e => setDateRangePeriodTwo(e.value),
      selectionMode: "range",
      readOnlyInput: true,
      className: "w-100",
      placeholder: "Seleccione rango de fechas"
    })), /*#__PURE__*/React.createElement("div", {
      className: "col-md-12 d-flex align-items-end gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      label: "Comparar",
      icon: "pi pi-refresh",
      className: "btn btn-primary w-100",
      onClick: fetchComparativeStatusResult
    }), /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-file-pdf"
      }),
      label: "Exportar a PDF",
      className: "mr-2",
      onClick: exportToPdfComparativeReport
    }))), /*#__PURE__*/React.createElement(Card, {
      title: "Estado de Resultados Comparativo"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row mb-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card bg-light"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-body"
    }, /*#__PURE__*/React.createElement("h6", null, "Periodo Actual"), /*#__PURE__*/React.createElement("p", {
      className: "mb-0"
    }, comparativeIncomeStatementData.periodo.desde.current, " al ", comparativeIncomeStatementData.periodo.hasta.current)))), /*#__PURE__*/React.createElement("div", {
      className: "col-md-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card bg-light"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-body"
    }, /*#__PURE__*/React.createElement("h6", null, "Periodo Anterior"), /*#__PURE__*/React.createElement("p", {
      className: "mb-0"
    }, comparativeIncomeStatementData.periodo.desde.previous, " al ", comparativeIncomeStatementData.periodo.hasta.previous))))), /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("h5", null, "Resumen Comparativo"), /*#__PURE__*/React.createElement("table", {
      className: "table table-bordered"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Concepto"), /*#__PURE__*/React.createElement("th", {
      className: "text-end"
    }, "Periodo Actual"), /*#__PURE__*/React.createElement("th", {
      className: "text-end"
    }, "Periodo Anterior"), /*#__PURE__*/React.createElement("th", {
      className: "text-end"
    }, "Diferencia"), /*#__PURE__*/React.createElement("th", {
      className: "text-end"
    }, "% Cambio"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Ingresos")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeIncomeStatementData.resumen.ingresos.current)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeIncomeStatementData.resumen.ingresos.previous)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeIncomeStatementData.resumen.ingresos.difference)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatPercentage(comparativeIncomeStatementData.resumen.ingresos.percentage_change))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Costos")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeIncomeStatementData.resumen.costos.current)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeIncomeStatementData.resumen.costos.previous)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeIncomeStatementData.resumen.costos.difference)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatPercentage(comparativeIncomeStatementData.resumen.costos.percentage_change))), /*#__PURE__*/React.createElement("tr", {
      className: "table-secondary"
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Utilidad Bruta")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeIncomeStatementData.resumen.utilidad_bruta.current)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeIncomeStatementData.resumen.utilidad_bruta.previous)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeIncomeStatementData.resumen.utilidad_bruta.difference)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatPercentage(comparativeIncomeStatementData.resumen.utilidad_bruta.percentage_change))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Gastos")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeIncomeStatementData.resumen.gastos.current)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeIncomeStatementData.resumen.gastos.previous)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeIncomeStatementData.resumen.gastos.difference)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatPercentage(comparativeIncomeStatementData.resumen.gastos.percentage_change))), /*#__PURE__*/React.createElement("tr", {
      className: "table-success"
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Utilidad Neta")), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeIncomeStatementData.resumen.utilidad_neta.current)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeIncomeStatementData.resumen.utilidad_neta.previous)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(comparativeIncomeStatementData.resumen.utilidad_neta.difference)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatPercentage(comparativeIncomeStatementData.resumen.utilidad_neta.percentage_change)))))), /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("h5", null, "Detalles por Categor\xEDa - Periodo Actual"), /*#__PURE__*/React.createElement(DataTable, {
      value: comparativeIncomeStatementData.detalles.current,
      className: "p-datatable-sm",
      showGridlines: true
    }, /*#__PURE__*/React.createElement(Column, {
      field: "categoria",
      header: "Categor\xEDa"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "total_creditos",
      header: "Total Cr\xE9ditos",
      body: rowData => formatCurrency(rowData.total_creditos),
      style: {
        textAlign: 'right',
        width: '150px'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "total_debitos",
      header: "Total D\xE9bitos",
      body: rowData => formatCurrency(rowData.total_debitos),
      style: {
        textAlign: 'right',
        width: '150px'
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("h5", null, "Detalles por Categor\xEDa - Periodo Anterior"), /*#__PURE__*/React.createElement(DataTable, {
      value: comparativeIncomeStatementData.detalles.previous,
      className: "p-datatable-sm",
      showGridlines: true
    }, /*#__PURE__*/React.createElement(Column, {
      field: "categoria",
      header: "Categor\xEDa"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "total_creditos",
      header: "Total Cr\xE9ditos",
      body: rowData => formatCurrency(rowData.total_creditos),
      style: {
        textAlign: 'right',
        width: '150px'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "total_debitos",
      header: "Total D\xE9bitos",
      body: rowData => formatCurrency(rowData.total_debitos),
      style: {
        textAlign: 'right',
        width: '150px'
      }
    }))), renderComparativeAccountTable(comparativeIncomeStatementData.cuentas.current, "Detalle de Cuentas", 'current'), renderComparativeAccountTable(comparativeIncomeStatementData.cuentas.previous, "Detalle de Cuentas", 'previous')));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Reporte de Estados de Resultados"
  }, /*#__PURE__*/React.createElement(TabView, {
    activeIndex: activeIndex,
    onTabChange: e => setActiveIndex(e.index)
  }, /*#__PURE__*/React.createElement(TabPanel, {
    header: "Un Per\xEDodo"
  }, renderSimpleReport()), /*#__PURE__*/React.createElement(TabPanel, {
    header: "Comparativa"
  }, renderComparativeReport()))));
};