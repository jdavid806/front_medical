import React from "react";
import { Dialog } from "primereact/dialog";
import AccountingClosingForm from "../form/AccountingClosingForm.js";
const AccountingClosingModal = ({
  isVisible,
  onSave,
  onClose,
  initialData
}) => {
  const modalTitle = initialData ? `Editar Período ${initialData.year}` : "Nuevo Período Contable";
  return /*#__PURE__*/React.createElement(Dialog, {
    visible: isVisible,
    onHide: onClose,
    header: modalTitle,
    style: {
      width: '50vw'
    },
    modal: true
  }, /*#__PURE__*/React.createElement(AccountingClosingForm, {
    initialData: initialData,
    onSubmit: onSave,
    onCancel: onClose
  }));
};
export default AccountingClosingModal;