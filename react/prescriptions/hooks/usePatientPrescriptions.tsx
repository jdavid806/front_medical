import { useState, useEffect } from 'react';
import { prescriptionService } from "../../../services/api/index.js";
import { PrescriptionDto } from '../../models/models.js';

export const usePatientPrescriptions = () => {
    const [prescriptions, setPrescriptions] = useState<PrescriptionDto[]>([]);

    const fetchPrescriptions = async (patientId: string, type: string = "") => {
        try {
            const { data: prescriptionData } = await prescriptionService.getPrescriptions(type);
            const finalData = prescriptionData.filter(recipe => recipe.is_active && recipe.patient_id == patientId);
            setPrescriptions(finalData);
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
        }
    };

    return { prescriptions, fetchPrescriptions };
};
