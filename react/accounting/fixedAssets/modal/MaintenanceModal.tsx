// components/MaintenanceModal.tsx
import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import {
  MaintenanceFormInputs,
  MaintenanceModalProps,
} from "../interfaces/MaintenanceFormTypes";
import MaintenanceForm from "../form/MaintenanceForm";

const MaintenanceModal: React.FC<MaintenanceModalProps> = ({
  isVisible,
  onSave,
  onClose,
  asset,
  closable = true,
  statusOptions,
  maintenanceTypeOptions,
  userOptions,
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

  const handleSave = async (data: MaintenanceFormInputs) => {
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
      <Dialog
        visible={isVisible}
        onHide={handleCloseAttempt}
        header={`${asset.attributes.description} - Mantenimiento y Estado`}
        style={{ width: "50vw" }}
        modal
        className="p-fluid"
      >
        <MaintenanceForm
          formId="maintenanceForm"
          onSubmit={handleSave}
          onCancel={handleCloseAttempt}
          loading={loading}
          statusOptions={statusOptions}
          maintenanceTypeOptions={maintenanceTypeOptions}
          userOptions={userOptions}
          currentStatus={asset.attributes.status || ""}
          asset={asset} // <-- Pasar la propiedad asset
        />
      </Dialog>

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

export default MaintenanceModal;
