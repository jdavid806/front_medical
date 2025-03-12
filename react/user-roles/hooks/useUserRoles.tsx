import { useState, useEffect } from 'react';
import { UserRoleDto } from '../../models/models';
import { userRolesService } from '../../../services/api';
import { ErrorHandler } from '../../../services/errorHandler';

export const useRoles = () => {
    const [userRoles, setUserRoles] = useState<UserRoleDto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUserRoles = async () => {
        try {
            const data = await userRolesService.active();
            console.log('Roles:', data);

            setUserRoles(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserRoles();
    }, []);

    return {
        userRoles,
        fetchUserRoles,
        loading
    };
};