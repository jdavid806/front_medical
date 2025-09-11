import React, { useRef } from "react";
export const usePRToast = () => {
  const toast = useRef(null);
  const showSuccessToast = ({
    title,
    message
  } = {}) => {
    toast.current?.show({
      severity: "success",
      summary: title || "Éxito",
      detail: message || "Operación exitosa"
    });
  };
  const showErrorToast = ({
    title,
    message
  } = {}) => {
    toast.current?.show({
      severity: "error",
      summary: title || "Error",
      detail: message || "Operación fallida"
    });
  };
  const showFormErrorsToast = ({
    title,
    errors
  }) => {
    toast.current?.show({
      severity: "error",
      summary: title || "Errores de validación",
      content: props => /*#__PURE__*/React.createElement("div", {
        className: "text-start"
      }, /*#__PURE__*/React.createElement("h3", null, props.message.summary), Object.entries(errors).map(([field, messages]) => /*#__PURE__*/React.createElement("div", {
        className: "mb-2"
      }, /*#__PURE__*/React.createElement("ul", {
        className: "mb-0 mt-1 ps-3"
      }, messages.map(msg => /*#__PURE__*/React.createElement("li", null, msg))))))
    });
  };
  const showServerErrorsToast = errors => {
    if (errors.data?.errors) {
      showFormErrorsToast({
        errors: errors.data.errors
      });
    } else {
      showErrorToast({
        message: errors.data.error || errors.message || 'Ocurrió un error inesperado'
      });
    }
  };
  return {
    toast,
    showSuccessToast,
    showErrorToast,
    showFormErrorsToast,
    showServerErrorsToast
  };
};