import { useState } from 'react';
import { userRolesService } from "../../../services/api/index.js";
export const useUserRoleMenus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const saveRoleMenus = async (roleId, menus) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userRolesService.saveRoleMenus(roleId, menus);
      setIsLoading(false);
      return response;
    } catch (err) {
      setError(err.message || 'Error al guardar menús del rol');
      setIsLoading(false);
      throw err;
    }
  };
  return {
    saveRoleMenus,
    isLoading,
    error
  };
};