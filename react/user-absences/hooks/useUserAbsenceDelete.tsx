import { useState } from 'react';
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from '../../../services/alertManagerImported.js';
import { userAbsenceService } from '../../../services/api/index.js';

export const useUserAbsenceDelete = () => {
    const [loading, setLoading] = useState(false);

    const deleteUserAbsence = async (id: string) => {
        let confirmed = false
        try {
            await SwalManager.confirmDelete(
                async () => {
                    setLoading(true);
                    await userAbsenceService.delete(id);
                    confirmed = true
                }
            )
            return confirmed
        } catch (err) {
            ErrorHandler.generic(err)
            return false
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteUserAbsence,
        loading
    };
};
