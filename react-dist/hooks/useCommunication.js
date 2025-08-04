import { useState, useEffect } from "react";
import { infoCompanyService } from "../../services/api/index.js";
import { useCompany } from "./useCompany.js";
export const useCommunication = () => {
  const {
    company,
    setCompany,
    fetchCompany
  } = useCompany();
  const [communication, setCommunication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchCommunication = async () => {
    setLoading(true);
    try {
      const response = await infoCompanyService.getInfoCommunication(company.id);
      setCommunication(response);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCommunication();
  }, [company]);
  return {
    communication,
    setCommunication,
    fetchCommunication
  };
};