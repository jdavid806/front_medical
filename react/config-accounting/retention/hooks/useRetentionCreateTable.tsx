import { useState } from "react";
import { SwalManager } from "../../../../services/alertManagerImported";
import { ErrorHandler } from "../../../../services/errorHandler";
import { retentionsService } from "../../../../services/api";
import { CreateRetentionDTO } from "../interfaces/RetentionDTO";

export const useRetentionCreateTable = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const createRetention = async (data: CreateRetentionDTO) => { 
        setLoading(true);
        try {
            const response = await retentionsService.storeRetention(data);
            SwalManager.success("Retención creada exitosamente");
            return response;
        } catch (error) {
            console.error("Error creating retention:", error);
            ErrorHandler.getErrorMessage(error);
            SwalManager.error("Error al crear retención");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        createRetention,
    };
};