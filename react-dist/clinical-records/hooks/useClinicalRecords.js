import { useState, useEffect } from 'react';
import { ErrorHandler } from "../../../services/errorHandler.js";
import { clinicalRecordService } from "../../../services/api/index.js";
export const useClinicalRecords = patientId => {
  const [clinicalRecords, setClinicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchClinicalRecords = async patientId => {
    if (!patientId) {
      return;
    }
    try {
      let data = await clinicalRecordService.ofParent(patientId);
      setClinicalRecords(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchClinicalRecords(patientId);
  }, []);
  return {
    clinicalRecords,
    fetchClinicalRecords,
    loading
  };
};