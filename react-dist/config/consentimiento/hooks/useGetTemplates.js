import { useState, useEffect } from 'react';
import { consentimientoService } from '../../../../services/api/index.js';
export const useGetTemplates = () => {
  const [state, setState] = useState({
    templates: [],
    loading: false,
    error: null
  });
  const fetchTemplates = async () => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));
    try {
      const response = await consentimientoService.getTemplate();
      const rawData = response.data || response || [];

      // Transform the API response to extract id and name
      const templates = rawData.map(item => ({
        id: item.id,
        name: item.attributes.name,
        // Include other attributes if needed (excluding name to avoid duplication)
        ...Object.fromEntries(Object.entries(item.attributes).filter(([key]) => key !== 'name'))
      }));
      setState(prev => ({
        ...prev,
        templates,
        loading: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        templates: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Error al cargar los templates'
      }));
    }
  };
  useEffect(() => {
    fetchTemplates();
  }, []);
  return {
    ...state,
    reload: fetchTemplates
  };
};
export default useGetTemplates;