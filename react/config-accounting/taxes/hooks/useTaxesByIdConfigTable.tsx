import { useState } from "react";
import { ErrorHandler } from "../../../../services/errorHandler";
import { TaxDTO } from "../interfaces/TaxesConfigDTO";
import { taxesService } from "../../../../services/api";

export const useTaxesByIdConfigTable = () => {
    const [tax, setTax] = useState<TaxDTO | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchTaxById = async (id: string | number) => {
        setLoading(true);
        try {
            const data = await taxesService.getTaxById(id);
            setTax(data);
            return data;
        } catch (err) {
            ErrorHandler.generic(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        tax,
        setTax,
        fetchTaxById,
        loading
    };
};