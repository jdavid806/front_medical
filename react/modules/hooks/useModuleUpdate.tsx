import React, { useState } from 'react';
import { moduleService } from "../../../services/api/index";
import { ErrorHandler } from "../../../services/errorHandler";
import { SwalManager } from '../../../services/alertManagerImported';

export const useModuleUpdate = () => {
    const [loading, setLoading] = useState(true);

    const updateModule = async (id: string, data: any) => {
        setLoading(true);
        try {
            await moduleService.update(id, data);
            SwalManager.success()
        } catch (error) {
            ErrorHandler.generic(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        updateModule,
        loading
    };
};
