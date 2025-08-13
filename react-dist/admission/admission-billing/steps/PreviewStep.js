import React from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { calculateTotal, calculatePaid } from "../utils/helpers.js";
const PreviewStep = ({
  formData,
  nextStep,
  prevStep
}) => {
  const total = calculateTotal(formData.products);
  const paid = calculatePaid(formData.payments);
  const balance = total - paid;
  return /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Datos del Cliente",
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Nombre:"), " ", `${formData.patient.firstName} ${formData.patient.lastName}`), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "C\xE9dula:"), " ", formData.patient.documentNumber)), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Ciudad:"), " ", formData.patient.city)))), /*#__PURE__*/React.createElement(Card, {
    title: "Detalles de la factura",
    className: "mb-4"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: formData.products,
    className: "p-datatable-sm"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "id",
    header: "#"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "description",
    header: "Descripci\xF3n"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "quantity",
    header: "Cantidad"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "price",
    header: "Precio"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "tax",
    header: "Descuento"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "total",
    header: "Subtotal"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("h4", null, "M\xE9todos de Pago"), /*#__PURE__*/React.createElement(DataTable, {
    value: formData.payments,
    className: "p-datatable-sm"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "method",
    header: "M\xE9todo de Pago"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "amount",
    header: "Monto"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-between mb-2"
  }, /*#__PURE__*/React.createElement("span", null, "Subtotal:"), /*#__PURE__*/React.createElement("span", null, total.toFixed(2))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-between mb-2"
  }, /*#__PURE__*/React.createElement("span", null, "Total a Pagar:"), /*#__PURE__*/React.createElement("span", null, total.toFixed(2))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-between mb-2"
  }, /*#__PURE__*/React.createElement("span", null, "Pagado:"), /*#__PURE__*/React.createElement("span", null, paid.toFixed(2))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-between mb-2"
  }, /*#__PURE__*/React.createElement("span", null, "Saldo:"), /*#__PURE__*/React.createElement("span", null, balance.toFixed(2))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-between mt-3 font-bold"
  }, /*#__PURE__*/React.createElement("span", null, "Total Factura:"), /*#__PURE__*/React.createElement("span", null, total.toFixed(2))))))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-between pt-4 col-12"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Atr\xE1s",
    icon: "pi pi-arrow-left",
    onClick: prevStep
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Finalizar",
    icon: "pi pi-check",
    onClick: nextStep
  })));
};
export default PreviewStep;