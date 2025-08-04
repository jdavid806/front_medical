import React from "react";
export const ComparativeStatusResultFormat = ({
  comparativeIncomeStatementData
}) => {
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
  const renderComparativeAccountTable = (accounts, title, period) => {
    return /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("h5", {
      className: "mb-3"
    }, title, " (", period === 'current' ? 'Periodo Actual' : 'Periodo Anterior', ")"), /*#__PURE__*/React.createElement("table", {
      className: "table table-bordered"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "C\xF3digo"), /*#__PURE__*/React.createElement("th", null, "Cuenta"), /*#__PURE__*/React.createElement("th", null, "Cr\xE9ditos"), /*#__PURE__*/React.createElement("th", null, "D\xE9bitos"))), /*#__PURE__*/React.createElement("tbody", null, accounts.map(account => /*#__PURE__*/React.createElement("tr", {
      key: account.codigo
    }, /*#__PURE__*/React.createElement("td", null, account.codigo), /*#__PURE__*/React.createElement("td", null, account.nombre), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: 'right'
      }
    }, formatCurrency(account.total_creditos)), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: 'right'
      }
    }, formatCurrency(account.total_debitos)))))));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Estado de Resultados Comparativo"), /*#__PURE__*/React.createElement("table", {
    className: "table table-bordered",
    style: {
      width: '100%',
      marginBottom: '1rem'
    }
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      width: '50%',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("h4", null, "Periodo Actual"), /*#__PURE__*/React.createElement("p", {
    className: "mb-0"
  }, comparativeIncomeStatementData.periodo.desde.current, " al ", comparativeIncomeStatementData.periodo.hasta.current)), /*#__PURE__*/React.createElement("th", {
    style: {
      width: '50%',
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("h4", null, "Periodo Anterior"), comparativeIncomeStatementData.periodo.desde.previous, " al ", comparativeIncomeStatementData.periodo.hasta.previous)))), /*#__PURE__*/React.createElement("div", {
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
  }, /*#__PURE__*/React.createElement("h5", null, "Detalles por Categor\xEDa - Periodo Actual"), /*#__PURE__*/React.createElement("table", {
    className: "table table-bordered"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    scope: "col"
  }, "Categor\xEDa"), /*#__PURE__*/React.createElement("th", {
    scope: "col"
  }, "Total Cr\xE9ditos"), /*#__PURE__*/React.createElement("th", {
    scope: "col"
  }, "Total D\xE9bitos"))), /*#__PURE__*/React.createElement("tbody", null, comparativeIncomeStatementData.detalles.current.map(row => /*#__PURE__*/React.createElement("tr", {
    key: row.categoria
  }, /*#__PURE__*/React.createElement("td", null, row.categoria), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(row.total_creditos)), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(row.total_debitos))))))), /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("h5", null, "Detalles por Categor\xEDa - Periodo Anterior"), /*#__PURE__*/React.createElement("table", {
    className: "table table-bordered"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    scope: "col"
  }, "Categor\xEDa"), /*#__PURE__*/React.createElement("th", {
    scope: "col"
  }, "Total Cr\xE9ditos"), /*#__PURE__*/React.createElement("th", {
    scope: "col"
  }, "Total D\xE9bitos"))), /*#__PURE__*/React.createElement("tbody", null, comparativeIncomeStatementData.detalles.previous.map(row => /*#__PURE__*/React.createElement("tr", {
    key: row.categoria
  }, /*#__PURE__*/React.createElement("td", null, row.categoria), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(row.total_creditos)), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(row.total_debitos))))))), renderComparativeAccountTable(comparativeIncomeStatementData.cuentas.current, "Detalle de Cuentas", 'current'), renderComparativeAccountTable(comparativeIncomeStatementData.cuentas.previous, "Detalle de Cuentas", 'previous')), /*#__PURE__*/React.createElement("style", null, `
            body {
                margin: 0;
                padding: 0;
                color: #000;
                background: #fff;
            }

            .no-print {
                display: none !important;
            }

            .table {
                width: 100%;
                font-size: 12px;
                border-collapse: collapse;
            }

            .table td, .table th {
                border: 1px solid #ccc !important;
                padding: 4px 8px !important;
            }

            .table-secondary {
                background-color: #eaeaea !important;
            }

            .text-end {
                text-align: right !important;
            }
        `));
};