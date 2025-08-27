import { useState, useEffect, useCallback } from 'react';
import { DocumentoConsentimiento, PatientData } from '../types/DocumentData';
import { patientService } from '../../../../services/api/index.js';

interface UsePatientDocumentsState {
  documents: DocumentoConsentimiento[];
  patient: PatientData | null;
  loading: boolean;
  error: string | null;
}

interface UsePatientDocumentsReturn extends UsePatientDocumentsState {
  reload: () => void;
  setPatientId: (id: string) => void;
}

// Mock de documentos para desarrollo - reemplazar con servicio real
const mockDocuments: DocumentoConsentimiento[] = [
  {
    id: '1',
    fecha: '2024-01-15',
    titulo: 'Consentimiento Informado - Cirugía',
    motivo: 'Procedimiento quirúrgico programado',
    patient_id: '1',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    fecha: '2024-01-10',
    titulo: 'Consentimiento para Tratamiento',
    motivo: 'Tratamiento médico especializado',
    patient_id: '1',
    created_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-10T14:30:00Z'
  }
];

export const usePatientDocuments = (initialPatientId?: string): UsePatientDocumentsReturn => {
  const [state, setState] = useState<UsePatientDocumentsState>({
    documents: [],
    patient: null,
    loading: false,
    error: null,
  });

  const [patientId, setPatientId] = useState<string | undefined>(initialPatientId);

  const fetchPatientData = async (id: string) => {
    try {
      const patient = await patientService.get(id);
      setState(prev => ({
        ...prev,
        patient: {
          id: patient.id,
          first_name: patient.first_name,
          last_name: patient.last_name,
          document_number: patient.document_number,
          date_of_birth: patient.date_of_birth,
          city_id: patient.city_id,
          phone: patient.phone,
          email: patient.email,
        }
      }));
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setState(prev => ({
        ...prev,
        error: 'Error al cargar los datos del paciente'
      }));
    }
  };

  const fetchDocuments = async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // TODO: Reemplazar con llamada real a la API
      // const response = await documentService.getByPatientId(id);
      
      // Simulación de datos por ahora
      const filteredDocuments = mockDocuments.filter(doc => doc.patient_id === id);
      
      setState(prev => ({
        ...prev,
        documents: filteredDocuments,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        documents: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Error al cargar los documentos',
      }));
    }
  };

  const fetchData = useCallback(async () => {
    if (!patientId) return;

    await Promise.all([
      fetchPatientData(patientId),
      fetchDocuments(patientId)
    ]);
  }, [patientId]);

  useEffect(() => {
    if (patientId) {
      fetchData();
    }
  }, [fetchData]);

  return {
    ...state,
    reload: fetchData,
    setPatientId: (id: string) => {
      setPatientId(id);
      setState(prev => ({
        ...prev,
        documents: [],
        patient: null,
        error: null
      }));
    },
  };
};

export default usePatientDocuments;
