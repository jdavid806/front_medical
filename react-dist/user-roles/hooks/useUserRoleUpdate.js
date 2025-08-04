import { useState } from 'react';
import { userRolesService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const useUserRoleUpdate = () => {
  const [loading, setLoading] = useState(true);
  const updateUserRole = async (id, data) => {
    setLoading(true);
    try {
      const finalData = {
        role: {
          group: data.group,
          name: data.name
        },
        menus: data.menus,
        permissions: data.permissions
      };
      await userRolesService.updateMenusPermissions(id, finalData);
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