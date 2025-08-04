import React, { useState } from "react";
import { CustomModal } from "../../components/CustomModal.js";
import ExpirationLotForm from "./ExpirationLotForm.js";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
const ExpirationLotModal = ({
  isVisible,
  onSave,
  initialData,
  onClose,
  productName,
  closable = true
}) => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const handleCloseAttempt = () => {
    setShowConfirm(true);
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
  const handleNoRegister = () => {
    onClose(); // Cierra el modal inmediatamente
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CustomModal, {
    show: isVisible,
    onHide: handleCloseAttempt,
    title: `Registrar Lote - ${productName || "Producto"}`
  }, /*#__PURE__*/React.createElement(ExpirationLotForm, {
    formId: "expirationLotForm",
    onSubmit: handleSave
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center gap-8 mt-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "No registrar Lote",
    className: "p-button-danger",
    onClick: handleNoRegister,
    disabled: loading
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    className: "p-button-text",
    onClick: handleCloseAttempt,
    disabled: loading
  }))), /*#__PURE__*/React.createElement(Dialog, {
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
export default ExpirationLotModal;