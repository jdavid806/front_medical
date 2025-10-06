function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import { Password } from "primereact/password";
import React from "react";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useVerifySupervisor } from "./hooks/useVerifySupervisor.js";
import { VerifySupervisorFormMapper } from "./mappers/index.js";
export const VerifySupervisorForm = ({
  onVerify
}) => {
  const {
    verifySupervisor
  } = useVerifySupervisor();
  const {
    control,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm();
  const onSubmit = data => onHandleSubmit(data);
  const onHandleSubmit = async data => {
    try {
      const formData = VerifySupervisorFormMapper.toFormData(data);
      const result = await verifySupervisor(formData);
      if (result.status === 401) {
        onVerify(false);
        return;
      }
      onVerify(true);
    } catch (error) {
      onVerify(false);
      console.error(error);
    }
  };
  const getFormError = field => {
    const error = errors[field]?.message;
    return error && /*#__PURE__*/React.createElement("p", {
      className: "text-danger"
    }, error);
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "Se requiere la verificaci\xF3n de la identidad del supervisor. Por favor, ingrese la contrase\xF1a del supervisor"), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "password",
    control: control,
    rules: {
      required: {
        value: true,
        message: "El campo es requerido"
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Contrase\xF1a"), /*#__PURE__*/React.createElement(Password, _extends({
      id: field.name,
      placeholder: "Ingrese su contrase\xF1a",
      toggleMask: true,
      className: "w-100",
      inputClassName: "w-100"
    }, field)))
  }), getFormError("password")), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end"
  }, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, "Verificar"))));
};