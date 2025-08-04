import React, { useState } from 'react';
import { thirdPartyService } from '../../../../services/api';
import { SwalManager } from '../../../../services/alertManagerImported';
import { ErrorHandler } from '../../../../services/errorHandler';

export const useThirdPartyUpdate = () => {
    const [loading, setLoading] = useState(true);

    const updateThirdParty = async (id: string, data: any) => {
        setLoading(true);
        try {
            const response = await thirdPartyService.update(id, data);
            SwalManager.success();
            return response;
        } catch (error) {
            ErrorHandler.generic(error);
            throw error
        } finally {
            setLoading(false);
        }
    };

    return {
        updateThirdParty,
        loading
    };
};
