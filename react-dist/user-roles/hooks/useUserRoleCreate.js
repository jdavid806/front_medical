import { useState } from 'react';
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { userRolesService } from "../../../services/api/index.js";
export const useUserRoleCreate = () => {
  const [loading, setLoading] = useState(false);
  const createUserRole = async userRoleData => {
    setLoading(true);
    try {
      await userRolesService.storeMenusPermissions(userRoleData);
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