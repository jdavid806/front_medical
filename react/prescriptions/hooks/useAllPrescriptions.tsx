import { useState, useEffect } from 'react';
import { prescriptionService } from "../../../services/api/index.js";
import { PrescriptionDto, PrescriptionTableItem } from '../../models/models.js';

export const useAllPrescriptions = () => {
    const [prescriptions, setPrescriptions] = useState<PrescriptionTableItem[]>([]);

    const fetchPrescriptions = async () => {
        try {
            const { data: prescriptionData } = await prescriptionService.getPrescriptions();
            const prescriptionItems: PrescriptionTableItem[] = prescriptionData.map(prescription => ({
                doctor: `${prescription.prescriber.first_name} ${prescription.prescriber.last_name}`,
                patient: `${prescription.patient.first_name} ${prescription.patient.last_name}`,
                created_at: prescription.created_at
            }));
            setPrescriptions(prescriptionItems);
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
        }
    };

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    return { prescriptions, fetchPrescriptions };
};
