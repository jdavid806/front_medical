import React from 'react';
import { CustomModal } from "../../../components/CustomModal.js";
import PricesConfigForm from "../form/PricesConfigForm.js";
const PricesConfigFormModal = ({
  show,
  handleSubmit,
  initialData,
  onHide
}) => {
  const formId = 'createUserAvailability';
  return /*#__PURE__*/React.createElement(CustomModal, {
    show: show,
    onHide: onHide,
    title: "Configurar Precios"
  }, /*#__PURE__*/React.createElement(PricesConfigForm, {
    formId: formId,
    onHandleSubmit: handleSubmit,
    initialData: initialData
  }));
};
export default PricesConfigFormModal;