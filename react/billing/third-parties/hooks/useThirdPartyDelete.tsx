import { useState } from 'react';
import { thirdPartyService } from '../../../../services/api/index.js';
import { SwalManager } from '../../../../services/alertManagerImported.js';
import { ErrorHandler } from '../../../../services/errorHandler.js';

export const useThirdPartyDelete = () => {
    const [loading, setLoading] = useState(false);

    const deleteThirdParty = async (id: string) => {
        let confirmed = false
        try {
            await SwalManager.confirmDelete(
                async () => {
                    setLoading(true);
                    await thirdPartyService.delete(id);
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
        deleteThirdParty,
        loading
    };
};
