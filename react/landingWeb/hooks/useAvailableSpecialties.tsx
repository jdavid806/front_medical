import { useEffect, useState } from "react";
import { specialtiesService } from "../../../services/api";

export function useAvailableSpecialties(allowedSpecialtyIds?: number[]) {
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const response = await specialtiesService.getAll();
        const filtered = allowedSpecialtyIds?.length
          ? response.filter((s: any) => allowedSpecialtyIds.includes(s.id))
          : response;

        setSpecialties(filtered);
      } catch (err) {
        console.error("Error cargando especialidades:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [allowedSpecialtyIds]);

  return { specialties, loading };
}