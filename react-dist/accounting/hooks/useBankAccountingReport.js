import { useState } from "react";
import BillingReportService from "../../../services/api/classes/billingReportService.js";
export const useBankAccountingReport = () => {
  const [metodosPago, setMetodosPago] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchBankAccountingReport = async ({
    from,
    to
  }) => {
    try {
      setLoading(true);
      const service = new BillingReportService();
      const response = await service.getBankAccountingReport({
        from,
        to
      });
      console.log("response", response);
      setMetodosPago(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    metodosPago,
    fetchBankAccountingReport,
    loading
  };
};