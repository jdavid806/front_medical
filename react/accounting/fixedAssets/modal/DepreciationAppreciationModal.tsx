import React, { useState } from "react";
import { CustomModal } from "../../../components/CustomModal";
import DepreciationAppreciationForm from "../form/DepreciationAppreciationForm";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { FixedAsset } from "../interfaces/FixedAssetsTableTypes";
import { DepreciationAppreciationModalProps } from "../interfaces/DepreciationAppreciationModal";
import { DepreciationAppreciationFormInputs } from "../interfaces/DepreciationAppreciationFormType";

const DepreciationAppreciationModal: React.FC<
  DepreciationAppreciationModalProps
> = ({ isVisible, onSave, onClose, asset, closable = true }) => {
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

  const handleSave = async (data: DepreciationAppreciationFormInputs) => {
    setLoading(true);
    try {
      await onSave(data);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomModal
        show={isVisible}
        onHide={handleCloseAttempt}
        title={`${asset.attributes.description} - Ajuste de Valor`}
      >
        <DepreciationAppreciationForm
          formId="depreciationAppreciationForm"
          onSubmit={handleSave}
          onCancel={handleCloseAttempt}
          loading={loading}
          currentValue={asset.currentValue}
        />
      </CustomModal>

      {/* Diálogo de confirmación */}
      <Dialog
        visible={showConfirm}
        onHide={() => setShowConfirm(false)}
        header="Confirmar"
        footer={
          <div>
            <Button
              label="No"
              className="p-button-text"
              onClick={() => setShowConfirm(false)}
            />
            <Button
              label="Sí, descartar"
              className="p-button-danger"
              onClick={handleConfirmClose}
            />
          </div>
        }
      >
        <p>¿Estás seguro que deseas descartar los cambios?</p>
      </Dialog>
    </>
  );
};

export default DepreciationAppreciationModal;
