import React, { useState } from "react";
import { CustomModal } from "../../../components/CustomModal";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import PaymentMethodFormConfig from "../form/PaymentMethodFormConfig";

interface PaymentMethodModalProps {
  isVisible: boolean;
  onSave: (data: any) => void;
  initialData?: any;
  onClose: () => void;
  closable?: boolean;
  accounts: any[];
  isLoadingAccounts?: boolean;
  loading: boolean;
}

const PaymentMethodModalConfig: React.FC<PaymentMethodModalProps> = ({
  isVisible,
  onSave,
  initialData,
  onClose,
  closable = true,
  accounts,
  isLoadingAccounts = false,
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

  const handleConfirmClose = () => {
    setShowConfirm(false);
    onClose();
  };

  const handleSave = async (data: any) => {
    try {
      await onSave(data);
      onClose();
    } catch (error) {
    }
  };

  const modalTitle =
    initialData && initialData.name
      ? `Editar Método de Pago - ${initialData.name}`
      : "Nuevo Método de Pago";

  return (
    <>
      <CustomModal
        show={isVisible}
        onHide={handleCloseAttempt}
        title={modalTitle}
      >
        <PaymentMethodFormConfig
          formId="paymentMethodForm"
          onSubmit={handleSave}
          initialData={initialData}
          onCancel={handleCloseAttempt}
          loading={loading}
          accounts={accounts}
          isLoadingAccounts={isLoadingAccounts}
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

export default PaymentMethodModalConfig;