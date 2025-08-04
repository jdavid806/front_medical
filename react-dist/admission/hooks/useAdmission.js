import { useState } from "react";
import { admissionService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useAdmission = () => {
  const [admission, setAdmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchAdmission = async id => {
    try {
      const data = await admissionService.get(id);
      setAdmission(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    admission,
    fetchAdmission,
    loading
  };
};