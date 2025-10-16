import React from "react";
import { ComissionForm } from "./Comissions.js";
import { Dialog } from "primereact/dialog";
export const ComissionFormModal = ({
  title,
  show,
  handleSubmit,
  onHide,
  initialData
}) => {
  const formId = "createDoctor";
  const footer = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-link text-danger px-3 my-0",
    "aria-label": "Close",
    onClick: onHide
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-arrow-left"
  }), " Cerrar"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    form: formId,
    className: "btn btn-primary my-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-bookmark"
  }), " Guardar"));
  return /*#__PURE__*/React.createElement(Dialog, {
    visible: show,
    onHide: () => {
      onHide?.();
    },
    header: title,
    footer: footer,
    style: {
      width: "80vw",
      height: "75%",
      maxHeight: "90%"
    }
  }, /*#__PURE__*/React.createElement(ComissionForm, {
    formId: formId,
    onHandleSubmit: handleSubmit,
    initialData: initialData
  }));
};