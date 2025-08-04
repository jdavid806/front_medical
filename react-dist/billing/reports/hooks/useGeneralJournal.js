import { useState, useEffect } from 'react';
import { ErrorHandler } from "../../../../services/errorHandler.js";
import { BillingReportService } from "../../../../services/api/classes/billingReportService.js";
export const useGeneralJournal = () => {
  const baseData = [];
  const [dateRange, setDateRange] = useState([]);
  const [generalJournal, setGeneralJournal] = useState(baseData);
  const [loading, setLoading] = useState(true);
  const fetchGeneralJournal = async () => {
    try {
      const service = new BillingReportService();
      const selectedDates = dateRange?.filter(date => !!date).map(date => date.toISOString().split("T")[0]);
      const data = await service.getGeneralJournal({
        from: selectedDates ? selectedDates[0] : null,
        to: selectedDates ? selectedDates[1] : null
      });
      if (!data) {
        setGeneralJournal(baseData);
      }
      setGeneralJournal(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchGeneralJournal();
  }, []);
  useEffect(() => {
    fetchGeneralJournal();
  }, [dateRange]);
  return {
    dateRange,
    setDateRange,
    generalJournal,
    fetchGeneralJournal,
    loading
  };
};