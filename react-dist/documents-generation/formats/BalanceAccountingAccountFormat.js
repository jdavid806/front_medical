import React from "react";
export const BalanceAccountingAccountFormat = ({
  balanceData,
  dateRange
}) => {
  const formatCurrency = value => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  const renderBalanceTable = () => {
    return /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("table", {
      className: "table table-bordered"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      style: {
        width: '75px'
      }
    }, "C\xF3digo"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '150px'
      }
    }, "Nombre de Cuenta"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '100px',
        textAlign: 'right'
      }
    }, "Saldo Inicial"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '100px',
        textAlign: 'right'
      }
    }, "Total D\xE9bito"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '100px',
        textAlign: 'right'
      }
    }, "Total Cr\xE9dito"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '100px',
        textAlign: 'right'
      }
    }, "Saldo Final"))), /*#__PURE__*/React.createElement("tbody", null, balanceData.map(account => /*#__PURE__*/React.createElement("tr", {
      key: account.cuenta_id
    }, /*#__PURE__*/React.createElement("td", null, account.cuenta_codigo || 'Sin código'), /*#__PURE__*/React.createElement("td", null, account.cuenta_nombre || 'Sin nombre'), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(+account.saldo_inicial)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(account.debe_total)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(account.haber_total)), /*#__PURE__*/React.createElement("td", {
      className: "text-end",
      style: {
        fontWeight: 'bold',
        color: account.saldo_final < 0 ? '#e74c3c' : account.saldo_final > 0 ? '#27ae60' : '#000000'
      }
    }, formatCurrency(account.saldo_final)))))));
  };
  const calculateTotals = () => {
    const totals = balanceData.reduce((acc, account) => ({
      saldoInicial: acc.saldoInicial + +account.saldo_inicial,
      debeTotal: acc.debeTotal + account.debe_total,
      haberTotal: acc.haberTotal + account.haber_total,
      saldoFinal: acc.saldoFinal + account.saldo_final
    }), {
      saldoInicial: 0,
      debeTotal: 0,
      haberTotal: 0,
      saldoFinal: 0
    });
    return totals;
  };
  const totals = calculateTotals();
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, "Balance de Prueba por Cuenta Contable | ", dateRange), renderBalanceTable(), /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement("h5", null, "Totales"), /*#__PURE__*/React.createElement("table", {
    className: "table table-bordered"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Saldo Inicial")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(totals.saldoInicial))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total D\xE9bito")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(totals.debeTotal))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Cr\xE9dito")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(totals.haberTotal))), /*#__PURE__*/React.createElement("tr", {
    className: "table-secondary"
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Saldo Final")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(totals.saldoFinal)))))), /*#__PURE__*/React.createElement("style", null, `
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