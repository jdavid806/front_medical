function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { useAllTableUsers } from "./hooks/useAllTableUsers.js";
import { MultiSelect } from "primereact/multiselect";
export const ComissionForm = ({
  formId,
  onHandleSubmit,
  initialData
}) => {
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    reset,
    watch,
    setValue,
    register,
    getValues
  } = useForm({
    defaultValues: initialData || {
      users: [],
      attention_type: "",
      application_type: "",
      commission_type: "",
      services: [],
      commission_value: 0,
      percentage_base: "",
      percentage_value: 0,
      retention_type: "",
      value_retention: 0
    }
  });
  const {
    users,
    fetchUsers
  } = useAllTableUsers();
  const [services, setServices] = useState([]);
  useEffect(() => {
    fetchServices();
  }, []);
  useEffect(() => {
    reset(initialData || {
      users: [],
      attention_type: "",
      application_type: "",
      commission_type: "",
      services: [],
      commission_value: 0,
      percentage_base: "",
      percentage_value: 0,
      retention_type: "",
      value_retention: 0
    });
  }, [initialData, reset]);
  const onSubmit = data => onHandleSubmit(data);
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message);
  };
  async function fetchServices() {
    //@ts-ignore
    const ruta = obtenerRutaPrincipal() + "/api/v1/admin/products/servicios";
    const response = await fetch(ruta);
    const result = await response.json();
    setServices(result);
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "card mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-12 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "users",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Usuarios ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(MultiSelect, _extends({
      inputId: field.name,
      filter: true,
      options: users,
      optionLabel: "fullName",
      optionValue: "id",
      placeholder: "Seleccione",
      className: classNames("w-100", {
        "p-invalid": errors.users
      }),
      appendTo: document.body,
      disabled: initialData?.isEditing
    }, field)))
  }), getFormErrorMessage("users")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "attention_type",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Tipo de atenci\xF3n ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      filter: true,
      options: [{
        label: "Entidad",
        value: "entity"
      }, {
        label: "Particular",
        value: "public"
      }],
      optionLabel: "label",
      optionValue: "value",
      placeholder: "Seleccione",
      className: classNames("w-100", {
        "p-invalid": errors.attention_type
      }),
      appendTo: document.body
    }, field)))
  }), getFormErrorMessage("attention_type")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "application_type",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Tipo de aplicacio\u0301n", " ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      filter: true,
      options: [{
        label: "Servicio",
        value: "service"
      }, {
        label: "Orden",
        value: "order"
      }],
      optionLabel: "label",
      optionValue: "value",
      placeholder: "Seleccione",
      className: classNames("w-100", {
        "p-invalid": errors.application_type
      }),
      appendTo: document.body
    }, field)))
  }), getFormErrorMessage("application_type")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "commission_value",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Valor de la comision", " ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(InputNumber, {
      id: field.name,
      placeholder: "Valor de la comision",
      className: "w-100",
      value: field.value,
      onValueChange: e => field.onChange(e.value)
    }))
  }), getFormErrorMessage("commission_value")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "services",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Servicios ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(MultiSelect, _extends({
      inputId: field.name,
      filter: true,
      options: services,
      optionLabel: "name",
      optionValue: "id",
      placeholder: "Seleccione",
      className: classNames("w-100", {
        "p-invalid": errors.services
      }),
      appendTo: document.body
    }, field)))
  }), getFormErrorMessage("services")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "commission_type",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Tipo de comisi\xF3n ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      filter: true,
      options: [{
        label: "Porcentaje",
        value: "percentage"
      }, {
        label: "Cantidad fija",
        value: "fixed"
      }],
      optionLabel: "label",
      optionValue: "value",
      placeholder: "Seleccione",
      className: classNames("w-100", {
        "p-invalid": errors.commission_type
      }),
      appendTo: document.body
    }, field)))
  }), getFormErrorMessage("commission_type")), /*#__PURE__*/React.createElement(React.Fragment, null, watch("commission_type") === "percentage" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "percentage_base",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Porcentaje base", " ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      filter: true,
      options: [{
        label: "Valor pagado por paciente particular",
        value: "public"
      }, {
        label: "Monto autorizado por entidad",
        value: "entity"
      }],
      optionLabel: "label",
      optionValue: "value",
      placeholder: "Seleccione",
      className: classNames("w-100", {
        "p-invalid": errors.percentage_base
      }),
      appendTo: document.body
    }, field)))
  }), getFormErrorMessage("percentage_base")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "percentage_value",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Porcentaje ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(InputNumber, {
      id: field.name,
      placeholder: "Porcentaje",
      className: "w-100",
      value: field.value,
      onValueChange: e => field.onChange(e.value)
    }))
  }), getFormErrorMessage("percentage_value")))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "retention_type",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Tipo de retenci\xF3n", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      filter: true,
      options: [{
        label: "Porcentaje",
        value: "percentage"
      }, {
        label: "Monto fijo",
        value: "fixed_amount"
      }],
      optionLabel: "label",
      optionValue: "value",
      placeholder: "Seleccione",
      className: classNames("w-100", {
        "p-invalid": errors.retention_type
      }),
      appendTo: document.body
    }, field)))
  }), getFormErrorMessage("retention_type")), watch("retention_type") === "percentage" && /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "value_retention",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Porcentaje de retenci\xF3n", " ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(InputNumber, {
      id: field.name,
      mode: "decimal",
      min: 0,
      max: 100,
      suffix: "%",
      placeholder: "Ej: 10%",
      className: "w-100",
      value: field.value,
      onValueChange: e => field.onChange(e.value)
    }))
  }), getFormErrorMessage("value_retention")), watch("retention_type") === "fixed_amount" && /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-1"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "value_retention",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Valor fijo de retenci\xF3n", " ", /*#__PURE__*/React.createElement("span", {
      className: "text-primary"
    }, "*")), /*#__PURE__*/React.createElement(InputNumber, {
      id: field.name,
      mode: "currency",
      currency: "COP",
      locale: "es-CO",
      min: 0,
      placeholder: "Ej: $50,000",
      className: "w-100",
      value: field.value,
      onValueChange: e => field.onChange(e.value)
    }))
  }), getFormErrorMessage("value_retention")))))));
};