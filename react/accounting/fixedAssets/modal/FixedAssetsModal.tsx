import React, { useState } from "react";
import { CustomModal } from "../../../components/CustomModal";
import FixedAssetsForm from "../form/FixedAssetsForm";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { FixedAssetsModalProps } from "../interfaces/FixedAssetsModalTypes";
import { FixedAssetsFormInputs } from "../interfaces/FixedAssetsFormTypes";
import { useCreateAsset } from "../hooks/useCreateAsset";
import { userService } from "../../../../services/api";
import { getJWTPayload } from "../../../../services/utilidades";


const FixedAssetsModal: React.FC<FixedAssetsModalProps> = ({
  isVisible,
  onSave,
  initialData,
  onClose,
  assetName,
  closable = true,
}) => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { loading: loadingCreate, createAsset } = useCreateAsset();

  const handleCloseAttempt = () => {
    if (closable) {
      setShowConfirm(true);
    }
  };

  const handleConfirmClose = () => {
    setShowConfirm(false);
    onClose();
  };

  const handleSave = async (data: FixedAssetsFormInputs) => {
    setLoading(true);
    try {
      //await onSave(data);
      const currentUser = await userService.getLoggedUser();
      data.user_id = currentUser.id

      console.log(data);
      await createAsset(data);

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
        title={`Registrar Activo Fijo - ${assetName || "Nuevo Activo"}`}
      >
        <FixedAssetsForm
          formId="fixedAssetsForm"
          onSubmit={handleSave}
          initialData={initialData}
          onCancel={handleCloseAttempt}
          loading={loading}
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

export default FixedAssetsModal;
