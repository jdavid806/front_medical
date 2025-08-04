import { useState, useEffect } from 'react';
import AccountingClosingsService from "../../../../services/api/classes/accountingClosingsService.js";
export const useAccountingClosings = () => {
  const [accountingClosings, setAccountingClosings] = useState({
    data: []
  });
  const fetchAccountingClosings = async () => {
    try {
      const service = new AccountingClosingsService();
      const data = await service.getAll();
      setAccountingClosings(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  useEffect(() => {
    fetchAccountingClosings();
  }, []);
  return {
    accountingClosings,
    fetchAccountingClosings
  };
};