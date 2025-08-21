import React, { useState } from "react";
import { CustomModal } from "../../../components/CustomModal.js";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import TaxConfigForm from "../form/taxConfigForm.js";
const TaxConfigModal = ({
  isVisible,
  onSave,
  initialData,
  onClose,
  closable = true,
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
  const handleConfirmClose = () => {
    setShowConfirm(false);
    onClose();
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
    title: modalTitle,
    size: "lg"
  }, /*#__PURE__*/React.createElement(TaxConfigForm, {
    formId: "taxForm",
    onSubmit: handleSave,
    initialData: initialData,
    onCancel: handleCloseAttempt,
    loading: loading
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
export default TaxConfigModal;