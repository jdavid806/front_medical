import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { BranchForm } from "../form/BranchForm.js";
import { CustomModal } from "../../../../components/CustomModal.js";
export const BranchFormModal = ({
  title,
  show,
  handleSubmit,
  onHide,
  initialData,
  closable = true,
  loading = false
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [formHasChanges, setFormHasChanges] = useState(false);
  const handleCloseAttempt = () => {
    if (closable) {
      if (formHasChanges) {
        setShowConfirm(true);
      } else {
        onHide?.();
      }
    }
  };
  const handleConfirmClose = () => {
    setShowConfirm(false);
    onHide?.();
  };
  const handleSave = async data => {
    try {
      await handleSubmit(data);
      onHide?.();
    } catch (error) {
      console.error("Error saving branch:", error);
    }
  };
  const modalTitle = initialData && initialData.name ? `Editar Sucursal - ${initialData.name}` : "Nueva Sucursal";
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CustomModal, {
    show: show,
    onHide: handleCloseAttempt,
    title: modalTitle,
    size: "lg"
  }, /*#__PURE__*/React.createElement(BranchForm, {
    onHandleSubmit: handleSave,
    initialData: initialData,
    onCancel: handleCloseAttempt,
    loading: loading,
    onFormChange: setFormHasChanges
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