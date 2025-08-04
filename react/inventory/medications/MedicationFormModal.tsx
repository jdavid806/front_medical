import React from "react";
import { CustomModal } from "../../components/CustomModal";
import MedicationForm from "./MedicationForm";
import { InventoryService } from "../../../services/api/classes/inventoryServices";
import { ErrorHandler } from "../../../services/errorHandler";
import { SwalManager } from "../../../services/alertManagerImported";
import { MedicationFormInputs } from "./interfaces/MedicationForm";
import { MedicationFormModalProps } from "./interfaces/MedicationModal";



export const MedicationFormModal: React.FC<MedicationFormModalProps> = ({
  show,
  onHide,
  onSuccess,
}) => {
  const inventoryService = new InventoryService();
  const formId = "medication-form-modal";

  const handleSubmit = async (data: MedicationFormInputs) => {
    try {
      const payload = {
        name: data.name,
        description: data.description || "",
        weight: data.weight || 0,
        capacity: data.capacity || 0,
        minimum_stock: Number(data.minimum_stock) || 0,
        maximum_stock: Number(data.maximum_stock) || 0,
        sale_price: Number(data.sale_price) || 0,
        presentation: data.presentation || "",
      };
      
      await inventoryService.createMedication(payload);

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
    <>
      <CustomModal show={show} onHide={onHide} title="Crear Nuevo Medicamento">
        <MedicationForm formId={formId} onHandleSubmit={handleSubmit} />
      </CustomModal>
    </>
  );
};

export default MedicationFormModal;
