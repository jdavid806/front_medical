import { useState, useEffect, useCallback } from 'react';
import { userService } from '../../../services/api/index.js';

export interface User {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  second_last_name?: string;
  specialty?: {
    name: string;
  };
  user_specialty_name?: string;
}

interface UseUsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

interface UseUsersReturn extends UseUsersState {
  reload: () => void;
}

export const useUsers = (): UseUsersReturn => {
  const [state, setState] = useState<UseUsersState>({
    users: [],
    loading: false,
    error: null,
  });

  const fetchUsers = useCallback(async () => {
    console.log('Starting fetch users');
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await userService.getAllUsers();
      const users = response.data || response || [];
      
      setState(prev => ({
        ...prev,
        users: users,
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      setState(prev => ({
        ...prev,
        users: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Error al cargar usuarios',
      }));
    }
  }, []);

  const reload = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    ...state,
    reload,
  };
};

export default useUsers;
