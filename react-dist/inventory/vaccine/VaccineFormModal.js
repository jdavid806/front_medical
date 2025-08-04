import React from "react";
import { CustomModal } from "../../components/CustomModal.js";
import VaccineForm from "./VaccineForm.js";
import { InventoryService } from "../../../services/api/classes/inventoryServices.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const VaccineFormModal = ({
  show,
  onHide,
  onSuccess
}) => {
  const inventoryService = new InventoryService();
  const formId = "vaccine-form-modal";
  const handleSubmit = async data => {
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
        sale_price: Number(data.sale_price) || 0
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
  return /*#__PURE__*/React.createElement(CustomModal, {
    show: show,
    onHide: onHide,
    title: "Crear Nueva Vacuna"
  }, /*#__PURE__*/React.createElement(VaccineForm, {
    formId: formId,
    onHandleSubmit: handleSubmit
  }));
};
export default VaccineFormModal;