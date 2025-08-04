import { useState, useEffect } from 'react';
import { userService } from "../../../services/api/index.js";
export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    try {
      const data = await userService.getAll();
      const mappedData = data.map(user => {
        const fullName = `${user.first_name || ''} ${user.last_name || ''} ${user.middle_name || ''} ${user.second_last_name || ''}`.trim();
        return {
          ...user,
          full_name: fullName,
          label: fullName
        };
      });
      setUsers(mappedData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  return {
    users,
    fetchUsers
  };
};