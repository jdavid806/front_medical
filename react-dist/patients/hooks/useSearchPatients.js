import { useState } from "react";
import { patientService } from "../../../services/api/index.js";
export const useSearchPatients = () => {
  const [patients, setPatients] = useState([]);
  const searchPatients = async query => {
    try {
      const filteredPatients = await patientService.getByFilters({
        per_page: 1000000,
        search: query
      });
      setPatients(filteredPatients.data.data.map(patient => ({
        ...patient,
        label: `${patient.first_name} ${patient.last_name}, Tel: ${patient.whatsapp}, Doc: ${patient.document_number}`
      })));
    } catch (error) {
      console.error(error);
    }
  };
  return {
    patients,
    searchPatients
  };
};