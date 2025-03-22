import { useState, useEffect } from 'react';
import { userService } from "../../../services/api/index.js";
import { UserDto } from '../../models/models.js';

export const useUsersForSelect = () => {
    const [users, setUsers] = useState<{ value: string, label: string }[]>([]);

    const fetchUsers = async () => {
        try {
            const data: UserDto[] = await userService.getAll();
            const mappedData = data.map(user => {
                return {
                    external_id: user.external_id,
                    value: user.id.toString(),
                    label: `${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''} ${user.second_last_name || ''}`
                }
            })
            setUsers(mappedData);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return { users };
};

