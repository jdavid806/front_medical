import { useState } from "react";
import { userService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchUser = async id => {
    try {
      const data = await userService.get(id);
      setUser(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    user,
    setUser,
    fetchUser,
    loading
  };
};