import React from "react";
import { CustomModal } from "../../components/CustomModal.js";
import MedicationForm from "./MedicationForm.js";
import { InventoryService } from "../../../services/api/classes/inventoryServices.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const MedicationFormModal = ({
  show,
  onHide,
  onSuccess
}) => {
  const inventoryService = new InventoryService();
  const formId = "medication-form-modal";
  const handleSubmit = async data => {
    try {
      const payload = {
        name: data.name,
        description: data.description || "",
        weight: data.weight || 0,
        capacity: data.capacity || 0,
        minimum_stock: Number(data.minimum_stock) || 0,
        maximum_stock: Number(data.maximum_stock) || 0,
        sale_price: Number(data.sale_price) || 0,
        presentation: data.presentation || ""
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CustomModal, {
    show: show,
    onHide: onHide,
    title: "Crear Nuevo Medicamento"
  }, /*#__PURE__*/React.createElement(MedicationForm, {
    formId: formId,
    onHandleSubmit: handleSubmit
  })));
};
export default MedicationFormModal;