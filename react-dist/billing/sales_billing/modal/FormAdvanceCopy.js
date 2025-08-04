import React from "react";
import { useForm, Controller } from "react-hook-form";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
export const FormAdvanceCopy = ({
  advances,
  invoiceTotal,
  onSubmit
}) => {
  const {
    control,
    handleSubmit
  } = useForm({
    defaultValues: {
      amount: null
    }
  });
  const handleOnSubmit = data => {
    onSubmit(data);
  };
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit),
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field",
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "amount"
  }, "Monto"), /*#__PURE__*/React.createElement(Controller, {
    name: "amount",
    control: control,
    rules: {
      required: "Este campo es requerido",
      min: {
        value: 1,
        message: "El monto debe ser mayor a 0"
      }
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputNumber, {
      id: field.name,
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      mode: "currency",
      currency: "DOP",
      placeholder: "DOP 0.00",
      className: fieldState.error ? "p-invalid" : ""
    }), fieldState.error && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, fieldState.error.message))
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between"
  }, /*#__PURE__*/React.createElement("div", null, "Total de la factura:"), /*#__PURE__*/React.createElement("div", null, invoiceTotal)), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between"
  }, /*#__PURE__*/React.createElement("div", null, "Anticipo disponible:"), /*#__PURE__*/React.createElement("div", null, advances?.original?.advance_balance))), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    label: "Aplicar",
    className: "mt-2",
    onClick: handleSubmit(handleOnSubmit)
  }));
};