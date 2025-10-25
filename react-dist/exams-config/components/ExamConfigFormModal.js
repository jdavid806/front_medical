import React from 'react';
import { ExamConfigForm } from "./ExamConfigForm.js";
import { Dialog } from 'primereact/dialog';
export const ExamConfigFormModal = ({
  title = 'Crear examen',
  show,
  handleSubmit,
  onHide,
  initialData
}) => {
  const formId = 'createExamType';
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
      width: "70vw"
    }
  }, /*#__PURE__*/React.createElement(ExamConfigForm, {
    formId: formId,
    onHandleSubmit: handleSubmit,
    initialData: initialData
  }));
};