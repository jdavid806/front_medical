import { useState } from 'react';
import { packagesService } from "../../../services/api/index.js";
import { usePRToast } from "../../hooks/usePRToast.js";
export const useUpdatePrescriptionPackage = () => {
  const [loading, setLoading] = useState(false);
  const {
    toast,
    showSuccessToast,
    showServerErrorsToast
  } = usePRToast();
  const updatePrescriptionPackage = async (id, data) => {
    setLoading(true);
    try {
      const response = await packagesService.updatePackages(id, data);
      showSuccessToast({
        title: "Paquete actualizado",
        message: "Paquete actualizado exitosamente"
      });
      return response;
    } catch (error) {
      console.log(error);
      showServerErrorsToast(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    updatePrescriptionPackage,
    toast
  };
};