import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
export const NewNoteModal = ({
  visible,
  onHide,
  onSubmit,
  factura,
  tipo
}) => {
  const [numeroNota, setNumeroNota] = useState("");
  const [comprobanteFiscal, setComprobanteFiscal] = useState("");
  const [monto, setMonto] = useState(0);
  const [motivo, setMotivo] = useState("");

  // impuesto y retención ahora son valores directos del usuario
  const [impuesto, setImpuesto] = useState(0);
  const [retencion, setRetencion] = useState(0);

  // subtotal calculado
  const subtotal = monto + impuesto - retencion;
  const handleSave = () => {
    onSubmit({
      invoice_id: factura?.id,
      note_code: numeroNota,
      resolution_number: comprobanteFiscal,
      amount: monto,
      tax: impuesto,
      withholding: retencion,
      subtotal,
      reason: motivo,
      type: tipo === "credito" ? "credit" : "debit"
    });
    onHide();
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    header: `Generar Nota ${tipo === "debito" ? "Débito" : "Crédito"}`,
    visible: visible,
    style: {
      width: "500px"
    },
    modal: true,
    onHide: onHide
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "# de la nota"), /*#__PURE__*/React.createElement(InputText, {
    value: numeroNota,
    onChange: e => setNumeroNota(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Comprobante Fiscal"), /*#__PURE__*/React.createElement(InputText, {
    value: comprobanteFiscal,
    onChange: e => setComprobanteFiscal(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Monto de la nota"), /*#__PURE__*/React.createElement(InputText, {
    keyfilter: "num",
    value: monto.toString(),
    onChange: e => setMonto(Number(e.target.value))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Impuesto"), /*#__PURE__*/React.createElement(InputText, {
    keyfilter: "num",
    value: impuesto.toString(),
    onChange: e => setImpuesto(Number(e.target.value))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Retenci\xF3n"), /*#__PURE__*/React.createElement(InputText, {
    keyfilter: "num",
    value: retencion.toString(),
    onChange: e => setRetencion(Number(e.target.value))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Subtotal"), /*#__PURE__*/React.createElement(InputText, {
    value: subtotal.toFixed(2),
    disabled: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, factura && /*#__PURE__*/React.createElement("small", null, "Factura actual: ", /*#__PURE__*/React.createElement("b", null, factura.monto), " \u2192 despu\xE9s:", " ", /*#__PURE__*/React.createElement("b", null, tipo === "credito" ? factura.monto - monto : factura.monto + monto))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Motivo"), /*#__PURE__*/React.createElement(InputTextarea, {
    rows: 3,
    value: motivo,
    onChange: e => setMotivo(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end gap-2 mt-3"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    className: "p-button-text",
    onClick: onHide
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    icon: "pi pi-check",
    className: "p-button-primary",
    disabled: !numeroNota || !comprobanteFiscal || !monto,
    onClick: handleSave
  }))));
};