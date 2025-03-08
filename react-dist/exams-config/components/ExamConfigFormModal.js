import React from 'react';
import { CustomFormModal } from "../../components/CustomFormModal.js";
import { ExamConfigForm } from "./ExamConfigForm.js";
export const ExamConfigFormModal = ({
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
    title: title
  }, /*#__PURE__*/React.createElement(ExamConfigForm, {
    formId: formId,
    onHandleSubmit: handleSubmit,
    initialData: initialData
  }));
};