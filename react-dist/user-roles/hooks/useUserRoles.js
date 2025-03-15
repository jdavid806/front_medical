import { useState, useEffect } from 'react';
import { userRolesService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useRoles = () => {
  const [userRoles, setUserRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchUserRoles = async () => {
    try {
      const data = await userRolesService.active();
      console.log('Roles:', data);
      setUserRoles(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserRoles();
  }, []);
  return {
    userRoles,
    fetchUserRoles,
    loading
  };
};