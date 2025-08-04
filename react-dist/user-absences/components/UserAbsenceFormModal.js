import React from 'react';
import { CustomFormModal } from "../../components/CustomFormModal.js";
import { UserAbsenceForm } from "./UserAbsenceForm.js";
export const UserAbsenceFormModal = ({
  show,
  handleSubmit,
  onHide,
  initialData
}) => {
  const formId = 'createUserAbsence';
  return /*#__PURE__*/React.createElement(CustomFormModal, {
    show: show,
    onHide: onHide,
    formId: formId,
    title: "Crear ausencia programada"
  }, /*#__PURE__*/React.createElement(UserAbsenceForm, {
    formId: formId,
    onHandleSubmit: handleSubmit,
    initialData: initialData
  }));
};