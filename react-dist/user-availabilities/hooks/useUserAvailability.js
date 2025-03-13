import { useState } from "react";
import { userAvailabilityService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useUserAvailability = () => {
  const [userAvailability, setUserAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchUserAvailability = async id => {
    try {
      const data = await userAvailabilityService.get(id);
      setUserAvailability(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    userAvailability,
    setUserAvailability,
    fetchUserAvailability,
    loading
  };
};