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

  // Verificar si asset está definido
  if (!asset) {
    console.error("Asset is undefined in MaintenanceModal");
    return null;
  }

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

  const assetDescription = asset?.attributes?.description || "Activo sin nombre";
  const currentStatus = asset?.attributes?.status || "";

  return (
    <>
      <Dialog
        visible={isVisible}
        onHide={handleCloseAttempt}
        header={`${assetDescription} - Mantenimiento y Estado`}
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
          currentStatus={currentStatus}
          asset={asset}
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