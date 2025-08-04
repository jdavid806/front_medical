import React, { useState } from 'react';
import { userAbsenceService } from "../../../services/api/index";
import { ErrorHandler } from "../../../services/errorHandler";
import { SwalManager } from '../../../services/alertManagerImported';

export const useUserAbsenceUpdate = () => {
    const [loading, setLoading] = useState(true);

    const updateUserAbsence = async (id: string, data: any) => {
        setLoading(true);
        try {
            await userAbsenceService.update(id, data);
            SwalManager.success()
        } catch (error) {
            ErrorHandler.generic(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        updateUserAbsence,
        loading
    };
};
