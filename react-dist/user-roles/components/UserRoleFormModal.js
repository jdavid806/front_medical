import React from 'react';
import { CustomFormModal } from "../../components/CustomFormModal.js";
import { UserRoleForm } from "./UserRoleForm.js";
export const UserRoleFormModal = ({
  title = 'Crear examen',
  show,
  handleSubmit,
  onHide,
  initialData
}) => {
  const formId = 'createExamType';
  return /*#__PURE__*/React.createElement(CustomFormModal, {
    show: show,
    onHide: onHide,
    formId: formId,
    title: title,
    scrollable: true
  }, /*#__PURE__*/React.createElement(UserRoleForm, {
    formId: formId,
    onHandleSubmit: handleSubmit,
    initialData: initialData
  }));
};