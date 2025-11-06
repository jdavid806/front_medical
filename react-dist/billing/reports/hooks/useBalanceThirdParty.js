import { useState, useEffect } from 'react';
import { ErrorHandler } from "../../../../services/errorHandler.js";
import { BillingReportService } from "../../../../services/api/classes/billingReportService.js";
export const useBalanceThirdParty = () => {
  const baseData = [];
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [thirdPartyId, setThirdPartyId] = useState(null);
  const [startAccount, setStartAccount] = useState(null);
  const [endAccount, setEndAccount] = useState(null);
  const [balanceThirdParty, setBalanceThirdParty] = useState(baseData);
  const [loading, setLoading] = useState(true);
  const fetchBalanceThirdParty = async () => {
    try {
      const service = new BillingReportService();
      const selectedDates = dateRange?.filter(date => !!date).map(date => date.toISOString().split("T")[0]);
      if (!selectedDates || selectedDates.length !== 2) {
        return;
      }
      const data = await service.getBalanceThirdParty({
        from: selectedDates[0],
        to: selectedDates[1],
        third_party_id: thirdPartyId,
        account_from: startAccount,
        account_to: endAccount
      });
      if (!data) {
        setBalanceThirdParty(baseData);
      }
      setBalanceThirdParty(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBalanceThirdParty();
  }, []);
  useEffect(() => {
    fetchBalanceThirdParty();
  }, [dateRange, thirdPartyId, startAccount, endAccount]);
  return {
    dateRange,
    setDateRange,
    thirdPartyId,
    setThirdPartyId,
    startAccount,
    endAccount,
    setStartAccount,
    setEndAccount,
    balanceThirdParty,
    fetchBalanceThirdParty,
    loading
  };
};