import React from "react";
import { CategoriesForm } from "../form/CategoriesForm.js";
import { Dialog } from "primereact/dialog";
export const CategoriesFormModal = ({
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
  }, /*#__PURE__*/React.createElement(CategoriesForm, {
    onHandleSubmit: handleSubmit,
    initialData: initialData
  }));
};