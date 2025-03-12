import React from 'react';
import UserForm from "../../users/UserForm.js";
import { CustomModal } from "../../components/CustomModal.js";
const PrescriptionFormModal = ({
  show,
  handleSubmit,
  onHide
}) => {
  const formId = 'createDoctor';
  return /*#__PURE__*/React.createElement(CustomModal, {
    show: show,
    onHide: onHide,
    title: "Crear receta"
  }, /*#__PURE__*/React.createElement(UserForm, {
    formId: formId,
    handleSubmit: handleSubmit
  }));
};
export default PrescriptionFormModal;