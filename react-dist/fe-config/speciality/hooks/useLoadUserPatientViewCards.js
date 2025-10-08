import { useEffect, useState } from "react";
import { userService } from "../../../../services/api/index.js";
export const useLoadUserPatientViewCards = () => {
  const [patientViewCards, setPatientViewCards] = useState();
  const fetchUserPatientViewCards = async () => {
    try {
      const patientViewConfig = await userService.getPatientViewConfig();
      setPatientViewCards(patientViewConfig.visible_cards);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  useEffect(() => {
    fetchUserPatientViewCards();
  }, []);
  return {
    fetchUserPatientViewCards,
    patientViewCards
  };
};