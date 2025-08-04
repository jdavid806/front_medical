import React from "react";
import { ComissionForm } from "./Comissions.js";
import { CustomFormModal } from "../components/CustomFormModal.js";
export const ComissionFormModal = ({
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
  }, /*#__PURE__*/React.createElement(ComissionForm, {
    formId: formId,
    onHandleSubmit: handleSubmit,
    initialData: initialData
  }));
};