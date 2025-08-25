function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { useGetTemplates } from "../hooks/useGetTemplates.js";
export const ConsentimientoForm = ({
  onHandleSubmit,
  initialData
}) => {
  // Use the hook directly to get templates
  const {
    templates,
    loading: templatesLoading
  } = useGetTemplates();
  console.log('templates', templates);
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    reset
  } = useForm({
    defaultValues: initialData || {
      title: "",
      data: "",
      template_type_id: 0,
      description: ""
    }
  });
  React.useEffect(() => {
    reset(initialData || {
      title: "",
      data: "",
      template_type_id: 0,
      description: ""
    });
  }, [initialData, reset]);
  const onSubmit = data => {
    onHandleSubmit(data);
  };
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "text-danger"
    }, errors[name]?.message);
  };

  // Transform templates data for dropdown options
  const templateOptions = templates.map(template => ({
    label: template.name,
    value: template.id
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "card mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, "Datos del consentimiento"), /*#__PURE__*/React.createElement("form", {
    className: "row g-3",
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "title",
    control: control,
    rules: {
      required: "El título es requerido",
      minLength: {
        value: 3,
        message: "El título debe tener al menos 3 caracteres"
      },
      maxLength: {
        value: 100,
        message: "El título no puede exceder 100 caracteres"
      }
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      htmlFor: field.name
    }, "T\xEDtulo *"), /*#__PURE__*/React.createElement(InputText, _extends({
      className: `w-100 ${fieldState.error ? 'p-invalid' : ''}`,
      id: field.name,
      placeholder: "T\xEDtulo del consentimiento"
    }, field)), getFormErrorMessage("title"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "data",
    control: control,
    rules: {
      required: "Los datos son requeridos",
      minLength: {
        value: 3,
        message: "Los datos deben tener al menos 3 caracteres"
      },
      maxLength: {
        value: 500,
        message: "Los datos no pueden exceder 500 caracteres"
      }
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      htmlFor: field.name
    }, "Datos *"), /*#__PURE__*/React.createElement(InputTextarea, _extends({
      className: `w-100 ${fieldState.error ? 'p-invalid' : ''}`,
      id: field.name,
      placeholder: "Contenido del consentimiento",
      rows: 4
    }, field)), getFormErrorMessage("data"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "template_type_id",
    control: control,
    rules: {
      required: "El tipo de plantilla es requerido",
      min: {
        value: 1,
        message: "Debe seleccionar un tipo de plantilla"
      }
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      htmlFor: field.name
    }, "Tipo de Plantilla *"), /*#__PURE__*/React.createElement(Dropdown, {
      className: `w-100 ${fieldState.error ? 'p-invalid' : ''}`,
      id: field.name,
      placeholder: templatesLoading ? "Cargando..." : "Seleccione un tipo de plantilla",
      value: field.value,
      options: templateOptions,
      onChange: e => field.onChange(e.value),
      optionLabel: "label",
      optionValue: "value",
      showClear: true,
      disabled: templatesLoading
    }), getFormErrorMessage("template_type_id"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "description",
    control: control,
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      htmlFor: field.name
    }, "Descripci\xF3n"), /*#__PURE__*/React.createElement(InputTextarea, _extends({
      className: `w-100 ${fieldState.error ? 'p-invalid' : ''}`,
      id: field.name,
      placeholder: "Descripci\xF3n adicional (opcional)",
      rows: 3
    }, field)), getFormErrorMessage("description"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 text-end mt-4"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary me-2",
    type: "submit"
  }, "Guardar"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-primary",
    type: "button",
    onClick: () => reset()
  }, "Cancelar")))));
};