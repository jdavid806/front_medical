import { useState, useEffect } from 'react';
import { userService } from "../../../services/api/index.js";
import { UserDto } from '../../models/models.js';

export const useUsers = () => {
    const [users, setUsers] = useState<UserDto[]>([]);

    const fetchUsers = async () => {
        try {
            const data: UserDto[] = await userService.getAll();
            console.log('users', data);

            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return { users, fetchUsers };
};

