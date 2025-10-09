import React, { useEffect, useState } from "react"
import { usePRToast } from "../../../hooks/usePRToast";
import { appointmentService } from "../../../../services/api";

interface AppointmentConsultaion {
    date: string;
    completed_consultations: number;
    total_consultations: number;
    ratio: number;
    display: string;
}


export const useAppointmentsConsultationsToday = () => {
    const [apointmentCount, setApoinmentCount] = useState<AppointmentConsultaion | null>(null)
    const { toast, showSuccessToast, showServerErrorsToast } = usePRToast();

    const fetchAppointmentConsultationsToday = async () => {
        try {
            const response = await appointmentService.getAppointmentsConsultationsToday();
            const data = response.data;
            setApoinmentCount(data);
        } catch (error) {
            showServerErrorsToast(error)
        }
    }

    useEffect(() => {
        fetchAppointmentConsultationsToday();
    }, [])

    return { apointmentCount, fetchAppointmentConsultationsToday, toast }
}