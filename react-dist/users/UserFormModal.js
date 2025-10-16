import React from 'react';
import UserForm from "./UserForm.js";
import { Dialog } from 'primereact/dialog';
const UserFormModal = ({
  title,
  show,
  handleSubmit,
  onHide,
  initialData,
  config
}) => {
  const formId = 'createDoctor';
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
      height: "100%",
      maxHeight: "90%"
    }
  }, /*#__PURE__*/React.createElement(UserForm, {
    formId: formId,
    onHandleSubmit: handleSubmit,
    initialData: initialData,
    config: config
  }));
};
export default UserFormModal;