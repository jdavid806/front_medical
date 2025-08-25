import React from "react";
import { ConsentimientoForm } from "./ConsentimientoForm.js";
import { Dialog } from "primereact/dialog";
export const ConsentimientoFormModal = ({
  title,
  show,
  handleSubmit,
  onHide,
  initialData
}) => {
  return /*#__PURE__*/React.createElement(Dialog, {
    visible: show,
    onHide: onHide ?? (() => {}),
    header: title,
    style: {
      width: '70vw'
    }
  }, /*#__PURE__*/React.createElement(ConsentimientoForm, {
    onHandleSubmit: handleSubmit,
    initialData: initialData
  }));
};