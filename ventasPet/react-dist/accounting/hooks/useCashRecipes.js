// hooks/useCashRecipes.ts
import { useState, useEffect } from 'react';
import { cashRecipes } from "../../../services/api/index.js";

export const useCashRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCashRecipes = async () => {
      try {
        setIsLoading(true);
        const response = await cashRecipes.getAllCashRecipes();

        if (response && response.data) {
          // Estructura flexible como en el hook original
          if (Array.isArray(response.data)) {
            setRecipes(response.data);
          } else if (response.data.data && Array.isArray(response.data.data)) {
            setRecipes(response.data.data);
          } else {
            console.warn('Estructura inesperada pero manejable:', response.data);
            setRecipes(response.data);
          }
        } else {
          throw new Error('Respuesta vacía o inválida del servidor');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener los recibos de caja';
        setError(errorMessage);
        console.error('Error en useCashRecipes:', err);
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
    isEmpty: !isLoading && recipes.length === 0,
  };
};
