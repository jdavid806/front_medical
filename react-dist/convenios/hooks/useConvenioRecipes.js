import { convenioTenantService } from "../../../services/api/index.js";
import { useState } from "react";
export const useConvenioRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const fetchConvenioRecipes = async params => {
    const {
      tenantId,
      apiKey,
      module,
      search,
      status
    } = params;
    try {
      const response = await convenioTenantService.getFarmaciasWithRecetasConvenio({
        module,
        search,
        status
      }, tenantId, apiKey);
      console.log("response", response);
      setRecipes(response.data || []);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  return {
    fetchConvenioRecipes,
    recipes
  };
};