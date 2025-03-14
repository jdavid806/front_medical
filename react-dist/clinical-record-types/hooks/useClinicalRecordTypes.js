import { useState, useEffect } from 'react';
import { clinicalRecordTypeService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useClinicalRecordTypes = () => {
  const [clinicalRecordTypes, setClinicalRecordTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchClinicalRecordTypes = async () => {
    try {
      const data = await clinicalRecordTypeService.getAll();
      setClinicalRecordTypes(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchClinicalRecordTypes();
  }, []);
  return {
    clinicalRecordTypes,
    fetchClinicalRecordTypes,
    loading
  };
};