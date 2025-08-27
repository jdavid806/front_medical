// Interfaces para el módulo de asignar consentimiento

// Interface para los datos de documento de consentimiento
export interface DocumentoConsentimiento {
  id?: string;
  fecha?: string;
  titulo?: string;
  motivo?: string;
  patient_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Interface para la respuesta de la API
export interface DocumentoConsentimientoApiResponse {
  data: DocumentoConsentimiento[];
  meta?: {
    total: number;
    current_page: number;
    last_page: number;
  };
}

// Interface para los datos del paciente
export interface PatientData {
  id: string;
  first_name: string;
  last_name: string;
  document_number?: string;
  phone?: string;
  email?: string;
}

// Interface para las props del breadcrumb
export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
}

// Interface para las props de las acciones de tabla
export interface DocumentActionsProps {
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}
