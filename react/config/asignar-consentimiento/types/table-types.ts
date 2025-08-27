import { ReactNode } from 'react';
import { DocumentoConsentimiento } from './DocumentData';

// Interface para las columnas de la tabla
export interface DocumentTableColumn {
  field: string;
  header: string;
  body?: (rowData: DocumentoConsentimiento) => ReactNode;
  sortable?: boolean;
  frozen?: boolean;
  style?: React.CSSProperties;
}

// Interface para las props de la tabla de documentos
export interface DocumentTableProps {
  data: DocumentoConsentimiento[];
  columns: DocumentTableColumn[];
  loading?: boolean;
  lazy?: boolean;
  first?: number;
  rows?: number;
  totalRecords?: number;
  sortField?: string;
  sortOrder?: number;
  selectionActive?: boolean;
  globalFilterFields?: string[];
  customFilters?: any;
  disableSearch?: boolean;
  onSelectedRow?: (row: DocumentoConsentimiento) => void;
  onReload?: () => void;
  onSort?: (event: any) => void;
  onPage?: (event: any) => void;
  onSearch?: (searchTerm: string) => void;
}
