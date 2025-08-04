import { useState } from 'react';
import { cleanJsonObject } from "../../../services/utilidades.js";
import GeneralRequestService from "../../../services/api/classes/generalRequestService.js";
export const useRequests = () => {
  const [requests, setRequests] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const fetchRequests = async filters => {
    setLoading(true);
    try {
      const service = new GeneralRequestService();
      const data = await service.filterRequests(cleanJsonObject(filters));
      console.log(data);
      setTotalRecords(data.total);
      setRequests(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    requests,
    fetchRequests,
    totalRecords,
    loading
  };
};