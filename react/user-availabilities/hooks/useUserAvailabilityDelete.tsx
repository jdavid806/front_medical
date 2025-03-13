import { useState } from 'react';
import { userAvailabilityService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from '../../../services/alertManagerImported.js';

export const useUserAvailabilityDelete = () => {
    const [loading, setLoading] = useState(false);

    const deleteUserAvailability = async (id: string) => {
        let confirmed = false
        try {
            await SwalManager.confirmDelete(
                async () => {
                    setLoading(true);
                    await userAvailabilityService.delete(id);
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
        deleteUserAvailability,
        loading
    };
};
