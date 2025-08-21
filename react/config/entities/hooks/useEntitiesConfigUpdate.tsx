import { useState } from "react";
import { ErrorHandler } from "../../../../services/errorHandler";
import { entitiesService } from "../../../../services/api";
import { SwalManager } from "../../../../services/alertManagerImported";
import { UpdateEntitiesDTO } from "../interfaces/entitiesDTO";

export const useEntitiesConfigUpdate = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateEntities = async (id: string | number, data: UpdateEntitiesDTO) => {
        setLoading(true);
        setError(null);
        try {
            const response = await entitiesService.updateEntity(id, data);
            SwalManager.success("Impuesto actualizado correctamente");
            return response;
        } catch (error) {
            console.error("Error updating tax:", error);
            ErrorHandler.getErrorMessage(error);
            SwalManager.error("Error al eliminar el impuesto");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateEntities,
        loading,
        error
    };
};