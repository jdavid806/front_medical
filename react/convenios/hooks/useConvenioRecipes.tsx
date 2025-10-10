import { convenioTenantService } from "../../../services/api";
import { useState } from "react";

export const useConvenioRecipes = () => {

    const [recipes, setRecipes] = useState<any[]>([]);

    const fetchConvenioRecipes = async (params: { tenantId: string, apiKey: string, module: string }) => {
        const { tenantId, apiKey, module } = params;
        try {
            const response = await convenioTenantService.getFarmaciasWithRecetasConvenio(
                { module },
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
