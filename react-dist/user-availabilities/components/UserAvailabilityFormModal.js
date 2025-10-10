import React from 'react';
import UserAvailabilityForm from "./UserAvailabilityForm.js";
import { Dialog } from 'primereact/dialog';
const UserAvailabilityFormModal = ({
  show,
  handleSubmit,
  initialData,
  onHide
}) => {
  const formId = 'createUserAvailability';
  return /*#__PURE__*/React.createElement(Dialog, {
    visible: show,
    onHide: () => onHide?.(),
    header: "Crear Horarios de Atenci\xF3n",
    style: {
      width: '65vw'
    }
  }, /*#__PURE__*/React.createElement(UserAvailabilityForm, {
    formId: formId,
    onHandleSubmit: handleSubmit,
    initialData: initialData
  }));
};
export default UserAvailabilityFormModal;