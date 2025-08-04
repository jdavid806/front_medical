import { useState } from 'react';
import { patientService } from "../../../services/api/index.js";
export const usePatientById = () => {
  const [patient, setPatient] = useState(null);
  const fetchPatientById = async patientId => {
    const patient = await patientService.get(patientId);
    setPatient(patient);
  };
  return {
    patient,
    fetchPatientById
  };
};