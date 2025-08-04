// modal/RetentionModalConfig.tsx
import React, { useState } from "react";
import { CustomModal } from "../../../components/CustomModal";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import RetentionFormConfig from "../form/RetentionFormConfig";
import { RetentionModalProps } from "../interfaces/RetentionModalConfigType";
import { RetentionFormInputs } from "../interfaces/RetentionDTO";

const RetentionModalConfig: React.FC<RetentionModalProps> = ({
  isVisible,
  onSave,
  initialData,
  onClose,
  closable = true,
  accounts,
  loading = false,
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

  const handleSave = async (data: RetentionFormInputs) => {
    try {
      await onSave(data);
      onClose();
    } finally {
      // Handle any cleanup if needed
    }
  };

  const modalTitle = initialData?.name
    ? `Editar Retención - ${initialData.name}`
    : "Nueva Retención";

  return (
    <>
      <CustomModal
        show={isVisible}
        onHide={handleCloseAttempt}
        title={modalTitle}
      >
        <RetentionFormConfig
          formId="retentionForm"
          onSubmit={handleSave}
          initialData={initialData}
          onCancel={handleCloseAttempt}
          loading={loading}
          accounts={accounts}
        />
      </CustomModal>

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

export default RetentionModalConfig;
