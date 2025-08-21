import React from 'react';
import { CustomModal } from "../../../components/CustomModal.js";
import PricesConfigForm from "../form/PricesConfigForm.js";
const PricesConfigFormModal = ({
  show,
  handleSubmit,
  initialData,
  onHide,
  entitiesData
}) => {
  const formId = 'createUserAvailability';
  return /*#__PURE__*/React.createElement(CustomModal, {
    show: show,
    onHide: onHide,
    title: initialData ? 'Editar Precio' : 'Nuevo Precio'
  }, /*#__PURE__*/React.createElement(PricesConfigForm, {
    formId: formId,
    onHandleSubmit: handleSubmit,
    initialData: initialData,
    onCancel: onHide,
    entitiesData: entitiesData
  }));
};
export default PricesConfigFormModal;