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
            SwalManager.success("Impuesto creado exitosamente");
            return response;
        } catch (error) {
            console.error("Error creating tax:", error);
            ErrorHandler.getErrorMessage(error);
            SwalManager.error("Error al crear el impuesto");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        createEntities,
    };
};