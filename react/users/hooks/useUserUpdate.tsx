import React, { useState } from 'react';
import { ErrorHandler } from "../../../services/errorHandler";
import { SwalManager } from '../../../services/alertManagerImported';
import { UserFormInputs } from '../UserForm';
import { userService } from '../../../services/api';

export const useUserUpdate = () => {
    const [loading, setLoading] = useState(true);

    const updateUser = async (id: string, data: UserFormInputs) => {
        setLoading(true);
        try {
            await userService.update(id, data);
            SwalManager.success();
        } catch (error) {
            ErrorHandler.generic(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        updateUser,
        loading
    };
};
