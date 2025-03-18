import React from 'react';
import UserForm from "./UserForm.js";
import { CustomFormModal } from "../components/CustomFormModal.js";
const UserFormModal = ({
  title,
  show,
  handleSubmit,
  onHide,
  initialData,
  config
}) => {
  const formId = 'createDoctor';
  return /*#__PURE__*/React.createElement(CustomFormModal, {
    show: show,
    formId: formId,
    onHide: onHide,
    title: title
  }, /*#__PURE__*/React.createElement(UserForm, {
    formId: formId,
    onHandleSubmit: handleSubmit,
    initialData: initialData,
    config: config
  }));
};
export default UserFormModal;