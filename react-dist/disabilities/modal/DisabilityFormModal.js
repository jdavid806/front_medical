import React, { useRef } from "react";
import { DisabilityForm } from "../form/DisabilityForm.js";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
export const DisabilityFormModal = ({
  title,
  show,
  handleSubmit,
  onHide,
  initialData
}) => {
  const formId = "disabilityForm";
  const ref = useRef(null);
  const reset = () => {
    ref.current?.resetForm();
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    visible: show,
    onHide: onHide ?? (() => {}),
    header: title,
    style: {
      width: '70vw'
    }
  }, /*#__PURE__*/React.createElement(DisabilityForm, {
    onHandleSubmit: handleSubmit,
    initialData: initialData,
    ref: ref,
    formId: formId
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end mt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    type: "button",
    className: "p-button-text w-30",
    onClick: () => reset()
  }), /*#__PURE__*/React.createElement(Button, {
    label: initialData?.isEditing ? "Actualizar" : "Guardar",
    icon: "pi pi-check",
    type: "submit",
    className: "w-30 ml-2",
    form: formId
  })));
};