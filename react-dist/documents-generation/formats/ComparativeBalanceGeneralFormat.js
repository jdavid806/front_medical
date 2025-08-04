import React from "react";
export const ComparativeBalanceGeneralFormat = ({
  comparativeBalanceSheetData
}) => {
  const formatCurrency = value => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  const filterAccountsByType = accounts => {
    return accounts.filter(account => account.account_code.startsWith('1') || account.account_code.startsWith('2') || account.account_code.startsWith('3'));
  };
  const renderComparativeAccountTable = (accounts, title) => {
    return /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("h5", {
      className: "mb-3"
    }, title), /*#__PURE__*/React.createElement("table", {
      className: "table table-bordered"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      style: {
        width: '100px'
      }
    }, "C\xF3digo"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '200px'
      }
    }, "Cuenta"), /*#__PURE__*/React.createElement("th", {
      style: {
        textAlign: 'right',
        width: '100px'
      }
    }, "Periodo 1"), /*#__PURE__*/React.createElement("th", {
      style: {
        textAlign: 'right',
        width: '100px'
      }
    }, "Periodo 2"), /*#__PURE__*/React.createElement("th", {
      style: {
        textAlign: 'right',
        width: '100px'
      }
    }, "Diferencia"))), /*#__PURE__*/React.createElement("tbody", null, filterAccountsByType(accounts).map((rowData, index) => /*#__PURE__*/React.createElement("tr", {
      key: index
    }, /*#__PURE__*/React.createElement("td", null, rowData.account_code), /*#__PURE__*/React.createElement("td", null, rowData.account_name), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: 'right'
      }
    }, formatCurrency(rowData.balance_period_1)), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: 'right'
      }
    }, formatCurrency(rowData.balance_period_2)), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: 'right'
      }
    }, formatCurrency(rowData.difference)))))));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("table", {
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
  }, /*#__PURE__*/React.createElement("h4", null, "Periodo 1"), /*#__PURE__*/React.createElement("p", {
    className: "mb-0"
  }, comparativeBalanceSheetData.period_1)), /*#__PURE__*/React.createElement("th", {
    style: {
      width: '50%',
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("h4", null, "Periodo 2"), /*#__PURE__*/React.createElement("p", {
    className: "mb-0"
  }, comparativeBalanceSheetData.period_2))))), renderComparativeAccountTable(comparativeBalanceSheetData.comparison.assets, "Activos"), renderComparativeAccountTable(comparativeBalanceSheetData.comparison.liabilities, "Pasivos"), renderComparativeAccountTable(comparativeBalanceSheetData.comparison.equity, "Patrimonio"), /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement("h5", null, "Totales Comparativos"), /*#__PURE__*/React.createElement("table", {
    className: "table table-bordered"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Cuenta"), /*#__PURE__*/React.createElement("th", {
    className: "text-end"
  }, "Periodo 1"), /*#__PURE__*/React.createElement("th", {
    className: "text-end"
  }, "Periodo 2"), /*#__PURE__*/React.createElement("th", {
    className: "text-end"
  }, "Diferencia"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Activos")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(comparativeBalanceSheetData.totals_comparison.assets.total_period_1)), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(comparativeBalanceSheetData.totals_comparison.assets.total_period_2)), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(comparativeBalanceSheetData.totals_comparison.assets.difference))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Pasivos")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(comparativeBalanceSheetData.totals_comparison.liabilities.total_period_1)), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(comparativeBalanceSheetData.totals_comparison.liabilities.total_period_2)), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(comparativeBalanceSheetData.totals_comparison.liabilities.difference))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Patrimonio")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(comparativeBalanceSheetData.totals_comparison.equity.total_period_1)), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(comparativeBalanceSheetData.totals_comparison.equity.total_period_2)), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(comparativeBalanceSheetData.totals_comparison.equity.difference))), /*#__PURE__*/React.createElement("tr", {
    className: "table-secondary"
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Resultado del Ejercicio")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(comparativeBalanceSheetData.summary.result_comparison.period_1)), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(comparativeBalanceSheetData.summary.result_comparison.period_2)), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(comparativeBalanceSheetData.summary.result_comparison.difference)))))), /*#__PURE__*/React.createElement("style", null, `
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