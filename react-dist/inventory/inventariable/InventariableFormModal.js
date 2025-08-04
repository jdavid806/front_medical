import React from "react";
import { CustomModal } from "../../components/CustomModal.js";
import { InventoryService } from "../../../services/api/classes/inventoryServices.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import InventariableForm from "./InventariableForm.js";
export const InventariableFormModal = ({
  show,
  onHide,
  onSuccess
}) => {
  const inventoryService = new InventoryService();
  const formId = "inventariable-form-modal";
  const handleSubmit = async data => {
    try {
      const payload = {
        name: data.name,
        //category_product_id: data.category,
        reference: data.reference,
        minimum_stock: Number(data.minimum_stock) || 0,
        maximum_stock: Number(data.maximum_stock) || 0,
        description: data.description || "",
        //weight: data.weight || 0,
        brand_id: data.brand || "",
        sale_price: Number(data.sale_price) || 0
      };

      // console.log("Payload para API:", payload);
      await inventoryService.createInventariable(payload);
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
    title: "Crear Nuevo Producto Inventariable"
  }, /*#__PURE__*/React.createElement(InventariableForm, {
    formId: formId,
    onHandleSubmit: handleSubmit
  }));
};