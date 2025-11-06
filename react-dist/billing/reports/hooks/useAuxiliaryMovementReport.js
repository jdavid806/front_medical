import { useState } from "react";
import BillingReportService from "../../../../services/api/classes/billingReportService.js";
export const useAuxiliaryMovementReport = () => {
  const [cuentasContables, setCuentasContables] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchAuxiliaryMovementReport = async ({
    from,
    to
  }) => {
    try {
      setLoading(true);
      const service = new BillingReportService();
      const response = await service.getAuxiliaryMovementReport({
        from,
        to
      });
      setCuentasContables(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    cuentasContables,
    fetchAuxiliaryMovementReport,
    loading
  };
};