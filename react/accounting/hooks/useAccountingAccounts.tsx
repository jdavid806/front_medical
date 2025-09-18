import { useState, useEffect, useCallback } from "react";
import { accountingAccountsService } from "../../../services/api/index";
import { AccountingAccount } from "../types/bankTypes";

export const useAccountingAccounts = () => {
  const [accounts, setAccounts] = useState<AccountingAccount[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await accountingAccountsService.getAllAccounts();

      let accountsData: AccountingAccount[] = [];

      if (response && response.data) {
        if (Array.isArray(response.data)) {
          accountsData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          accountsData = response.data.data;
        } else {
          console.warn("Estructura inesperada pero manejable:", response.data);
          accountsData = response.data;
        }
      } else {
        throw new Error("Respuesta vacía o inválida del servidor");
      }

      // Agregar propiedad combinada para mostrar en dropdowns
      const accountsWithLabel = accountsData.map(account => ({
        ...account,
        account_label: `${account.account_code} - ${account.account_name}`
      }));

      setAccounts(accountsWithLabel);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error desconocido al obtener las cuentas contables";
      setError(errorMessage);
      console.error("Error en useAccountingAccounts:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const refreshAccounts = useCallback(async () => {
    await fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    isLoading,
    error,
    isEmpty: !isLoading && accounts.length === 0,
    refreshAccounts,
  };
};

export const useAccountingAccountsByCategory = (category: string, value: string) => {
  const [accounts, setAccounts] = useState<AccountingAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await accountingAccountsService.getAccountByCategory(category, value);

      let accountsData: AccountingAccount[] = [];

      if (Array.isArray(response)) {
        accountsData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        accountsData = response.data;
      } else {
        console.warn("Estructura inesperada:", response);
        accountsData = [];
        throw new Error("La respuesta no es un array válido");
      }

      const accountsWithLabel = accountsData.map(account => ({
        ...account,
        account_label: `${account.account_code} - ${account.account_name}`
      }));

      setAccounts(accountsWithLabel);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error("Error al obtener cuentas:", err);
    } finally {
      setIsLoading(false);
    }
  }, [category, value]);

  useEffect(() => {
    if (category && value) {
      fetchAccounts();
    } else {
      setAccounts([]);
    }
  }, [category, value, fetchAccounts]);

  const refreshAccounts = useCallback(async () => {
    await fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    isLoading,
    error,
    isEmpty: !isLoading && accounts.length === 0,
    refreshAccounts,
  };
};