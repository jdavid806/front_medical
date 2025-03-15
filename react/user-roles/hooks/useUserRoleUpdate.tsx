import React, { useState } from 'react';
import { userRolesService } from "../../../services/api/index";
import { ErrorHandler } from "../../../services/errorHandler";
import { SwalManager } from '../../../services/alertManagerImported';
import { UserRoleFormInputs } from '../components/UserRoleForm';

export const useUserRoleUpdate = () => {
    const [loading, setLoading] = useState(true);

    const updateUserRole = async (id: string, data: UserRoleFormInputs) => {
        setLoading(true);
        try {
            await userRolesService.updateMenusPermissions(id, data);
            SwalManager.success()
        } catch (error) {
            ErrorHandler.generic(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        updateUserRole,
        loading
    };
};
