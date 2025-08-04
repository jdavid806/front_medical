// components/taxes/TaxConfigModal.tsx
import React, { useState } from "react";
import { CustomModal } from "../../../components/CustomModal";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { TaxModalProps } from "../interfaces/TaxesModalType";
import TaxFormConfig from "../form/TaxesConfigForm";

const TaxConfigModal: React.FC<TaxModalProps> = ({
  isVisible,
  onSave,
  initialData,
  onClose,
  closable = true,
  accounts,
  loading,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [formHasChanges, setFormHasChanges] = useState(false);

  const handleCloseAttempt = () => {
    if (closable) {
      if (formHasChanges) {
        setShowConfirm(true);
      } else {
        onClose();
      }
    }
  };


  const handleSave = async (data: any) => {
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error("Error saving tax:", error);
    }
  };

  const modalTitle =
    initialData && initialData.name
      ? `Editar Impuesto - ${initialData.name}`
      : "Nuevo Impuesto";

  return (
    <>
      <CustomModal
        show={isVisible}
        onHide={handleCloseAttempt}
        title={modalTitle}
      >
        <TaxFormConfig
          formId="taxForm"
          onSubmit={handleSave}
          initialData={initialData}
          onCancel={handleCloseAttempt}
          loading={loading}
          accounts={accounts}
        />
      </CustomModal>

    
    </>
  );
};

export default TaxConfigModal;