import React, { useState } from "react";
import { CustomModal } from "../../components/CustomModal";
import ExpirationLotForm, {
  ExpirationLotFormInputs,
} from "./ExpirationLotForm";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

interface ExpirationLotModalProps {
  isVisible: boolean;
  onSave: (data: ExpirationLotFormInputs) => void;
  initialData?: ExpirationLotFormInputs;
  onClose: () => void;
  productName?: string;
  closable?: boolean;
}

const ExpirationLotModal: React.FC<ExpirationLotModalProps> = ({
  isVisible,
  onSave,
  initialData,
  onClose,
  productName,
  closable = true,
}) => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCloseAttempt = () => {
    setShowConfirm(true);
  };

  const handleConfirmClose = () => {
    setShowConfirm(false);
    onClose();
  };

  const handleSave = async (data: ExpirationLotFormInputs) => {
    setLoading(true);
    try {
      await onSave(data);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleNoRegister = () => {
    onClose(); // Cierra el modal inmediatamente
  };

  return (
    <>
      <CustomModal
        show={isVisible}
        onHide={handleCloseAttempt}
        title={`Registrar Lote - ${productName || "Producto"}`}
      >
        <ExpirationLotForm formId="expirationLotForm" onSubmit={handleSave} />

        <div className="d-flex justify-content-center gap-8 mt-2">
          <Button
            label="No registrar Lote"
            className="p-button-danger"
            onClick={handleNoRegister}
            disabled={loading}
          />
          <Button
            label="Cancelar"
            className="p-button-text"
            onClick={handleCloseAttempt}
            disabled={loading}
          />
        </div>
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

export default ExpirationLotModal;
