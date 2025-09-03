import { Retention } from "./RetentionFormConfigType";

export interface Account {
  id: string; 
  name: string;
}


export interface Filtros {
  name: string;
  percentage: number | null;
  account: string | null; 
}

export interface RetentionConfigTableProps {
  retentions: Retention[];
  onEditItem: (id: string) => void;
  onDeleteItem?: (id: string) => void;
  loading?: boolean;
}

export type ToastSeverity = 'success' | 'info' | 'warn' | 'error';
