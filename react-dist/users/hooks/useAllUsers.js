import { useState, useEffect } from 'react';
import { userService } from "../../../services/api/index.js";
export const useAllUsers = () => {
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    userService.getAll().then(users => {
      setUsers(users.map(user => ({
        fullName: `${user.first_name} ${user.last_name}`,
        specialty: (user.user_specialty_id ? user.user_specialty_id : 'Especialidad Mock').toString(),
        gender: 'Masculino',
        phone: '000-000-0000',
        email: 'correo@ejemplo.com'
      })));
    });
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  return {
    users,
    fetchUsers
  };
};