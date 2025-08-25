
// Interfaz para los atributos del documento de plantilla
export interface TemplateDocumentAttributes {
  tenant_id: string;
  title: string;
  data: string;
  template_type_id: number;
  description: string;
}

// Interfaz para los links del documento
export interface TemplateDocumentLinks {
  self: string;
}

// Interfaz para el documento de plantilla completo
export interface TemplateDocument {
  type: string;
  id: number;
  attributes: TemplateDocumentAttributes;
  relationships: any[]; // Puede ser más específico si conoces la estructura
  links: TemplateDocumentLinks;
  included: any[]; // Puede ser más específico si conoces la estructura
}

// Interfaz para la respuesta completa de la API
export interface TemplateDocumentApiResponse {
  data: TemplateDocument[];
}

// Interfaz original mantenida para compatibilidad con el formulario
export interface ConsentimientoData {
  id?: string;
  tenant_id?: string;
  title?: string;
  data?: string;
  template_type_id?: number;
  description?: string;
}

// Interfaz extendida que incluye todos los campos de la API
export interface ConsentimientoDataComplete {
  type?: string;
  id?: number;
  tenant_id?: string;
  title?: string;
  data?: string;
  template_type_id?: number;
  description?: string;
  relationships?: any[];
  links?: TemplateDocumentLinks;
  included?: any[];
}


