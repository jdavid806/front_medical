import React, { useState } from "react";
import { ModuleDto } from "../../models/models";
import { clinicalRecordService } from "../../../services/api";
import { ErrorHandler } from "../../../services/errorHandler";

type Response = {
    "data": any | null,
    "message": string,
    "status": string
}

export const useParaclinicalByAppointment = () => {
    const [paraclinical, setParaclinical] = useState<Response | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchParaclinicalByAppointment = async (appointmentId: string) => {
        try {
            const data = await clinicalRecordService.getParaclinicalByAppointment(appointmentId) as Response | null;
            setParaclinical(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        paraclinical,
        fetchParaclinicalByAppointment,
        loading
    };
};
