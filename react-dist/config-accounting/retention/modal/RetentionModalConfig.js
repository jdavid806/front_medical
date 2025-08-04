// modal/RetentionModalConfig.tsx
import React, { useState } from "react";
import { CustomModal } from "../../../components/CustomModal.js";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import RetentionFormConfig from "../form/RetentionFormConfig.js";
const RetentionModalConfig = ({
  isVisible,
  onSave,
  initialData,
  onClose,
  closable = true,
  accounts,
  loading = false
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const handleCloseAttempt = () => {
    if (closable) {
      setShowConfirm(true);
    }
  };
  const handleConfirmClose = () => {
    setShowConfirm(false);
    onClose();
  };
  const handleSave = async data => {
    try {
      await onSave(data);
      onClose();
    } finally {
      // Handle any cleanup if needed
    }
  };
  const modalTitle = initialData?.name ? `Editar Retención - ${initialData.name}` : "Nueva Retención";
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CustomModal, {
    show: isVisible,
    onHide: handleCloseAttempt,
    title: modalTitle
  }, /*#__PURE__*/React.createElement(RetentionFormConfig, {
    formId: "retentionForm",
    onSubmit: handleSave,
    initialData: initialData,
    onCancel: handleCloseAttempt,
    loading: loading,
    accounts: accounts
  })), /*#__PURE__*/React.createElement(Dialog, {
    visible: showConfirm,
    onHide: () => setShowConfirm(false),
    header: "Confirmar",
    footer: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
      label: "No",
      className: "p-button-text",
      onClick: () => setShowConfirm(false)
    }), /*#__PURE__*/React.createElement(Button, {
      label: "S\xED, descartar",
      className: "p-button-danger",
      onClick: handleConfirmClose
    }))
  }, /*#__PURE__*/React.createElement("p", null, "\xBFEst\xE1s seguro que deseas descartar los cambios?")));
};
export default RetentionModalConfig;