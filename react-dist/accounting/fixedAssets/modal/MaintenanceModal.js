// components/MaintenanceModal.tsx
import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import MaintenanceForm from "../form/MaintenanceForm.js";
const MaintenanceModal = ({
  isVisible,
  onSave,
  onClose,
  asset,
  closable = true,
  statusOptions,
  maintenanceTypeOptions,
  userOptions
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dialog, {
    visible: isVisible,
    onHide: handleCloseAttempt,
    header: `${asset.attributes.description} - Mantenimiento y Estado`,
    style: {
      width: "50vw"
    },
    modal: true,
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement(MaintenanceForm, {
    formId: "maintenanceForm",
    onSubmit: handleSave,
    onCancel: handleCloseAttempt,
    loading: loading,
    statusOptions: statusOptions,
    maintenanceTypeOptions: maintenanceTypeOptions,
    userOptions: userOptions,
    currentStatus: asset.attributes.status || "",
    asset: asset // <-- Pasar la propiedad asset
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
export default MaintenanceModal;