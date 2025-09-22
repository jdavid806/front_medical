import { useState } from "react";
import { SwalManager } from "../../../../services/alertManagerImported";
import { ErrorHandler } from "../../../../services/errorHandler";
import { entitiesService } from "../../../../services/api";
import { CreateEntitiesDTO } from "../interfaces/entitiesDTO";

export const useEntitieConfigCreate = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const createEntities = async (data: CreateEntitiesDTO) => {
        setLoading(true);
        try {
            const response = await entitiesService.storeEntity(data);
            return response;
        } catch (error: any) {
            console.error("Error creating entity:", error);

            let errorMessage = "Error al crear la entidad";

            if (error?.response?.data) {
                const errorData = error.response.data;

                if (errorData.errors) {
                    const firstField = Object.keys(errorData.errors)[0];
                    const firstError = errorData.errors[firstField]?.[0];
                    errorMessage = firstError || errorData.message || errorMessage;
                } else {
                    errorMessage = errorData.message || errorMessage;
                }
            } else {
                errorMessage = error?.message || errorMessage;
            }

            SwalManager.error(errorMessage);

            throw new Error("VALIDATION_ERROR");
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        createEntities,
    };
};