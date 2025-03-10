import React from 'react';
import { CustomFormModal } from "../../components/CustomFormModal.js";
import { ModuleForm } from "./ModuleForm.js";
export const ModuleFormModal = ({
  show,
  handleSubmit,
  onHide,
  initialData
}) => {
  const formId = 'createModule';
  return /*#__PURE__*/React.createElement(CustomFormModal, {
    show: show,
    onHide: onHide,
    formId: formId,
    title: "Crear M\xF3dulo"
  }, /*#__PURE__*/React.createElement(ModuleForm, {
    formId: formId,
    onHandleSubmit: handleSubmit,
    initialData: initialData
  }));
};