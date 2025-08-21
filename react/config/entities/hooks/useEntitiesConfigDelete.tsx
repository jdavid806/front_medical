import { useState } from "react";
import { entitiesService } from "../../../../services/api";
import { SwalManager } from "../../../../services/alertManagerImported";
import { ErrorHandler } from "../../../../services/errorHandler";

export const useEntitiesConfigDelete = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const deleteEntity = async (id: string) => {
        setLoading(true);
        setError(null);

        try {
            await entitiesService.deleteEntity(id);
            SwalManager.success("Impuesto eliminado correctamente");
            return true;
        } catch (error) {
            console.error("Error deleting tax:", error);
            ErrorHandler.getErrorMessage(error);
            SwalManager.error("Error al eliminar el impuesto");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        deleteEntity,
    };
};