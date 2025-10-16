import { useState } from "react";
import { farmaciaService } from "../../../../services/api";
import { PrescriptionDto } from "../../../models/models";


export const useAllRecipes = () => {

    const [recipes, setRecipes] = useState<PrescriptionDto[]>([]);

    const fetchAllRecipes = async (status: string, search: string) => {
        try {
            const recipesResponse = await farmaciaService.getAllRecipes(status, search);

            const filteredRecipes = Array.isArray(recipesResponse)
                ? recipesResponse
                : recipesResponse?.data || [];
            setRecipes(filteredRecipes);
        } catch (error: any) {
            console.error(error)
            throw error;
        }
    }

    return {
        fetchAllRecipes,
        recipes
    }
}