import { useState, useEffect, use } from "react";
import { infoCompanyService } from "../../services/api";
import { useCompany } from "./useCompany";

export const useCommunication = () => {
  const { company, setCompany, fetchCompany } = useCompany();
  const [communication, setCommunication] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCommunication = async () => {
    setLoading(true);

    try {
      const response = await infoCompanyService.getInfoCommunication(
        company.id
      );
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
    fetchCommunication,
  };
};
