import React, { useState } from "react";
import { CustomModal } from "../../../components/CustomModal.js";
import FixedAssetsForm from "../form/FixedAssetsForm.js";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useCreateAsset } from "../hooks/useCreateAsset.js";
import { userService } from "../../../../services/api/index.js";
const FixedAssetsModal = ({
  isVisible,
  onSave,
  initialData,
  onClose,
  assetName,
  closable = true
}) => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    loading: loadingCreate,
    createAsset
  } = useCreateAsset();
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
      //await onSave(data);
      const currentUser = await userService.getLoggedUser();
      data.user_id = currentUser.id;
      console.log(data);
      await createAsset(data);
      onClose();
    } finally {
      setLoading(false);
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CustomModal, {
    show: isVisible,
    onHide: handleCloseAttempt,
    title: `Registrar Activo Fijo - ${assetName || "Nuevo Activo"}`
  }, /*#__PURE__*/React.createElement(FixedAssetsForm, {
    formId: "fixedAssetsForm",
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
export default FixedAssetsModal;