import { useState, useEffect } from 'react';
import { patientService } from "../../../services/api/index.js";
export const usePatient = patientId => {
  const [patient, setPatient] = useState(null);
  const fetchPatient = async () => {
    const urlPatientId = new URLSearchParams(window.location.search).get('patient_id') || new URLSearchParams(window.location.search).get('id');
    const finalPatientId = patientId || urlPatientId;
    const patient = await patientService.get(finalPatientId);
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