import { useState } from 'react';
import { packagesService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from '../../../services/alertManagerImported.js';
export const useDeletePrescriptionPackage = () => {
  const [loading, setLoading] = useState(false);
  const deletePrescriptionPackage = async id => {
    let confirmed = false;
    try {
      await SwalManager.confirmDelete(async () => {
        setLoading(true);
        await packagesService.delete(id);
        confirmed = true;
      });
      return confirmed;
    } catch (err) {
      ErrorHandler.generic(err);
      return false;
    } finally {
      setLoading(false);
    }
  };
  return {
    deletePrescriptionPackage,
    loading
  };
};