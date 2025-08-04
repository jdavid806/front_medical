import React from "react";
export const StatusResultFormat = ({
  incomeStatementData
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
  const renderAccountTable = (accounts, title) => {
    return /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("h5", {
      className: "mb-3"
    }, title), /*#__PURE__*/React.createElement("table", {
      className: "table table-bordered"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "C\xF3digo"), /*#__PURE__*/React.createElement("th", null, "Cuenta"), /*#__PURE__*/React.createElement("th", null, "Cr\xE9ditos"), /*#__PURE__*/React.createElement("th", null, "D\xE9bitos"))), /*#__PURE__*/React.createElement("tbody", null, accounts.map(account => /*#__PURE__*/React.createElement("tr", {
      key: account.codigo
    }, /*#__PURE__*/React.createElement("td", null, account.codigo), /*#__PURE__*/React.createElement("td", null, account.nombre), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(account.total_creditos)), /*#__PURE__*/React.createElement("td", {
      className: "text-end"
    }, formatCurrency(account.total_debitos)))))));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, "Estado de Resultados (", incomeStatementData.periodo.desde, " al ", incomeStatementData.periodo.hasta, ")"), /*#__PURE__*/React.createElement("div", {
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
  }, /*#__PURE__*/React.createElement("h5", null, "Detalles por Categor\xEDa"), /*#__PURE__*/React.createElement("table", {
    className: "table table-bordered"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Categor\xEDa"), /*#__PURE__*/React.createElement("th", null, "Total Cr\xE9ditos"), /*#__PURE__*/React.createElement("th", null, "Total D\xE9bitos"))), /*#__PURE__*/React.createElement("tbody", null, incomeStatementData.detalles.map(detalle => /*#__PURE__*/React.createElement("tr", {
    key: detalle.categoria
  }, /*#__PURE__*/React.createElement("td", null, detalle.categoria), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(detalle.total_creditos)), /*#__PURE__*/React.createElement("td", {
    className: "text-end"
  }, formatCurrency(detalle.total_debitos))))))), renderAccountTable(incomeStatementData.cuentas, "Detalle de Cuentas"), /*#__PURE__*/React.createElement("style", null, `
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