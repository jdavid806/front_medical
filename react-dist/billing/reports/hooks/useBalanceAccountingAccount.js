import { useState, useEffect } from 'react';
import { ErrorHandler } from "../../../../services/errorHandler.js";
import { BillingReportService } from "../../../../services/api/classes/billingReportService.js";
export const useBalanceAccountingAccount = () => {
  const baseData = [];
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [accountId, setAccountId] = useState(null);
  const [balanceAccountingAccount, setBalanceAccountingAccount] = useState(baseData);
  const [loading, setLoading] = useState(true);
  const fetchBalanceAccountingAccount = async () => {
    setLoading(true);
    try {
      const service = new BillingReportService();
      const selectedDates = dateRange?.filter(date => !!date).map(date => date.toISOString().split("T")[0]);
      if (!selectedDates || selectedDates.length !== 2) {
        return;
      }
      const data = await service.getBalanceAccountingAccount({
        from: selectedDates[0],
        to: selectedDates[1],
        accounting_account_id: accountId
      });
      if (!data) {
        setBalanceAccountingAccount(baseData);
      }
      setBalanceAccountingAccount(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBalanceAccountingAccount();
  }, []);
  useEffect(() => {
    fetchBalanceAccountingAccount();
  }, [dateRange, accountId]);
  return {
    dateRange,
    setDateRange,
    accountId,
    setAccountId,
    balanceAccountingAccount,
    fetchBalanceAccountingAccount,
    loading
  };
};