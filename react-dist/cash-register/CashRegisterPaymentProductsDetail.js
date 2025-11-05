import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { formatPrice } from "../../services/utilidades.js";
import { CashRegisterProductHelper } from "./helpers/CashRegisterProductHelper.js";
export const CashRegisterPaymentProductsDetail = props => {
  const {
    products
  } = props;
  const total = CashRegisterProductHelper.calculateTotal(products);
  const productPriceBodyTemplate = rowData => {
    return formatPrice(rowData.price);
  };
  const productTotalBodyTemplate = rowData => {
    const total = rowData.price * rowData.quantity;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-end"
    }, /*#__PURE__*/React.createElement("strong", null, formatPrice(total))));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "border-round border-1 surface-border"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: products,
    className: "p-datatable-sm p-datatable-gridlines",
    scrollable: true,
    scrollHeight: "flex",
    emptyMessage: "No se han agregado productos",
    stripedRows: true,
    footer: /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-center p-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-lg fw-bold"
    }, "Total General:"), /*#__PURE__*/React.createElement("span", {
      className: "text-xl fw-bold text-primary"
    }, formatPrice(total)))
  }, /*#__PURE__*/React.createElement(Column, {
    field: "description",
    header: "Descripci\xF3n"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "price",
    header: "Precio Unitario",
    body: productPriceBodyTemplate
  }), /*#__PURE__*/React.createElement(Column, {
    field: "quantity",
    header: "Cantidad"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "total",
    header: "Total",
    body: productTotalBodyTemplate
  })));
};