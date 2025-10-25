function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
const ExpirationLotForm = ({
  formId,
  onSubmit,
  initialData,
  deposits,
  productName,
  isEditing
}) => {
  const [localFormData, setLocalFormData] = useState(initialData || {
    expirationDate: null,
    lotNumber: "",
    deposit: "",
    quantity: "" // Valor inicial
  });
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: {
      errors,
      isValid
    }
  } = useForm({
    defaultValues: localFormData,
    mode: "onChange"
  });
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);
  const handleFormSubmit = data => {
    onSubmit(data);
  };
  const renderLotNumber = ({
    field
  }) => /*#__PURE__*/React.createElement("div", {
    className: "input-wrapper"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: field.name,
    className: "form-label"
  }, "N\xFAmero de Lote *"), /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
    placeholder: "Ej: LOTE-2023-001",
    autoComplete: "off",
    className: "w-100"
  })), errors.lotNumber && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.lotNumber.message));
  const renderExpirationDate = ({
    field
  }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
    htmlFor: field.name,
    className: "form-label"
  }, "Fecha de Caducidad *"), /*#__PURE__*/React.createElement(Calendar, _extends({}, field, {
    dateFormat: "dd/mm/yy",
    showIcon: true,
    minDate: new Date(),
    placeholder: "Seleccione fecha",
    className: "w-100"
  })));
  const renderDeposit = ({
    field
  }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
    htmlFor: field.name,
    className: "form-label"
  }, "Dep\xF3sito *"), /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
    options: deposits,
    optionLabel: "name",
    optionValue: "id",
    placeholder: "Seleccione dep\xF3sito",
    filter: true,
    className: "w-100"
  })));

  // NUEVO: Render para el campo de cantidad
  const renderQuantity = ({
    field
  }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
    htmlFor: field.name,
    className: "form-label"
  }, "Cantidad *"), /*#__PURE__*/React.createElement(InputNumber, {
    value: field.value || 0 // Forzar valor numérico
    ,
    placeholder: "Cantidad",
    className: "w-100",
    min: 0,
    onValueChange: e => {
      console.log("Value changed:", e.value); // Para debug
      field.onChange(e.value);
    }
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "card shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-box me-2 text-primary"
  }), isEditing ? `Editar Lote - ${productName}` : `Agregar Lote - ${productName}`)), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(handleFormSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "lotNumber",
    control: control,
    rules: {
      required: "Campo obligatorio"
    },
    render: renderLotNumber
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "expirationDate",
    control: control,
    rules: {
      required: "Campo obligatorio"
    },
    render: renderExpirationDate
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "deposit",
    control: control,
    rules: {
      required: "Campo obligatorio"
    },
    render: renderDeposit
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "quantity",
    control: control,
    rules: {
      required: "Campo obligatorio",
      min: {
        value: 1,
        message: "La cantidad debe ser mayor a 0"
      }
    },
    render: renderQuantity
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    label: "Guardar",
    disabled: !isValid,
    onClick: handleSubmit(handleFormSubmit)
  })))));
};
export default ExpirationLotForm;