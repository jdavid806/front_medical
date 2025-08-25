import React, { useState } from "react";
import { CustomModal } from "../../../components/CustomModal.js";
import DepreciationAppreciationForm from "../form/DepreciationAppreciationForm.js";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
const DepreciationAppreciationModal = ({
  isVisible,
  onSave,
  onClose,
  asset,
  closable = true
}) => {
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      await onSave(data);
      onClose();
    } finally {
      setLoading(false);
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CustomModal, {
    show: isVisible,
    onHide: handleCloseAttempt,
    title: `${asset.attributes.description} - Ajuste de Valor`
  }, /*#__PURE__*/React.createElement(DepreciationAppreciationForm, {
    formId: "depreciationAppreciationForm",
    onSubmit: handleSave,
    onCancel: handleCloseAttempt,
    loading: loading,
    currentValue: asset.currentValue
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
export default DepreciationAppreciationModal;