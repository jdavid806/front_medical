import { useState, useEffect, useCallback } from 'react';
import { consentimientoService } from '../../../../services/api/index.js';

export interface Template {
  id: number;
  name: string;
  description?: string;
  [key: string]: any;
}

interface ApiTemplateResponse {
  type: string;
  id: number;
  attributes: {
    name: string;
    [key: string]: any;
  };
  links: {
    self: string;
  };
  include: any[];
}

interface UseGetTemplatesState {
  templates: Template[];
  loading: boolean;
  error: string | null;
}

interface UseGetTemplatesReturn extends UseGetTemplatesState {
  reload: () => void;
}

export const useGetTemplates = (): UseGetTemplatesReturn => {
  const [state, setState] = useState<UseGetTemplatesState>({
    templates: [],
    loading: false,
    error: null,
  });

  const fetchTemplates = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await consentimientoService.getTemplate();
   
      const rawData = response.data || response || [];
      
      // Transform the API response to extract id and name
      const templates: Template[] = rawData.map((item: ApiTemplateResponse) => ({
        id: item.id,
        name: item.attributes.name,
        // Include other attributes if needed (excluding name to avoid duplication)
        ...Object.fromEntries(
          Object.entries(item.attributes).filter(([key]) => key !== 'name')
        )
      }));
      
      setState(prev => ({
        ...prev,
        templates,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        templates: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Error al cargar los templates',
      }));
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    ...state,
    reload: fetchTemplates,
  };
};

export default useGetTemplates;
