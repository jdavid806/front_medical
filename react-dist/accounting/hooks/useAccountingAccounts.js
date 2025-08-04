// hooks/useAccountingAccounts.ts
import { useState, useEffect, useCallback } from "react";
import { accountingAccountsService } from "../../../services/api/index.js";
export const useAccountingAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchAccounts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await accountingAccountsService.getAllAccounts();
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          setAccounts(response.data);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setAccounts(response.data.data);
        } else {
          console.warn("Estructura inesperada pero manejable:", response.data);
          setAccounts(response.data);
        }
      } else {
        throw new Error("Respuesta vacía o inválida del servidor");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido al obtener las cuentas contables";
      setError(errorMessage);
      console.error("Error en useAccountingAccounts:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Función para refrescar los datos manualmente
  const refreshAccounts = useCallback(async () => {
    await fetchAccounts();
  }, [fetchAccounts]);
  return {
    accounts,
    isLoading,
    error,
    isEmpty: !isLoading && accounts.length === 0,
    refreshAccounts
  };
};
export const useAccountingAccountsByCategory = (category, value) => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchAccounts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await accountingAccountsService.getAccountByCategory(category, value);
      if (Array.isArray(response)) {
        setAccounts(response);
      } else if (response?.data && Array.isArray(response.data)) {
        setAccounts(response.data);
      } else {
        console.warn("Estructura inesperada:", response);
        setAccounts([]);
        throw new Error("La respuesta no es un array válido");
      }
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
    refreshAccounts
  };
};