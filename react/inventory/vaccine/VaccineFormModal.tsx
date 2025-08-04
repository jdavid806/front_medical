import React from "react";
import { CustomModal } from "../../components/CustomModal";
import VaccineForm from "./VaccineForm";
import { InventoryService } from "../../../services/api/classes/inventoryServices";
import { ErrorHandler } from "../../../services/errorHandler";
import { SwalManager } from "../../../services/alertManagerImported";
import { VaccineFormInputs } from "./interfaces/VaccineForm";

interface VaccineFormModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess?: () => void;
}

export const VaccineFormModal: React.FC<VaccineFormModalProps> = ({
  show,
  onHide,
  onSuccess,
  
}) => {
  const inventoryService = new InventoryService();
  const formId = "vaccine-form-modal";

  const handleSubmit = async (data: VaccineFormInputs) => {
    try {
      const payload = {
        name: data.name,
        reference: data.reference,
        brand_id: data.brand,
        sanitary_registration: data.sanitary_registration,
        weight: data.weight || 0,
        concentration: data.concentration || "",
        minimum_stock: Number(data.minimum_stock) || 0,
        maximum_stock: Number(data.maximum_stock) || 0,
        sale_price: Number(data.sale_price) || 0,
      };

      await inventoryService.createVaccine(payload);

      SwalManager.success();

      onHide();
      onSuccess?.();
    } catch (error) {
      console.log(error);
      ErrorHandler.generic(error);
      throw error;
    }
  };

  return (
    <CustomModal show={show} onHide={onHide} title="Crear Nueva Vacuna">
      <VaccineForm formId={formId} onHandleSubmit={handleSubmit} />
    </CustomModal>
  );
};

export default VaccineFormModal;
