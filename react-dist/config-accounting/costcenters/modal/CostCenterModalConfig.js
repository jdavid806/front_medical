import React, { useState, useEffect } from "react";
import { CustomModal } from "../../../components/CustomModal.js";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import CostCenterFormConfig from "../form/CostCenterFormConfig.js";
const CostCenterModalConfig = ({
  isVisible,
  onSave,
  initialData,
  onClose,
  closable = true,
  loading = false
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [formHasChanges, setFormHasChanges] = useState(false);

  // Resetear el estado de cambios cuando se cierra el modal
  useEffect(() => {
    if (!isVisible) {
      setFormHasChanges(false);
    }
  }, [isVisible]);
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
      console.error("Error saving cost center:", error);
    }
  };
  const modalTitle = initialData?.name ? `Editar Centro de Costo - ${initialData.name}` : "Nuevo Centro de Costo";
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CustomModal, {
    show: isVisible,
    onHide: handleCloseAttempt,
    title: modalTitle
  }, /*#__PURE__*/React.createElement(CostCenterFormConfig, {
    formId: "costCenterForm",
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
export default CostCenterModalConfig;