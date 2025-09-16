import React, { useEffect, useState } from "react";
import { packagesService } from "../../../services/api";

export const useClinicalPackage = () => {
    const [clinicalPackage, setClinicalPackage] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchClinicalPackage = async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await packagesService.get(id);
            setClinicalPackage(response.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        clinicalPackage,
        loading,
        error,
        fetchClinicalPackage,
    };
};