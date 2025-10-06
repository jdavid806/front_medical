import React from "react";
import { Dialog } from "primereact/dialog";
export const DisabilityFormModal = ({
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
  }, /*#__PURE__*/React.createElement(DisabilityForm, {
    onHandleSubmit: handleSubmit,
    initialData: initialData
  }));
};