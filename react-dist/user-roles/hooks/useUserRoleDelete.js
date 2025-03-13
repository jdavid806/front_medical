import { useState } from 'react';
import { userRolesService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from '../../../services/alertManagerImported.js';
export const useUserRoleDelete = () => {
  const [loading, setLoading] = useState(false);
  const deleteUserRole = async id => {
    let confirmed = false;
    try {
      await SwalManager.confirmDelete(async () => {
        setLoading(true);
        await userRolesService.delete(id);
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
    deleteUserRole,
    loading
  };
};