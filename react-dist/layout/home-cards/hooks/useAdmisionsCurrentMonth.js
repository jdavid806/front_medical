import { useEffect, useState } from "react";
import { admissionService } from "../../../../services/api/index.js";
import { usePRToast } from "../../../hooks/usePRToast.js";
export const useAdmisionsCurrentMonth = () => {
  const [admisionCount, setAdmisionCount] = useState(null);
  const {
    toast,
    showSuccessToast,
    showServerErrorsToast
  } = usePRToast();
  const fetchAdmisionCurrentMonth = async () => {
    try {
      const response = await admissionService.getAdmisionsCurrentMonth();
      const data = response.data;
      setAdmisionCount(data);
    } catch (error) {
      showServerErrorsToast(error);
    }
  };
  useEffect(() => {
    fetchAdmisionCurrentMonth();
  }, []);
  return {
    admisionCount,
    fetchAdmisionCurrentMonth,
    toast
  };
};