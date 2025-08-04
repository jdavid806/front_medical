import React, { useState } from "react";
import { admissionService } from "../../../services/api";
import { ErrorHandler } from "../../../services/errorHandler";

export const useAdmission = () => {
    const [admission, setAdmission] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchAdmission = async (id: string) => {
        try {
            const data = await admissionService.get(id);
            setAdmission(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        admission,
        fetchAdmission,
        loading
    };
};
