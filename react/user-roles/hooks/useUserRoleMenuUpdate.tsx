import React, { useState } from 'react';
import { userRolesService } from "../../../services/api/index";
import { ErrorHandler } from "../../../services/errorHandler";
import { SwalManager } from '../../../services/alertManagerImported';
import { UserRoleFormInputs } from '../components/UserRoleForm';

export const useUserRoleMenuUpdate = () => {
    const [loading, setLoading] = useState(true);

    const updateUserRoleMenu = async (id: string, data: UserRoleFormInputs) => {
        setLoading(true);
        try {
            const selectedMenus = data.menuIds.map(menuId => ({
                id: menuId,
                is_active: true
            }));

            await userRolesService.updateRoleMenus(id, selectedMenus);
            SwalManager.success()
        } catch (error) {
            ErrorHandler.generic(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        updateUserRoleMenu,
        loading
    };
};