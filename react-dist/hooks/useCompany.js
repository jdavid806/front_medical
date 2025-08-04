import { useState, useEffect } from "react";
import { infoCompanyService } from "../../services/api/index.js";
export const useCompany = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchCompany = async () => {
    setLoading(true);
    try {
      const response = await infoCompanyService.getCompany();
      setCompany({
        ...response.data[0].attributes,
        id: response.data[0].id
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCompany();
  }, []);
  return {
    company,
    setCompany,
    fetchCompany
  };
};