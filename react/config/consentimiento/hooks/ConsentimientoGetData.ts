import { useState, useEffect, useCallback } from 'react';
import { consentimientoService } from '../../../../services/api/index.js';
import { ConsentimientoData, TemplateDocumentApiResponse, TemplateDocument } from '../enums/ConsentimientoData';

interface UseGetDataState {
  data: ConsentimientoData[];
  loading: boolean;
  error: string | null;
}

interface UseGetDataReturn extends UseGetDataState {
  reload: () => void;
}

// Función helper para transformar datos de la API al formato esperado por la tabla
const transformApiDataToTableFormat = (apiData: TemplateDocument[]): ConsentimientoData[] => {
  return apiData.map((item) => ({
    id: item.id.toString(),
    tenant_id: item.attributes.tenant_id,
    title: item.attributes.title,
    data: item.attributes.data,
    template_type_id: item.attributes.template_type_id,
    description: item.attributes.description,
  }));
};

export const useGetData = (): UseGetDataReturn => {
  const [state, setState] = useState<UseGetDataState>({
    data: [],
    loading: false,
    error: null,
  });

  const fetchData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await consentimientoService.getAll();
      
      // Manejar tanto el formato nuevo de la API como el formato antiguo
      let transformedData: ConsentimientoData[] = [];
      
      if (response.data && Array.isArray(response.data)) {
        // Nuevo formato de API con estructura anidada
        if (response.data.length > 0 && response.data[0].attributes) {
          transformedData = transformApiDataToTableFormat(response.data);
        } else {
          // Formato antiguo donde data ya está aplanado
          transformedData = response.data;
        }
      } else if (Array.isArray(response)) {
        // Respuesta directa como array
        if (response.length > 0 && response[0].attributes) {
          transformedData = transformApiDataToTableFormat(response);
        } else {
          transformedData = response;
        }
      } else {
        transformedData = [];
      }
      
      setState(prev => ({
        ...prev,
        data: transformedData,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        data: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Error al cargar los datos',
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    ...state,
    reload: fetchData,
  };
};

export default useGetData;
