import { useState } from 'react';
import { prescriptionService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from '../../../services/alertManagerImported.js';

export const usePrescriptionDelete = () => {
    const [loading, setLoading] = useState(false);

    const deletePrescription = async (id: string) => {
        let confirmed = false;
        try {
            await SwalManager.confirmDelete(
                async () => {
                    setLoading(true);
                    await prescriptionService.delete(id);
                    confirmed = true;
                }
            );
            return confirmed;
        } catch (err) {
            ErrorHandler.generic(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        deletePrescription,
        loading
    };
};

