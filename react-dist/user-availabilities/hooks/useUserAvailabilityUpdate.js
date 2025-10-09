import { useState } from 'react';
import { userAvailabilityService } from "../../../services/api/index.js";
import { convertDateToHHMM } from "../../../services/utilidades.js";
import { usePRToast } from "../../hooks/usePRToast.js";
export const useUserAvailabilityUpdate = () => {
  const [loading, setLoading] = useState(true);
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const updateUserAvailability = async (id, data) => {
    setLoading(true);
    try {
      const newData = {
        ...data,
        start_time: convertDateToHHMM(data.start_time),
        end_time: convertDateToHHMM(data.end_time),
        free_slots: data.free_slots.map(slot => ({
          ...slot,
          start_time: convertDateToHHMM(slot.start_time),
          end_time: convertDateToHHMM(slot.end_time)
        }))
      };
      await userAvailabilityService.update(id, newData);
      showSuccessToast({
        title: "Horario actualizado",
        message: "El horario de atención se ha actualizado correctamente"
      });
    } catch (error) {
      showServerErrorsToast(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    updateUserAvailability,
    loading,
    toast
  };
};