import React from 'react';
import { CustomModal } from "./CustomModal.js";
export const CustomFormModal = ({
  children,
  formId,
  title,
  show,
  scrollable,
  onSave,
  onHide
}) => {
  const footer = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-link text-danger px-3 my-0",
    "aria-label": "Close",
    onClick: onHide
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-arrow-left"
  }), " Cerrar"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    form: formId,
    className: "btn btn-primary my-0",
    onClick: onSave
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-bookmark"
  }), " Guardar"));
  return /*#__PURE__*/React.createElement(CustomModal, {
    show: show,
    onHide: onHide,
    title: title,
    footerTemplate: footer,
    scrollable: scrollable
  }, children);
};