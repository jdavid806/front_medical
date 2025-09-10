import { useEffect, useState } from "react";
import { packagesService } from "../../../services/api/index.js";
export const useClinicalPackages = () => {
  const [clinicalPackages, setClinicalPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchClinicalPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await packagesService.getAllPackages();
      const mappedResponse = response.data.map(pkg => ({
        ...pkg,
        label: `${pkg.name} - Código ${pkg.cie11 ? "CIE11" : "CUPS"}: ${pkg.cie11 || pkg.cups}`
      }));
      setClinicalPackages(mappedResponse);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchClinicalPackages();
  }, []);
  return {
    clinicalPackages,
    loading,
    error,
    fetchClinicalPackages
  };
};