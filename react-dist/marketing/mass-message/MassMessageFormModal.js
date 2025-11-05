import React from "react";
import { MassMessageForm } from "./MassMessageForm.js";
export const MassMessageFormModal = ({
  handleSubmit,
  initialData
}) => {
  const formId = "createMassMessageForm";
  return /*#__PURE__*/React.createElement(MassMessageForm, {
    formId: formId,
    onHandleSubmit: handleSubmit,
    initialData: initialData
  });
};