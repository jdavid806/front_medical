import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { BranchForm } from "../form/BranchForm";
import { CustomModal } from "../../../../components/CustomModal";

interface BranchFormModalProps {
  title: string;
  show: boolean;
  handleSubmit: (data: any) => void;
  initialData?: any;
  onHide?: () => void;
  closable?: boolean;
  loading?: boolean;
}

export const BranchFormModal: React.FC<BranchFormModalProps> = ({
  title,
  show,
  handleSubmit,
  onHide,
  initialData,
  closable = true,
  loading = false,
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

  const handleSave = async (data: any) => {
    try {
      await handleSubmit(data);
      onHide?.();
    } catch (error) {
      console.error("Error saving branch:", error);
    }
  };

  const modalTitle =
    initialData && initialData.name
      ? `Editar Sucursal - ${initialData.name}`
      : "Nueva Sucursal";

  return (
    <>
      <CustomModal
        show={show}
        onHide={handleCloseAttempt}
        title={modalTitle}
        size="lg"
      >
        <BranchForm
          onHandleSubmit={handleSave}
          initialData={initialData}
          onCancel={handleCloseAttempt}
          loading={loading}
          onFormChange={setFormHasChanges}
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