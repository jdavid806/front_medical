import React from 'react';
import { CustomFormModal } from "../../components/CustomFormModal.js";
import { ExamCategoryForm } from "./ExamCategoryForm.js";
export const ExamCategoryFormModal = ({
  title = 'Crear categoría de examen',
  show,
  handleSubmit,
  onHide,
  initialData
}) => {
  const formId = 'createExamCategory';
  return /*#__PURE__*/React.createElement(CustomFormModal, {
    show: show,
    onHide: onHide,
    formId: formId,
    title: title
  }, /*#__PURE__*/React.createElement(ExamCategoryForm, {
    formId: formId,
    onHandleSubmit: handleSubmit,
    initialData: initialData
  }));
};