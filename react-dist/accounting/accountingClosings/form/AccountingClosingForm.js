function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
const AccountingClosingForm = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const defaultValues = {
    age: new Date().getFullYear(),
    status: 'Abierto',
    start_month: null,
    end_month: null,
    warning_days: 30
  };
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    reset
  } = useForm({
    defaultValues: initialData || defaultValues
  });
  const statusOptions = [{
    label: 'Abierto',
    value: 'open'
  }, {
    label: 'Cerrado',
    value: 'closed'
  }];
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name]?.message?.toString());
  };
  useEffect(() => {
    reset(initialData || defaultValues);
  }, [initialData, reset]);
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit),
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "status",
    className: "block font-medium mb-2"
  }, "Estado *"), /*#__PURE__*/React.createElement(Controller, {
    name: "status",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      options: statusOptions,
      optionLabel: "label",
      optionValue: "value",
      className: "w-full"
    }, field))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "startDate",
    className: "block font-medium mb-2"
  }, "Fecha Inicio *"), /*#__PURE__*/React.createElement(Controller, {
    name: "start_month",
    control: control,
    rules: {
      required: 'La fecha de inicio es requerida'
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Calendar, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      showIcon: true,
      className: classNames('w-full', {
        'p-invalid': fieldState.error
      })
    }), getFormErrorMessage('start_month'))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "endDate",
    className: "block font-medium mb-2"
  }, "Fecha Fin *"), /*#__PURE__*/React.createElement(Controller, {
    name: "end_month",
    control: control,
    rules: {
      required: 'La fecha de fin es requerida'
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Calendar, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      showIcon: true,
      className: classNames('w-full', {
        'p-invalid': fieldState.error
      })
    }), getFormErrorMessage('end_month'))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "warningDays",
    className: "block font-medium mb-2"
  }, "D\xEDas de Advertencia *"), /*#__PURE__*/React.createElement(Controller, {
    name: "warning_days",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      placeholder: "Ingrese la duraci\xF3n",
      ref: field.ref,
      value: field.value,
      onBlur: field.onBlur,
      onValueChange: e => field.onChange(e),
      inputClassName: classNames('w-100', {
        'p-invalid': errors.warning_days
      })
    }), getFormErrorMessage('warning_days'))
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end gap-2 mt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    className: "p-button-text",
    onClick: onCancel
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    icon: "pi pi-check",
    className: "p-button-primary",
    type: "submit"
  })));
};
export default AccountingClosingForm;