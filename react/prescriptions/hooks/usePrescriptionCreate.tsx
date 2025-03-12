import { prescriptionService } from "../../../services/api/index.js";
import { Medicine } from '../../models/models.js';
import { ErrorHandler } from '../../../services/errorHandler.js'
import { SwalManager } from '../../../services/alertManagerImported.js'
import { PrescriptionFormInputs } from "../components/PrescriptionForm.js";

export const usePrescriptionCreate = () => {
    const createPrescription = async (data: PrescriptionFormInputs) => {

        const preparedData = data
        preparedData.medicines = preparedData.medicines.map((med: Medicine) => ({
            medication: med.medication || "",
            concentration: med.concentration || "",
            frequency: med.frequency || "N/A", // Valor por defecto
            duration: med.duration || 1,
            medication_type: med.medication_type || "N/A",
            take_every_hours: med.take_every_hours || 1,
            quantity: med.quantity || 1,
            observations: med.observations || "",
            showQuantity: med.showQuantity || false,
            showTimeField: med.showTimeField || false
        }))

        try {
            await prescriptionService.storePrescription(preparedData);
            SwalManager.success()
        } catch (error) {
            ErrorHandler.generic(error)
        }
    };

    return { createPrescription };
};

