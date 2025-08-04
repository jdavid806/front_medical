import { useState, useEffect } from 'react';
import { ErrorHandler } from "../../../../services/errorHandler.js";
import { BillingReportService } from "../../../../services/api/classes/billingReportService.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
export const useBalanceGeneral = () => {
  const baseData = {
    categories: {
      assets: [],
      liabilities: [],
      equity: [],
      incomes: [],
      costs: [],
      expenses: [],
      memorandum: [],
      fiscal: [],
      control: []
    },
    totals: {
      assets: 0,
      liabilities: 0,
      equity: 0,
      incomes: 0,
      costs: 0,
      expenses: 0,
      memorandum: 0,
      fiscal: 0,
      control: 0
    },
    is_balanced: false,
    difference: 0
  };
  const [dateRange, setDateRange] = useState([]);
  const [balanceGeneral, setBalanceGeneral] = useState(baseData);
  const [loading, setLoading] = useState(true);
  const fetchBalanceGeneral = async () => {
    try {
      const service = new BillingReportService();
      const selectedDates = dateRange?.filter(date => !!date).map(date => date.toISOString().split("T")[0]);
      const data = await service.getBalanceGeneral({
        from: selectedDates ? selectedDates[0] : null,
        to: selectedDates ? selectedDates[1] : null
      });
      if (!data.categories) {
        setBalanceGeneral(baseData);
        if (data.message) {
          SwalManager.error({
            text: data.message
          });
        }
        return;
      }
      setBalanceGeneral(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBalanceGeneral();
  }, []);
  useEffect(() => {
    fetchBalanceGeneral();
  }, [dateRange]);
  return {
    dateRange,
    setDateRange,
    balanceGeneral,
    fetchBalanceGeneral,
    loading
  };
};