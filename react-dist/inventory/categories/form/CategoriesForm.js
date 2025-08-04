function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
export const CategoriesForm = ({
  onHandleSubmit,
  initialData
}) => {
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    reset
  } = useForm({
    defaultValues: initialData || {
      name: "",
      description: ""
    }
  });
  React.useEffect(() => {
    reset(initialData || {
      name: "",
      description: ""
    });
  }, [initialData, reset]);
  const onSubmit = data => {
    onHandleSubmit(data);
  };
  const getFormErrorMessage = name => {
    return errors[name] ? /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name]?.message) : /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, "\xA0");
  };
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit),
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name",
    className: "block mb-2"
  }, "Nombre *"), /*#__PURE__*/React.createElement(Controller, {
    name: "name",
    control: control,
    rules: {
      required: "El nombre es requerido",
      minLength: {
        value: 3,
        message: "El nombre debe tener al menos 3 caracteres"
      },
      maxLength: {
        value: 50,
        message: "El nombre no puede exceder 50 caracteres"
      }
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name
    }, field, {
      className: classNames({
        "p-invalid": fieldState.error
      })
    }))
  }), getFormErrorMessage("name")), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "description",
    className: "block mb-2"
  }, "Descripci\xF3n *"), /*#__PURE__*/React.createElement(Controller, {
    name: "description",
    control: control,
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(InputTextarea, _extends({
      id: field.name
    }, field, {
      className: classNames({
        "p-invalid": fieldState.error
      })
    }))
  }), getFormErrorMessage("description")), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end mt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    type: "button",
    className: "p-button-text w-30",
    onClick: () => reset()
  }), /*#__PURE__*/React.createElement(Button, {
    label: initialData?.isEditing ? "Actualizar" : "Guardar",
    icon: "pi pi-check",
    type: "submit",
    className: "w-30 ml-2"
  })));
};