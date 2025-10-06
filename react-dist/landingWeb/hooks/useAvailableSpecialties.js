import { useEffect, useState } from "react";
import { specialtiesService } from "../../../services/api/index.js";
export function useAvailableSpecialties(allowedSpecialtyIds) {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const response = await specialtiesService.getAll();
        const filtered = allowedSpecialtyIds?.length ? response.filter(s => allowedSpecialtyIds.includes(s.id)) : response;
        setSpecialties(filtered);
      } catch (err) {
        console.error("Error cargando especialidades:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [allowedSpecialtyIds]);
  return {
    specialties,
    loading
  };
}