import { useState, useEffect } from 'react';
import { costCenterService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useCentresCosts = () => {
  const [centresCosts, setCentresCosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchCentresCosts = async () => {
    try {
      const data = await costCenterService.getCostCenterAll();
      setCentresCosts(data.data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCentresCosts();
  }, []);
  return {
    centresCosts,
    fetchCentresCosts,
    loading
  };
};