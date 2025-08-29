import React from 'react';
import { CustomFormModal } from "../../components/CustomFormModal.js";
import { TicketReasonForm } from "./TicketReasonForm.js";
export const TicketReasonFormModal = ({
  title = 'Crear motivo de consulta',
  show,
  handleSubmit,
  onHide,
  initialData
}) => {
  const formId = 'ticketReasonForm';
  return /*#__PURE__*/React.createElement(CustomFormModal, {
    show: show,
    onHide: onHide,
    formId: formId,
    title: title,
    scrollable: true
  }, /*#__PURE__*/React.createElement(TicketReasonForm, {
    formId: formId,
    onHandleSubmit: handleSubmit,
    initialData: initialData
  }));
};