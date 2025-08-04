import { useState } from "react";
import { SwalManager } from "../../../../services/alertManagerImported";
import { ErrorHandler } from "../../../../services/errorHandler";
import { CreateTaxDTO } from "../interfaces/TaxesConfigDTO";
import { taxesService } from "../../../../services/api";


export const useTaxesCreateTable = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const createTax = async (data: CreateTaxDTO) => { 
        setLoading(true);
        try {
            const response = await taxesService.storeTax(data);
            SwalManager.success("Impuesto creado exitosamente");
            return response;
        } catch (error) {
            console.error("Error creating tax:", error);
            ErrorHandler.getErrorMessage(error);
            SwalManager.error("Error al crear impuesto");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        createTax,
    };
};