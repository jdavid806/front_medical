import { useState } from 'react';
import { userRolesService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const useUserRoleUpdate = () => {
  const [loading, setLoading] = useState(true);
  const updateUserRole = async (id, data) => {
    setLoading(true);
    try {
      await userRolesService.saveRoleMenus(id, data?.menus);
      SwalManager.success();
    } catch (error) {
      ErrorHandler.generic(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    updateUserRole,
    loading
  };
};