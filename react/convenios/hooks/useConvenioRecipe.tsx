import React, { useState } from "react";
import { PrescriptionDto } from "../../models/models";
import { ErrorHandler } from "../../../services/errorHandler";
import { prescriptionService } from "../../../services/api";

export const useConvenioRecipe = () => {
    const [recipe, setRecipe] = useState<PrescriptionDto | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchConvenioRecipe = async (id: string, data: { tenantId: string, apiKey: string, module: string }) => {
        const { tenantId, apiKey, module } = data;
        try {
            const response = await prescriptionService.getConvenioRecipeById(
                id,
                { module },
                tenantId,
                apiKey
            );
            setRecipe(response.data);
        } catch (err) {
            console.log(err);

            ErrorHandler.generic(err);
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
