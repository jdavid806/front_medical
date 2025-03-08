import React from 'react';
import { CustomModal } from "../../components/CustomModal.js";
import PrescriptionForm from "./PrescriptionForm.js";
const PrescriptionModal = ({
  show,
  handleSubmit,
  onHide
}) => {
  const formId = 'createReceta';
  return /*#__PURE__*/React.createElement(CustomModal, {
    show: show,
    onHide: onHide,
    title: "Crear receta"
  }, /*#__PURE__*/React.createElement(PrescriptionForm, {
    formId: formId,
    handleSubmit: handleSubmit
  }));
};
export default PrescriptionModal;