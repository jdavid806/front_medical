import React from 'react';
import UserAvailabilityForm from "./UserAvailabilityForm.js";
import { CustomModal } from "../../components/CustomModal.js";
const UserAvailabilityFormModal = ({
  show,
  handleSubmit,
  initialData,
  onHide
}) => {
  const formId = 'createUserAvailability';
  return /*#__PURE__*/React.createElement(CustomModal, {
    show: show,
    onHide: onHide,
    title: "Crear Horarios de Atenci\xF3n"
  }, /*#__PURE__*/React.createElement(UserAvailabilityForm, {
    formId: formId,
    onHandleSubmit: handleSubmit,
    initialData: initialData
  }));
};
export default UserAvailabilityFormModal;