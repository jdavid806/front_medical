function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";

// Definimos los tipos de datos del formulario

import { Dropdown } from "primereact/dropdown";
import { depositTypes } from "../ts/consts.js";
const DepositForm = ({
  formId,
  onSubmit,
  initialData,
  onCancel,
  loading = false
}) => {
  const {
    control,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm({
    defaultValues: initialData || {
      name: "",
      type: null,
      notes: ""
    }
  });
  const depositTypeOptions = Object.entries(depositTypes).map(([key, value]) => ({
    label: value,
    value: key
  }));
  const onFormSubmit = data => onSubmit(data);
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name]?.message);
  };
  return /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(onFormSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "name",
    control: control,
    rules: {
      required: "El nombre del depósito es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Nombre del Dep\xF3sito *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames("w-100", {
        "p-invalid": errors.name
      })
    }, field)))
  }), getFormErrorMessage("name")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "type",
    control: control,
    rules: {
      required: "El tipo del depósito es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Tipo del Dep\xF3sito *"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      id: field.name,
      className: classNames("w-100", {
        "p-invalid": errors.type
      })
    }, field, {
      options: depositTypeOptions,
      optionLabel: "label",
      optionValue: "value"
    })))
  }), getFormErrorMessage("type")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "notes",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Notas/Observaciones"), /*#__PURE__*/React.createElement(InputTextarea, _extends({
      id: field.name,
      className: "w-100",
      rows: 3
    }, field)))
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end mt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    label: "Guardar",
    icon: "pi pi-check",
    className: "p-button-sm",
    loading: loading
  }), onCancel && /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    className: "p-button-text",
    onClick: onCancel,
    disabled: loading
  })));
};
export default DepositForm;