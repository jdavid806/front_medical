import { useState } from "react";
import { packagesService } from "../../../services/api/index.js";
export const useClinicalPackage = () => {
  const [clinicalPackage, setClinicalPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchClinicalPackage = async id => {
    try {
      setLoading(true);
      setError(null);
      const response = await packagesService.get(id);
      setClinicalPackage(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return {
    clinicalPackage,
    loading,
    error,
    fetchClinicalPackage
  };
};