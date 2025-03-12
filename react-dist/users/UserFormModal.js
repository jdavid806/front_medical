import React from 'react';
import UserForm from "./UserForm.js";
import { CustomFormModal } from "../components/CustomFormModal.js";
const UserFormModal = ({
  show,
  handleSubmit,
  onHide
}) => {
  const formId = 'createDoctor';
  return /*#__PURE__*/React.createElement(CustomFormModal, {
    show: show,
    formId: formId,
    onHide: onHide,
    title: "Crear usuario"
  }, /*#__PURE__*/React.createElement(UserForm, {
    formId: formId,
    onHandleSubmit: handleSubmit
  }));
};
export default UserFormModal;