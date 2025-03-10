import { useState, useEffect } from 'react';
import { patientService } from "../../../services/api/index.js";
export const usePatient = patientId => {
  const [patient, setPatient] = useState(null);
  const fetchPatient = async () => {
    const patient = await patientService.get(patientId);
    setPatient(patient);
  };
  useEffect(() => {
    fetchPatient();
  }, [patientId]);
  return {
    patient,
    fetchPatient
  };
};