function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Divider } from "primereact/divider";
const typeOptions = [{
  label: "Depreciación",
  value: "depreciation"
}, {
  label: "Apreciación",
  value: "appreciation"
}];
const frequencyOptions = [{
  label: "Anual",
  value: "annual"
}, {
  label: "Semestral",
  value: "semiannual"
}, {
  label: "Trimestral",
  value: "quarterly"
}, {
  label: "Mensual",
  value: "monthly"
}];
const DepreciationAppreciationForm = ({
  formId,
  onSubmit,
  initialData,
  onCancel,
  loading = false,
  currentValue
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: {
      errors
    }
  } = useForm({
    defaultValues: initialData || {
      type: "depreciation",
      amount: 0,
      date: new Date()
    }
  });
  const type = watch("type");
  const onFormSubmit = data => onSubmit(data);
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name]?.message);
  };
  return /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(onFormSubmit),
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "type",
    className: "font-medium text-900 block mb-2"
  }, "Tipo de ajuste *"), /*#__PURE__*/React.createElement(Controller, {
    name: "type",
    control: control,
    rules: {
      required: "El tipo de ajuste es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, {
      id: "type",
      options: typeOptions,
      optionLabel: "label",
      placeholder: "Seleccione tipo",
      className: classNames("w-full", {
        "p-invalid": errors.type
      }),
      value: field.value,
      onChange: e => field.onChange(e.value),
      appendTo: "self"
    })
  }), getFormErrorMessage("type")), /*#__PURE__*/React.createElement(Divider, null), type === "depreciation" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "frequency",
    className: "font-medium text-900 block mb-2"
  }, "Frecuencia de Depreciaci\xF3n *"), /*#__PURE__*/React.createElement(Controller, {
    name: "frequency",
    control: control,
    rules: {
      required: "La frecuencia es requerida"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, {
      id: "frequency",
      options: frequencyOptions,
      optionLabel: "label",
      placeholder: "Seleccione frecuencia",
      className: classNames("w-full", {
        "p-invalid": errors.frequency
      }),
      value: field.value,
      onChange: e => field.onChange(e.value),
      appendTo: "self"
    })
  }), getFormErrorMessage("frequency"))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "percentage",
    className: "font-medium text-900 block mb-2"
  }, "Porcentaje de Depreciaci\xF3n *"), /*#__PURE__*/React.createElement(Controller, {
    name: "percentage",
    control: control,
    rules: {
      required: "El porcentaje es requerido",
      min: {
        value: 0.01,
        message: "Mínimo 0.01%"
      },
      max: {
        value: 100,
        message: "Máximo 100%"
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "p-inputgroup"
    }, /*#__PURE__*/React.createElement(InputNumber, {
      id: "percentage",
      value: field.value,
      onValueChange: e => {
        const roundedValue = e.value ? parseFloat(e.value.toFixed(2)) : null;
        field.onChange(roundedValue);
      },
      mode: "decimal",
      min: 0.01,
      max: 100,
      minFractionDigits: 2,
      maxFractionDigits: 2,
      className: classNames("w-full", {
        "p-invalid": errors.percentage
      })
    }), /*#__PURE__*/React.createElement("span", {
      className: "p-inputgroup-addon"
    }, "%"))
  }), getFormErrorMessage("percentage"))))), /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "date",
    className: "font-medium text-900 block mb-2"
  }, "Fecha del Ajuste *"), /*#__PURE__*/React.createElement(Controller, {
    name: "date",
    control: control,
    rules: {
      required: "La fecha es requerida"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Calendar, {
      id: "date",
      value: field.value,
      onChange: e => field.onChange(e.value),
      dateFormat: "dd/mm/yy",
      showIcon: true,
      className: classNames("w-full", {
        "p-invalid": errors.date
      })
    })
  }), getFormErrorMessage("date")))), type === "appreciation" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "reasons",
    className: "font-medium text-900 block mb-2"
  }, "Motivos de la Apreciaci\xF3n *"), /*#__PURE__*/React.createElement(Controller, {
    name: "reasons",
    control: control,
    rules: {
      required: "Los motivos son requeridos"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({
      id: "reasons",
      className: classNames("w-full", {
        "p-invalid": errors.reasons
      }),
      placeholder: "Describa los motivos del incremento de valor"
    }, field))
  }), getFormErrorMessage("reasons")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "amount",
    className: "font-medium text-900 block mb-2"
  }, "Monto del Ajuste *"), /*#__PURE__*/React.createElement(Controller, {
    name: "amount",
    control: control,
    rules: {
      required: "El monto es requerido",
      min: {
        value: 0.01,
        message: "Mínimo RD$0.01"
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputNumber, {
      id: "amount",
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      mode: "currency",
      currency: "DOP",
      locale: "es-DO",
      min: 0.01,
      className: classNames("w-full", {
        "p-invalid": errors.amount
      })
    })
  }), /*#__PURE__*/React.createElement("small", {
    className: "text-500"
  }, "Valor actual:", " ", currentValue.toLocaleString("es-DO", {
    style: "currency",
    currency: "DOP"
  })), getFormErrorMessage("amount"))), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end gap-2 mt-4"
  }, onCancel && /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    className: "p-button-text p-button-sm",
    onClick: onCancel,
    disabled: loading
  }), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    label: "Guardar Ajuste",
    icon: "pi pi-check",
    className: "p-button-sm",
    loading: loading
  })));
};
export default DepreciationAppreciationForm;