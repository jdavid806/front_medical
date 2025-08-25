export interface PaymentMethod {
  id: number;
  name: string;
  payment_type: string;
  category: string;
  account: {
    id: number;
    name: string;
  } | null;
  additionalDetails: string;
}

export interface PaymentMethodFormInputs {
  name: string;
  category: string;
  payment_type: string;
  account: {
    id: number;
    name: string;
  } | null;
  returnAccount: {
    id: number;
    name: string;
  } | null;
  additionalDetails: string;
}

export interface Filtros {
  name: string;
  category: string | null;
}

export type ToastSeverity = 'success' | 'info' | 'warn' | 'error';

export interface PaymentMethodsConfigTableProps {
  paymentMethods: PaymentMethod[];
  onEditItem: (id: string) => void;
}

export interface PaymentMethodModalProps {
  isVisible: boolean;
  onSave: (data: PaymentMethodFormInputs) => Promise<void> | void;
  onClose: () => void;
  initialData?: PaymentMethodFormInputs;
  accounts: Array<{ id: number; name: string }>;
  loading?: boolean;
  closable?: boolean;
}