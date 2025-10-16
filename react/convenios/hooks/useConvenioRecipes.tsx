import { convenioTenantService } from "../../../services/api";
import { useState } from "react";

export const useConvenioRecipes = () => {

    const [recipes, setRecipes] = useState<any[]>([]);

    const fetchConvenioRecipes = async (params: { tenantId: string, apiKey: string, module: string, search: string, status: string }) => {
        const { tenantId, apiKey, module, search, status } = params;
        try {
            const response = await convenioTenantService.getFarmaciasWithRecetasConvenio(
                { module, search, status },
                tenantId,
                apiKey
            );
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
    }
}
