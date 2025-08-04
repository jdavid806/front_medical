// components/taxes/TaxConfigModal.tsx
import React, { useState } from "react";
import { CustomModal } from "../../../components/CustomModal.js";
import TaxFormConfig from "../form/TaxesConfigForm.js";
const TaxConfigModal = ({
  isVisible,
  onSave,
  initialData,
  onClose,
  closable = true,
  accounts,
  loading
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [formHasChanges, setFormHasChanges] = useState(false);
  const handleCloseAttempt = () => {
    if (closable) {
      if (formHasChanges) {
        setShowConfirm(true);
      } else {
        onClose();
      }
    }
  };
  const handleSave = async data => {
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error("Error saving tax:", error);
    }
  };
  const modalTitle = initialData && initialData.name ? `Editar Impuesto - ${initialData.name}` : "Nuevo Impuesto";
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CustomModal, {
    show: isVisible,
    onHide: handleCloseAttempt,
    title: modalTitle
  }, /*#__PURE__*/React.createElement(TaxFormConfig, {
    formId: "taxForm",
    onSubmit: handleSave,
    initialData: initialData,
    onCancel: handleCloseAttempt,
    loading: loading,
    accounts: accounts
  })));
};
export default TaxConfigModal;