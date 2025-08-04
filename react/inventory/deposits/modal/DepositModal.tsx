import React, { useState } from "react";
import { CustomModal } from "../../../components/CustomModal";
import DepositForm from "../form/DepositForm";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { DepositModalProps } from "../ts/depositModalType";

const DepositModal: React.FC<DepositModalProps> = ({
  isVisible,
  onSave,
  initialData,
  onClose,
  closable = true,
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

  const handleSave = async (data: any) => {
    setLoading(true);
    try {
      await onSave(data);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // Determinar el título basado en si hay initialData (edición) o no (nuevo)
  const modalTitle =
    initialData && initialData.name
      ? `Editar Depósito - ${initialData.name}`
      : "Nuevo Depósito";

  return (
    <>
      <CustomModal
        show={isVisible}
        onHide={handleCloseAttempt}
        title={modalTitle} // Título dinámico aquí
      >
        <DepositForm
          formId="depositForm"
          onSubmit={handleSave}
          initialData={initialData || undefined}
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

export default DepositModal;
