import React from "react";
import { MassMessageForm } from "./MassMessageForm.js";
import { CustomFormModal } from "../../components/CustomFormModal.js";
export const MassMessageFormModal = ({
  title,
  show,
  handleSubmit,
  onHide,
  initialData
}) => {
  const formId = "createDoctor";
  return /*#__PURE__*/React.createElement(CustomFormModal, {
    show: show,
    formId: formId,
    onHide: onHide,
    title: title
  }, /*#__PURE__*/React.createElement(MassMessageForm, {
    formId: formId,
    onHandleSubmit: handleSubmit,
    initialData: initialData
  }));
};