import React from "react";
import { CustomModal } from "../../components/CustomModal";
import { InventoryService } from "../../../services/api/classes/inventoryServices";
import { ErrorHandler } from "../../../services/errorHandler";
import { SwalManager } from "../../../services/alertManagerImported";
import { SupplyFormInputs } from "./interfaces/SupplyForm";
import SupplyForm from "./SupplyForm";

interface SupplyFormModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess?: () => void;
}

export const SupplyFormModal: React.FC<SupplyFormModalProps> = ({
  show,
  onHide,
  onSuccess,
}) => {
  const inventoryService = new InventoryService();
  const formId = "supply-form-modal";

  const handleSubmit = async (data: SupplyFormInputs) => {
    try {
      const payload = {
        name: data.name,
        category_product_id: data.category,
        presentation: data.presentation,
        minimum_stock: Number(data.minimum_stock) || 0,
        maximum_stock: Number(data.maximum_stock) || 0,
        description: data.description || "",
        weight: data.weight || 0,
        brand_id: data.brand || "",
        sale_price: Number(data.sale_price) || 0,
      };

      // console.log("Payload para API:", payload);
      await inventoryService.createSupply(payload);

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
    <CustomModal show={show} onHide={onHide} title="Crear Nuevo Insumo">
      <SupplyForm formId={formId} onHandleSubmit={handleSubmit} />
    </CustomModal>
  );
};

export default SupplyFormModal;
