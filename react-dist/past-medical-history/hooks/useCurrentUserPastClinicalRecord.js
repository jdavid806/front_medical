import { useEffect, useState } from "react";
import { SpecializablesService } from "../../../services/api/classes/specializablesService.js";
export const useCurrentUserPastClinicalRecord = () => {
  const [loading, setLoading] = useState(true);
  const [pastMedicalHistory, setPastMedicalHistory] = useState();
  const fetchPastMedicalHistory = async () => {
    try {
      setLoading(true);
      const service = new SpecializablesService();
      const response = await service.getPastClinicalRecordByCurrentUserSpecialty();
      setPastMedicalHistory(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPastMedicalHistory();
  }, []);
  return {
    loading,
    pastMedicalHistory,
    fetchPastMedicalHistory
  };
};