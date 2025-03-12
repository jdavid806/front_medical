import React, { useState } from 'react';
import { prescriptionService } from "../../../services/api/index";
import { ErrorHandler } from "../../../services/errorHandler";
import { SwalManager } from '../../../services/alertManagerImported';
import { PrescriptionFormInputs } from '../components/PrescriptionForm';

export const usePrescriptionUpdate = () => {
    const [loading, setLoading] = useState(true);

    const updatePrescription = async (id: string, data: Partial<PrescriptionFormInputs>) => {
        setLoading(true);
        try {
            await prescriptionService.update(id, data);
            SwalManager.success();
        } catch (error) {
            ErrorHandler.generic(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        updatePrescription,
        loading
    };
};
