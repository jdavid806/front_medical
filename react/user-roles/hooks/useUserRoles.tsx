import { useState, useEffect, useCallback } from "react";
import { userRolesService } from "../../../services/api";
import { UserRoleDto } from "../../models/models";
import { ErrorHandler } from "../../../services/errorHandler";

export interface UserRoleTableItem {
  id: string;
  name: string;
}

export const useUserRoles = () => {
  const [userRoles, setUserRoles] = useState<UserRoleTableItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userRolesData: UserRoleDto[] = await userRolesService.getAll();

      setUserRoles(
        userRolesData.map((role) => ({
          id: role.id,
          name: role.name,
          group: role.group,
        }))
      );
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
    refreshUserRoles,
  };
};
