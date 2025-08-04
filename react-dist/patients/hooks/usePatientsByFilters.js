import { useState } from 'react';
import { patientService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { cleanJsonObject } from "../../../services/utilidades.js";
export const usePatientsByFilters = () => {
  const [patients, setPatients] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const fetchPatientsByFilters = async ({
    search = "",
    per_page = 10,
    page = 1
  }) => {
    setLoading(true);
    try {
      const data = await patientService.getByFilters(cleanJsonObject({
        search,
        per_page,
        page
      }));
      const mappedData = data.data.data.map(item => {
        return {
          ...item,
          label: `${item.first_name} ${item.middle_name} ${item.last_name} ${item.second_last_name}`
        };
      });
      setTotalRecords(data.data.total);
      setPatients(mappedData);
    } catch (err) {
      console.error(err);
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    patients,
    fetchPatientsByFilters,
    totalRecords,
    loading
  };
};