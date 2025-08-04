import { useState } from "react";
import { SwalManager } from "../../../../services/alertManagerImported";
import { ErrorHandler } from "../../../../services/errorHandler";
import { taxesService } from "../../../../services/api";

export const useTaxesDeleteTable = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const deleteTax = async (id: string | number) => {
        setLoading(true);
        setError(null);
        
        try {
            await taxesService.deleteTax(id);
            SwalManager.success("Impuesto eliminado correctamente");
            return true;
         } catch (error) {
            console.error("Error delete taxes :", error);
            ErrorHandler.getErrorMessage(error);
            SwalManager.error("Error al Eliminar Impuesto");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        deleteTax,
    };
};