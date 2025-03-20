import { useState, useEffect } from 'react';
import { userService } from "../../../services/api/index.js";
export const useAllTableUsers = () => {
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    userService.getAll().then(users => {
      console.log(users);
      setUsers(users.map(user => ({
        id: user.id,
        fullName: `${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''} ${user.second_last_name || ''}`,
        role: user.role?.name || '--',
        city: user.city_id,
        phone: user.phone,
        email: user.email,
        roleGroup: user.role?.group || 'INDETERMINATE'
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