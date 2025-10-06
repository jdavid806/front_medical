import React from 'react';
import { CustomFormModal } from "../components/CustomFormModal.js";
import { AddParaclinicalForm } from "./AddParaclinicalForm.js";
export const AddParaclinicalModal = ({
  show,
  onHide
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CustomFormModal, {
    formId: "createParaclinical",
    show: show,
    title: "Agregar paracl\xEDnico",
    onHide: onHide
  }, /*#__PURE__*/React.createElement(AddParaclinicalForm, {
    formId: "createParaclinical",
    onHandleSubmit: onHide
  })));
};