import { useState } from "react";
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
import { taxesService } from "../../../../services/api/index.js";
export const useTaxesCreateTable = () => {
  const [loading, setLoading] = useState(false);
  const createTax = async data => {
    // Acepta CreateTaxDTO directamente
    setLoading(true);
    try {
      const response = await taxesService.storeTax(data);
      SwalManager.success("Impuesto creado exitosamente");
      return response;
    } catch (error) {
      console.error("Error creating tax:", error);
      ErrorHandler.getErrorMessage(error);
      SwalManager.error("Error al crear impuesto");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    createTax
  };
};