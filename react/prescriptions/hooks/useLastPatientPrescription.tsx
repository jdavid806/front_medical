import { useState } from "react";
import { prescriptionService } from "../../../services/api";

export const useLastPatientPrescription = () => {
    const [lastPatientPrescription, setLastPatientPrescription] = useState<any | null>(null);

    const loadLastPatientPrescription = async (patientId: string) => {
        setLastPatientPrescription(null)
        try {
            const lastRecipe = await prescriptionService.getLastByPatientId(patientId);
            setLastPatientPrescription(lastRecipe.data);
            return lastRecipe.data;
        } catch (error) {
            console.log(error);
        }
    }

    return {
        lastPatientPrescription,
        setLastPatientPrescription,
        loadLastPatientPrescription
    }
}
