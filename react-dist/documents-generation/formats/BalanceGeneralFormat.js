import React from "react";
export const BalanceGeneralFormat = ({
  balanceSheetData,
  date
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
  const renderAccountTable = (accounts, title) => {
    return /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("h5", {
      className: "mb-3"
    }, title), /*#__PURE__*/React.createElement("table", {
      className: "table table-bordered"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      style: {
        width: '120px'
      }
    }, "C\xF3digo"), /*#__PURE__*/React.createElement("th", null, "Cuenta"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: '180px',
        textAlign: 'right'
      }
    }, "Balance"))), /*#__PURE__*/React.createElement("tbody", null, filterAccountsByType(accounts).map(account => /*#__PURE__*/React.createElement("tr", {
      key: account.account_code
    }, /*#__PURE__*/React.createElement("td", null, account.account_code), /*#__PURE__*/React.createElement("td", null, account.account_name), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(account.balance)))))));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, "Balance general | ", date), renderAccountTable(balanceSheetData.categories.assets, "Activos"), renderAccountTable(balanceSheetData.categories.liabilities, "Pasivos"), renderAccountTable(balanceSheetData.categories.equity, "Patrimonio"), /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement("h5", null, "Totales"), /*#__PURE__*/React.createElement("table", {
    className: "table table-bordered"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Activos")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(balanceSheetData.totals.assets))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Pasivos")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(balanceSheetData.totals.liabilities))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Total Patrimonio")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(balanceSheetData.totals.equity))), /*#__PURE__*/React.createElement("tr", {
    className: "table-secondary"
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, "Diferencia")), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(balanceSheetData.difference)))))), /*#__PURE__*/React.createElement("style", null, `
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