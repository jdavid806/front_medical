import { useState, useEffect } from 'react';
import { prescriptionService } from "../../../services/api/index.js";
import { Medicine, PrescriptionDto } from '../../models/models.js';

export const usePrescription = () => {
    const createPrescription = async (data: Medicine | Medicine[]) => {
        // Asegurarnos de que siempre se envía un array
        const medicinesArray = Array.isArray(data) ? data : [data];

        return prescriptionService.storePrescription({
            patient_id: 1,
            user_id: 1,
            is_active: true,
            medicines: medicinesArray.map(med => ({
                medication: med.medication || "",
                concentration: med.concentration || "",
                frequency: med.frequency || "N/A", // Valor por defecto
                duration: med.duration || 1,
                medication_type: med.medication_type || "N/A",
                take_every_hours: med.take_every_hours || 1,
                quantity: med.quantity || 1,
                observations: med.observations || ""
            }))
        });
    };

    return { createPrescription };
};

