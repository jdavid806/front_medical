import { useState, useEffect, useCallback } from 'react';
import { disabilityService } from '../../../services/api/index.js';
import { DisabilityData } from '../enums/DisabilityData';

interface UseGetDataState {
  data: DisabilityData[];
  loading: boolean;
  error: string | null;
}

interface UseGetDataReturn extends UseGetDataState {
  reload: () => void;
}

export const useGetData = (patientId: number | string): UseGetDataReturn => {
  const [state, setState] = useState<UseGetDataState>({
    data: [],
    loading: false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!patientId) {
      setState(prev => ({ ...prev, data: [], loading: false, error: null }));
      return;
    }

    console.log('Starting fetch for patientId:', patientId);
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await disabilityService.getAll(patientId);
   
      const disabilities = response.data || response || [];
      
      setState(prev => ({
        ...prev,
        data: disabilities,
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error('Error fetching disabilities:', error);
      setState(prev => ({
        ...prev,
        data: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Error al cargar los datos',
      }));
    }
  }, [patientId]);

  // Alias para mantener consistencia con el componente de tabla
  const reload = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Cargar datos cuando el patientId cambie
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    reload,
  };
};

export default useGetData;
