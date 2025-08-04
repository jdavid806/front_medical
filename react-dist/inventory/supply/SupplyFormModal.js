import React from "react";
import { CustomModal } from "../../components/CustomModal.js";
import { InventoryService } from "../../../services/api/classes/inventoryServices.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import SupplyForm from "./SupplyForm.js";
export const SupplyFormModal = ({
  show,
  onHide,
  onSuccess
}) => {
  const inventoryService = new InventoryService();
  const formId = "supply-form-modal";
  const handleSubmit = async data => {
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
        sale_price: Number(data.sale_price) || 0
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
  return /*#__PURE__*/React.createElement(CustomModal, {
    show: show,
    onHide: onHide,
    title: "Crear Nuevo Insumo"
  }, /*#__PURE__*/React.createElement(SupplyForm, {
    formId: formId,
    onHandleSubmit: handleSubmit
  }));
};
export default SupplyFormModal;