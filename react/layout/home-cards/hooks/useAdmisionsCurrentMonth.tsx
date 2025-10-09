import React, { useEffect, useState } from "react"
import { admissionService } from "../../../../services/api";
import { usePRToast } from "../../../hooks/usePRToast";

interface AdmisionCountData {
    year: number;
    month: number;
    month_name: string;
    period: string;
    admissions_count: number;
    date_range: string;
}



export const useAdmisionsCurrentMonth = () => {
    const [admisionCount, setAdmisionCount] = useState<AdmisionCountData | null>(null);
    const { toast, showSuccessToast, showServerErrorsToast } = usePRToast();

    const fetchAdmisionCurrentMonth = async () => {
        try {
            const response = await admissionService.getAdmisionsCurrentMonth();
            const data = response.data
            setAdmisionCount(data)
        } catch (error) {
            showServerErrorsToast(error)
        }
    }

    useEffect(() => {
        fetchAdmisionCurrentMonth()
    }, [])
    return { admisionCount, fetchAdmisionCurrentMonth, toast }
}