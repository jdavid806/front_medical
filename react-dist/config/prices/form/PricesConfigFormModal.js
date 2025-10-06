import React from 'react';
import PricesConfigForm from "../form/PricesConfigForm.js";
import { Dialog } from 'primereact/dialog';
const PricesConfigFormModal = ({
  show,
  handleSubmit,
  initialData,
  onHide,
  entitiesData
}) => {
  const formId = 'createUserAvailability';
  return /*#__PURE__*/React.createElement(Dialog, {
    visible: show,
    onHide: () => onHide?.(),
    header: initialData ? 'Editar Precio' : 'Nuevo Precio',
    appendTo: document.body,
    style: {
      width: '75vw'
    }
  }, /*#__PURE__*/React.createElement(PricesConfigForm, {
    formId: formId,
    onHandleSubmit: handleSubmit,
    initialData: initialData,
    onCancel: onHide,
    entitiesData: entitiesData
  }));
};
export default PricesConfigFormModal;