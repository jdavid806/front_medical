import React, { useState } from "react";
import { PrescriptionDto } from "../../models/models";
import { ErrorHandler } from "../../../services/errorHandler";
import { prescriptionService } from "../../../services/api";

export const usePrescription = () => {
    const [prescription, setPrescription] = useState<PrescriptionDto | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchPrescription = async (id: string) => {
        try {
            const data = await prescriptionService.get(id);
            setPrescription(data.data);
        } catch (err) {
            console.log(err);

            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        prescription,
        setPrescription,
        fetchPrescription,
        loading
    };
};
