import React, { useState } from 'react';
import { ErrorHandler } from "../../../services/errorHandler";
import { SwalManager } from '../../../services/alertManagerImported';
import { userService } from '../../../services/api';

export const useUserUpdate = () => {
    const [loading, setLoading] = useState(true);

    const updateUser = async (id: string, data: any) => {
        setLoading(true);
        try {
            const response = await userService.update(id, data);
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
        updateUser,
        loading
    };
};
