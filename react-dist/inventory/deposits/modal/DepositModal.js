import React, { useState } from "react";
import { CustomModal } from "../../../components/CustomModal.js";
import DepositForm from "../form/DepositForm.js";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
const DepositModal = ({
  isVisible,
  onSave,
  initialData,
  onClose,
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

  // Determinar el título basado en si hay initialData (edición) o no (nuevo)
  const modalTitle = initialData && initialData.name ? `Editar Depósito - ${initialData.name}` : "Nuevo Depósito";
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CustomModal, {
    show: isVisible,
    onHide: handleCloseAttempt,
    title: modalTitle // Título dinámico aquí
  }, /*#__PURE__*/React.createElement(DepositForm, {
    formId: "depositForm",
    onSubmit: handleSave,
    initialData: initialData || undefined,
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
export default DepositModal;