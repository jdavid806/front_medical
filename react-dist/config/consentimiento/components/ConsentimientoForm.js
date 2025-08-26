function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
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
      description: "",
      name_patient: "",
      document: "",
      name_doctor: "",
      age: undefined,
      date_current: new Date(),
      date_birth: undefined,
      phone: "",
      email: "",
      city: ""
    }
  });
  React.useEffect(() => {
    reset(initialData || {
      title: "",
      data: "",
      template_type_id: 0,
      description: "",
      name_patient: "",
      document: "",
      name_doctor: "",
      age: undefined,
      date_current: new Date(),
      date_birth: undefined,
      phone: "",
      email: "",
      city: ""
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
    className: "col-12 mt-4"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "text-primary border-bottom pb-2"
  }, "Datos del Paciente")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "name_patient",
    control: control,
    rules: {
      required: "El nombre del paciente es requerido",
      minLength: {
        value: 2,
        message: "El nombre debe tener al menos 2 caracteres"
      },
      maxLength: {
        value: 100,
        message: "El nombre no puede exceder 100 caracteres"
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
    }, "Nombre del Paciente *"), /*#__PURE__*/React.createElement(InputText, _extends({
      className: `w-100 ${fieldState.error ? 'p-invalid' : ''}`,
      id: field.name,
      placeholder: "Nombre completo del paciente"
    }, field)), getFormErrorMessage("name_patient"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "document",
    control: control,
    rules: {
      required: "El documento es requerido",
      pattern: {
        value: /^[0-9]+$/,
        message: "El documento debe contener solo números"
      },
      minLength: {
        value: 6,
        message: "El documento debe tener al menos 6 dígitos"
      },
      maxLength: {
        value: 15,
        message: "El documento no puede exceder 15 dígitos"
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
    }, "Documento *"), /*#__PURE__*/React.createElement(InputText, _extends({
      className: `w-100 ${fieldState.error ? 'p-invalid' : ''}`,
      id: field.name,
      placeholder: "N\xFAmero de documento"
    }, field)), getFormErrorMessage("document"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "age",
    control: control,
    rules: {
      required: "La edad es requerida",
      min: {
        value: 0,
        message: "La edad no puede ser negativa"
      },
      max: {
        value: 150,
        message: "La edad no puede exceder 150 años"
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
    }, "Edad *"), /*#__PURE__*/React.createElement(InputText, {
      className: `w-100 ${fieldState.error ? 'p-invalid' : ''}`,
      id: field.name,
      placeholder: "Edad en a\xF1os",
      type: "number",
      min: "0",
      max: "150",
      value: field.value?.toString() || '',
      onChange: e => field.onChange(parseInt(e.target.value) || undefined)
    }), getFormErrorMessage("age"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "date_birth",
    control: control,
    rules: {
      required: "La fecha de nacimiento es requerida"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      htmlFor: field.name
    }, "Fecha de Nacimiento *"), /*#__PURE__*/React.createElement(Calendar, {
      className: `w-100 ${fieldState.error ? 'p-invalid' : ''}`,
      id: field.name,
      placeholder: "Seleccione fecha de nacimiento",
      dateFormat: "dd/mm/yy",
      showIcon: true,
      maxDate: new Date(),
      yearNavigator: true,
      yearRange: "1900:2024",
      value: field.value,
      onChange: e => field.onChange(e.value)
    }), getFormErrorMessage("date_birth"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "date_current",
    control: control,
    rules: {
      required: "La fecha actual es requerida"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label",
      htmlFor: field.name
    }, "Fecha Actual *"), /*#__PURE__*/React.createElement(Calendar, {
      className: `w-100 ${fieldState.error ? 'p-invalid' : ''}`,
      id: field.name,
      placeholder: "Fecha actual",
      dateFormat: "dd/mm/yy",
      showIcon: true,
      value: field.value,
      onChange: e => field.onChange(e.value)
    }), getFormErrorMessage("date_current"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "phone",
    control: control,
    rules: {
      required: "El teléfono es requerido",
      pattern: {
        value: /^[+]?[0-9\s\-()]{7,15}$/,
        message: "Formato de teléfono inválido"
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
    }, "Tel\xE9fono *"), /*#__PURE__*/React.createElement(InputText, _extends({
      className: `w-100 ${fieldState.error ? 'p-invalid' : ''}`,
      id: field.name,
      placeholder: "N\xFAmero de tel\xE9fono"
    }, field)), getFormErrorMessage("phone"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "email",
    control: control,
    rules: {
      required: "El email es requerido",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Formato de email inválido"
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
    }, "Email *"), /*#__PURE__*/React.createElement(InputText, _extends({
      className: `w-100 ${fieldState.error ? 'p-invalid' : ''}`,
      id: field.name,
      placeholder: "Correo electr\xF3nico",
      type: "email"
    }, field)), getFormErrorMessage("email"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "city",
    control: control,
    rules: {
      required: "La ciudad es requerida",
      minLength: {
        value: 2,
        message: "La ciudad debe tener al menos 2 caracteres"
      },
      maxLength: {
        value: 50,
        message: "La ciudad no puede exceder 50 caracteres"
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
    }, "Ciudad *"), /*#__PURE__*/React.createElement(InputText, _extends({
      className: `w-100 ${fieldState.error ? 'p-invalid' : ''}`,
      id: field.name,
      placeholder: "Ciudad de residencia"
    }, field)), getFormErrorMessage("city"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "name_doctor",
    control: control,
    rules: {
      required: "El nombre del doctor es requerido",
      minLength: {
        value: 2,
        message: "El nombre debe tener al menos 2 caracteres"
      },
      maxLength: {
        value: 100,
        message: "El nombre no puede exceder 100 caracteres"
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
    }, "Nombre del Doctor *"), /*#__PURE__*/React.createElement(InputText, _extends({
      className: `w-100 ${fieldState.error ? 'p-invalid' : ''}`,
      id: field.name,
      placeholder: "Nombre completo del doctor"
    }, field)), getFormErrorMessage("name_doctor"))
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