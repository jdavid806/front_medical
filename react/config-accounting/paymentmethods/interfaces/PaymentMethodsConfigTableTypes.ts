export interface PaymentMethod {
  id: number;
  name: string;
  category: string;
  account?: {
    id: number;
    name: string;
  } | null;
  additionalDetails: string;
}

export interface Filtros {
  name: string;
  category: string | null;
}

export type ToastSeverity =
  | "info"
  | "success"
  | "warn"
  | "error"
  | "secondary"
  | "contrast";

export interface PaymentMethodsConfigTableProps {
  paymentMethods?: PaymentMethod[];
  loading?: boolean;
  onEditItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onReload: () => void;
  onCreate?: () => void;
  createLoading?: boolean;
  updateLoading?: boolean;
  deleteLoading?: boolean;
}


