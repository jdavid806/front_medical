import React from "react";
import { useState } from "react";
import { clinicalRecordService } from "../../../services/api";

export const useClinicalRecord = () => {
    const [clinicalRecord, setClinicalRecord] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getClinicalRecord = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await clinicalRecordService.get(id);
            setClinicalRecord(response);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        clinicalRecord,
        loading,
        error,
        getClinicalRecord
    };
};