import { useState, useEffect } from "react";
import OptometryService from "../../../../services/api/classes/optometryService";

export const useOptometry = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todas las recetas de optometría
  const getAllOptometryRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const service = new OptometryService();
      const response = await service.getAllOptometryRecipes();
      setRecipes(response.data);
    } catch (err) {
      console.error("Error fetching optometry recipes:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener el estado de facturación de una receta
  const getRecipeInvoiceStatus = async (recipeId) => {
    try {
      const service = new OptometryService();
      const response = await service.getRecipeInvoiceStatus(recipeId);
      return response.data;
    } catch (err) {
      console.error(
        `Error fetching invoice status for recipe ${recipeId}:`,
        err
      );
      throw err;
    }
  };

  // Crear una nueva receta de optometría
  const createOptometryRecipe = async (data, patientId) => {
    try {
      const service = new OptometryService();
      const response = await service.createOptometryRecipe(
        data,
        patientId
      );
      // Actualizamos la lista de recetas después de crear una nueva
      await getAllOptometryRecipes();
      return response.data;
    } catch (err) {
      console.error("Error creating optometry recipe:", err);
      throw err;
    }
  };

  // Obtener una receta por ID
  const getOptometryRecipeById = async (id) => {
    try {
      const service = new OptometryService();
      const response = await service.getOptometryRecipeById(id);
      return response.data;
    } catch (err) {
      console.error(`Error fetching optometry recipe ${id}:`, err);
      throw err;
    }
  };

  // Cargar las recetas al montar el componente
  useEffect(() => {
    getAllOptometryRecipes();
  }, []);

  return {
    recipes,
    loading,
    error,
    getAllOptometryRecipes,
    getRecipeInvoiceStatus,
    createOptometryRecipe,
    getOptometryRecipeById,
  };
};
