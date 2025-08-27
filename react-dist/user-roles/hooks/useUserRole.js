import { useState } from "react";
import { userRolesService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useUserRole = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchUserRole = async id => {
    try {
      const data = await userRolesService.get(id);
      setUserRole(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    userRole,
    fetchUserRole,
    loading,
    setUserRole
  };
};