import { useState } from "react";
import { farmaciaService } from "../../../../services/api/index.js";
export const useAllRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const fetchAllRecipes = async (status, search) => {
    try {
      const recipesResponse = await farmaciaService.getAllRecipes(status, search);
      const filteredRecipes = Array.isArray(recipesResponse) ? recipesResponse : recipesResponse?.data || [];
      setRecipes(filteredRecipes);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  return {
    fetchAllRecipes,
    recipes
  };
};