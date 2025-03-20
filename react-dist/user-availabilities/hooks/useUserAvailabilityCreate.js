import { useState } from 'react';
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { userAvailabilityService } from "../../../services/api/index.js";
import { formatTime } from "../../../services/utilidades.js";
export const useUserAvailabilityCreate = () => {
  const [loading, setLoading] = useState(false);
  const createUserAvailability = async userAvailabilityData => {
    setLoading(true);
    try {
      const data = {
        ...userAvailabilityData,
        start_time: formatTime(userAvailabilityData.start_time),
        end_time: formatTime(userAvailabilityData.end_time),
        free_slots: userAvailabilityData.free_slots.map(slot => ({
          ...slot,
          start_time: formatTime(slot.start_time),
          end_time: formatTime(slot.end_time)
        }))
      };
      await userAvailabilityService.createForParent(userAvailabilityData.user_id, data);
      SwalManager.success();
    } catch (error) {
      ErrorHandler.generic(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    createUserAvailability
  };
};