import { useState, useEffect, useCallback } from "react";
import { userRolesService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useUserRoles = () => {
  const [userRoles, setUserRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchUserRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userRolesData = await userRolesService.getAll();
      setUserRoles(userRolesData.map(role => ({
        id: role.id,
        name: role.name,
        group: role.group
      })));
    } catch (err) {
      const errorMessage = "Error al cargar los roles de usuario";
      setError(errorMessage);
      ErrorHandler.generic(err);
      console.error("Error fetching user roles:", err);
    } finally {
      setLoading(false);
    }
  }, []);
  const refreshUserRoles = useCallback(async () => {
    await fetchUserRoles();
  }, [fetchUserRoles]);
  useEffect(() => {
    fetchUserRoles();
  }, [fetchUserRoles]);
  return {
    userRoles,
    loading,
    error,
    fetchUserRoles,
    refreshUserRoles
  };
};