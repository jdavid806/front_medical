import { useState, useCallback } from "react";
import { landingAvailabilities } from "../../../services/api/index.js";
export function useLandingAvailabilities() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchAvailabilities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await landingAvailabilities.getLandingAvailabilities();

      // si el backend devuelve directamente un array
      setData(response || []);
    } catch (err) {
      setError(err.message || "Error cargando disponibilidades");
    } finally {
      setLoading(false);
    }
  }, []);
  const isLandingAvailableNow = useCallback(() => {
    if (!data || data.length === 0) {
      return false;
    }
    const now = new Date();
    const currentDay = now.getDay() === 0 ? 7 : now.getDay(); // domingo = 7
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return data.some(a => {
      if (!a.days_of_week.includes(currentDay)) {
        return false;
      }
      const startMinutes = toMinutes(a.start_time);
      const endMinutes = toMinutes(a.end_time);
      const inWorkingHours = currentMinutes >= startMinutes && currentMinutes <= endMinutes;
      if (!inWorkingHours) {
        return false;
      }
      if (a.free_slots && a.free_slots.length > 0) {
        const insideFreeSlot = a.free_slots.some(slot => {
          const slotStart = toMinutes(slot.start_time);
          const slotEnd = toMinutes(slot.end_time);
          return currentMinutes >= slotStart && currentMinutes < slotEnd;
        });
        if (insideFreeSlot) {
          return false;
        }
      }
      return true;
    });
  }, [data]);
  return {
    data,
    loading,
    error,
    fetchAvailabilities,
    isLandingAvailableNow
  };
  function toMinutes(time) {
    const parts = time.trim().split(":").map(Number);
    const [h, m] = parts;
    return h * 60 + (m || 0);
  }
}