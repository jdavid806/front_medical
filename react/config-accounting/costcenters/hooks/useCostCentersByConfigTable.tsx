import { useState } from "react";
import { ErrorHandler } from "../../../../services/errorHandler";
import { costCenterService } from "../../../../services/api";
import { CostCenterDTO } from "../interfaces/CostCenterDTO";


export const useCostCentersByIdConfigTable = () => {
    const [costCenter, setCostCenter] = useState<CostCenterDTO | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchCostCenterById = async (id: string | number) => {
        setLoading(true);
        try {
            const data = await costCenterService.getCostCenterById(id);
            setCostCenter(data);
            return data;
        } catch (err) {
            ErrorHandler.generic(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        costCenter,
        setCostCenter,
        fetchCostCenterById,
        loading
    };
};