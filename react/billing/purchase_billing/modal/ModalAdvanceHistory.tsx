import React from "react";
import { CustomModal } from "../../../components/CustomModal";
import AdvanceHistoryForm from "./FormAdvanceHistory";
import { Button } from "primereact/button";

interface AdvancePayment {
  id: string;
  date: string;
  amount: number;
  available_amount: number;
  payment_method: string;
  reference: string;
  amount_to_use?: number;
}

interface AdvanceHistoryModalProps {
  show: boolean;
  customerId: number | null;
  invoiceTotal: number;
  onSelectAdvances: (selectedAdvances: AdvancePayment[]) => void;
  onHide?: () => void;
}

const AdvanceHistoryModal: React.FC<AdvanceHistoryModalProps> = ({
  show,
  customerId,
  invoiceTotal,
  onSelectAdvances,
  onHide,
}) => {
  const handleConfirmSelection = (selectedAdvances: AdvancePayment[]) => {
    onSelectAdvances(selectedAdvances);
    if (onHide) onHide();
  };

  return (
    <CustomModal
      show={show}
      onHide={onHide}
      title="Anticipos del Cliente"
      size="lg"
      footer={
        <div>
          <Button
            label="Cancelar"
            icon="pi pi-times"
            onClick={onHide}
            className="p-button-text"
          />
          <Button
            label="Aplicar anticipos"
            icon="pi pi-check"
            onClick={() => handleConfirmSelection}
            disabled={false} // La validación se maneja en el formulario
          />
        </div>
      }
    >
      <AdvanceHistoryForm
        customerId={customerId}
        invoiceTotal={invoiceTotal}
        onSelectAdvances={handleConfirmSelection}
      />
    </CustomModal>
  );
};

export default AdvanceHistoryModal;
