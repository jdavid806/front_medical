import React from "react";
import { BranchForm } from "../form/BranchForm.js";
import { Dialog } from "primereact/dialog";
export const BranchFormModal = ({
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
  }, /*#__PURE__*/React.createElement(BranchForm, {
    onHandleSubmit: handleSubmit,
    initialData: initialData
  }));
};