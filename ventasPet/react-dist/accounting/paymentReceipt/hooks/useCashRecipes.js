// hooks/useCashRecipes.ts
import { useState, useEffect } from 'react';
import { cashRecipes } from "../../../../../services/api/index.js";


export const useCashRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchCashRecipes = async () => {
        try {
          setIsLoading(true);
          setError(null);
          
          const response = await cashRecipes.getAllCashRecipes();
          
          console.log('Respuesta completa del backend:', response); // Para debugging
          
          // Verificar si la respuesta existe
          if (!response) {
            throw new Error('No se recibió respuesta del servidor');
          }
  
          // Manejar la respuesta directa (array) o respuesta con propiedad data
          const responseData = Array.isArray(response) ? response : response.data;
          
          if (!responseData) {
            throw new Error('La estructura de la respuesta no es válida');
          }
  
          if (!Array.isArray(responseData)) {
            throw new Error('Se esperaba un array de recibos');
          }
  
          setRecipes(responseData);
  
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
      isEmpty: !isLoading && !error && recipes.length === 0,
    };
  };
