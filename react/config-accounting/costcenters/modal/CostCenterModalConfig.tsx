import React, { useState, useEffect } from "react";
import { CustomModal } from "../../../components/CustomModal";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { CostCenterModalProps } from "../interfaces/CostCenterConfigModalType";
import CostCenterFormConfig from "../form/CostCenterFormConfig";

const CostCenterModalConfig: React.FC<CostCenterModalProps> = ({
  isVisible,
  onSave,
  initialData,
  onClose,
  closable = true,
  loading = false,
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

  const handleSave = async (data: any) => {
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error("Error saving cost center:", error);
    }
  };


  const modalTitle = initialData?.name
    ? `Editar Centro de Costo - ${initialData.name}`
    : "Nuevo Centro de Costo";

  return (
    <>
      <CustomModal
        show={isVisible}
        onHide={handleCloseAttempt}
        title={modalTitle}
      >
        <CostCenterFormConfig
          formId="costCenterForm"
          onSubmit={handleSave}
          initialData={initialData}
          onCancel={handleCloseAttempt}
          loading={loading}
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

export default CostCenterModalConfig;