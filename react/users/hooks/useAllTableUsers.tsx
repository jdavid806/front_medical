import { useState, useEffect, useCallback } from 'react';
import { userService } from "../../../services/api/index.js";
import { UserDto, UserTableItem } from '../../models/models.js';

export const useAllTableUsers = () => {
    const [users, setUsers] = useState<UserTableItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const usersData: UserDto[] = await userService.getAll();


            setUsers(usersData.map(user => ({
                id: user.id,
                fullName: `${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''} ${user.second_last_name || ''}`.trim(),
                role: user.role?.name || '--',
                city: user.city_id,
                phone: user.phone,
                email: user.email,
                roleGroup: user.role?.group || 'INDETERMINATE',
                signatureMinioUrl: user.firma_minio_url,
                imageMinioUrl: user.image_minio_url
            })));
        } catch (err) {
            setError('Error al cargar los usuarios');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshUsers = useCallback(async () => {
        console.log("🔄 Manual refresh triggered for users");
        await fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        fetchUsers();
    }, []);

    return {
        users,
        loading,
        error,
        fetchUsers,
        refreshUsers
    };
};