import React from "react";
import { CustomModal } from "../../../components/CustomModal";
import { OptometryBillingForm } from "../form/OptometryBillingForm";

interface OptometryBillingModalProps {
  receiptId: 0,
  show: boolean;
  onHide: () => void;
  onSaveSuccess?: () => void;
}

export const OptometryBillingModal: React.FC<OptometryBillingModalProps> = ({
  receiptId,
  show,
  onHide,
  onSaveSuccess,
}) => {
  const handleSaveSuccess = () => {
    if (onSaveSuccess) onSaveSuccess();
    onHide();
  };

  return (
    <CustomModal show={show} onHide={onHide} title="Facturación de optometría">
      <OptometryBillingForm receiptId={receiptId} />
    </CustomModal>
  );
};
