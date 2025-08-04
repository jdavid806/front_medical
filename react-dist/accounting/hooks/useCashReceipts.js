// hooks/useCashRecipes.ts
import { useState, useEffect } from 'react';
import CashRecipesService from "../../../services/api/classes/cashRecipes.js";
const cashRecipesService = new CashRecipesService("api/v1/admin"); // instanciar el servicio

export const useCashRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchCashRecipes = async () => {
      setIsLoading(true);
      try {
        const response = await cashRecipesService.getAllCashRecipes();
        console.log("Respuesta del servidor:", response);

        // Check if response is already the array (no .data needed)
        let data = response;
        // Some APIs wrap data in a .data property, so we check both
        if (response && typeof response === 'object' && 'data' in response) {
          data = response.data;
        }
        if (Array.isArray(data)) {
          setRecipes(data);
        } else {
          console.warn("Estructura inesperada pero manejable:", data);
          setRecipes([]);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido al obtener los recibos de caja";
        setError(errorMessage);
        console.error("Error en useCashRecipes:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCashRecipes();
  }, []);
  return {
    recipes,
    isLoading,
    error,
    isEmpty: !isLoading && recipes.length === 0
  };
};
export const useCashRecipeById = id => {
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchCashRecipe = async () => {
      try {
        if (!id) return;
        setIsLoading(true);
        const response = await cashRecipesService.getCashRecipeById(id);
        if (response && response.data) {
          setRecipe(response.data);
        } else {
          throw new Error('Recibo no encontrado o respuesta inválida');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al obtener el recibo';
        setError(errorMessage);
        console.error('Error en useCashRecipeById:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCashRecipe();
  }, [id]);
  return {
    recipe,
    isLoading,
    error
  };
};
export const useCreateCashRecipe = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [createdRecipe, setCreatedRecipe] = useState(null);
  const createCashRecipe = async data => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setCreatedRecipe(null);
    try {
      const response = await cashRecipesService.createCashRecipe(data);
      if (response && response.data) {
        setCreatedRecipe(response.data);
        setSuccess(true);
      } else {
        throw new Error('Respuesta vacía al crear el recibo de caja');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el recibo de caja';
      setError(errorMessage);
      console.error('Error en createCashRecipe:', err);
    } finally {
      setIsLoading(false);
    }
  };
  return {
    createCashRecipe,
    isLoading,
    error,
    success,
    createdRecipe
  };
};
export const useCreateCashRecipeWithInvoice = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [createdRecipe, setCreatedRecipe] = useState(null);
  const createCashRecipeWithInvoice = async data => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setCreatedRecipe(null);
    try {
      const response = await cashRecipesService.createCashRecipeWhithInvoice(data);
      if (response && response.data) {
        setCreatedRecipe(response.data);
        setSuccess(true);
      } else {
        throw new Error('Respuesta vacía al crear el recibo de caja con factura');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el recibo de caja con factura';
      setError(errorMessage);
      console.error('Error en createCashRecipeWithInvoice:', err);
    } finally {
      setIsLoading(false);
    }
  };
  return {
    createCashRecipeWithInvoice,
    isLoading,
    error,
    success,
    createdRecipe
  };
};