import { useEffect, useState } from "react";
import { userService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { getJWTPayload } from "../../../services/utilidades.js";
export const useLoggedUser = () => {
  const [loggedUser, setLoggedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchUser = async () => {
    try {
      const data = await userService.getByExternalId(getJWTPayload().sub);
      console.log('Mapped logged user', data);
      setLoggedUser(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return {
    loggedUser,
    loading
  };
};