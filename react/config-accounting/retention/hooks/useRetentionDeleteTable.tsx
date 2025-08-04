import { useState } from "react";
import { retentionsService } from "../../../../services/api";
import { SwalManager } from "../../../../services/alertManagerImported";
import { ErrorHandler } from "../../../../services/errorHandler";

export const useRetentionDeleteTable = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const deleteRetention = async (id: string | number) => {
        setLoading(true);
        setError(null);
        
        try {
            await retentionsService.deleteRetention(id);
            SwalManager.success("Retención eliminada correctamente");
            return true;
        } catch (error) {
            console.error('Error eliminar retention:', error);
            ErrorHandler.generic(error);
            SwalManager.error("Error al eliminar retención");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        deleteRetention,
    };
};