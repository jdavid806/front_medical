import { useState } from 'react';
import { userRolesService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const useUserRoleMenuUpdate = () => {
  const [loading, setLoading] = useState(true);
  const updateUserRoleMenu = async (id, data) => {
    setLoading(true);
    try {
      const selectedMenus = data.menuIds.map(menuId => ({
        id: menuId,
        is_active: true
      }));
      await userRolesService.updateRoleMenus(id, selectedMenus);
      SwalManager.success();
    } catch (error) {
      ErrorHandler.generic(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    updateUserRoleMenu,
    loading
  };
};