import { useState, useEffect } from 'react';
import { userService } from "../../../services/api/index.js";
export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
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