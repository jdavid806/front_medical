import React, { useState } from "react";
import { comissionConfig } from "../../../services/api";
import { ErrorHandler } from "../../../services/errorHandler";

export const useCommission = () => {
    const [commission, setCommission] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchCommissionsHook = async (id: string) => {
        try {
            const data = await comissionConfig.comissionConfigGetById(id);
            setCommission(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        commission,
        setCommission,
        fetchCommissionsHook,
        loading
    };
};
