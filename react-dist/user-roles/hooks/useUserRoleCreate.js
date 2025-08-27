import { useState } from 'react';
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { userRolesService } from "../../../services/api/index.js";
export const useUserRoleCreate = () => {
  const [loading, setLoading] = useState(false);
  const createUserRole = async userRoleData => {
    setLoading(true);
    try {
      const finalData = {
        role: {
          group: userRoleData.group,
          name: userRoleData.name
        },
        menus: userRoleData.menus,
        permissions: userRoleData.permissions
      };
      await userRolesService.storeMenusPermissions(finalData);
      SwalManager.success();
    } catch (error) {
      ErrorHandler.generic(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    createUserRole
  };
};