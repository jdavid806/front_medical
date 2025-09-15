import { useState } from 'react';
import { admissionService } from "../../../services/api/index.js";
import { cleanJsonObject } from "../../../services/utilidades.js";
export const useAdmissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const fetchAdmissions = async filters => {
    setLoading(true);
    try {
      const data = await admissionService.filterAdmissions(cleanJsonObject(filters));
      setTotalRecords(data.data.total);
      setAdmissions(data.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    admissions,
    fetchAdmissions,
    totalRecords,
    loading
  };
};