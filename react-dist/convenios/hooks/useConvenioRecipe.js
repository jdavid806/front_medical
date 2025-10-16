import { useState } from "react";
import { prescriptionService } from "../../../services/api/index.js";
export const useConvenioRecipe = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchConvenioRecipe = async (id, data) => {
    const {
      tenantId,
      apiKey,
      module
    } = data;
    try {
      const response = await prescriptionService.getConvenioRecipeById(id, {
        module
      }, tenantId, apiKey);
      setRecipe(response.data);
    } catch (err) {
      console.log(err);

      //ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    recipe,
    setRecipe,
    fetchConvenioRecipe,
    loading
  };
};