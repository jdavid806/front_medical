import React from "react";
import { BrandForm } from "../form/BrandForm.js";
import { Dialog } from "primereact/dialog";
export const BrandFormModal = ({
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
  }, /*#__PURE__*/React.createElement(BrandForm, {
    onHandleSubmit: handleSubmit,
    initialData: initialData
  }));
};