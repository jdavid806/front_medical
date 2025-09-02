import { useEffect, useState } from "react";
import { farmaciaService } from "../../../services/api/index.js";
export const useVaccines = () => {
  const [vaccines, setVaccines] = useState([]);
  const fetchVaccines = async () => {
    try {
      const data = await farmaciaService.getAllVacunas();
      const mappedData = data.map(vaccine => ({
        ...vaccine,
        label: vaccine.name + (vaccine.concentration ? " - " + vaccine.concentration : "")
      }));
      setVaccines(mappedData);
    } catch (error) {
      console.error("Error fetching vaccines:", error);
      setVaccines([]);
      throw error;
    }
  };
  useEffect(() => {
    fetchVaccines();
  }, []);
  return {
    vaccines,
    fetchVaccines
  };
};