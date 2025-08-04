// interfaces/TaxesConfigTypes.ts
import { SubmitHandler } from "react-hook-form";

export interface Tax {
  id: number;
  name: string;
  percentage: number;
  account: {
    id: number;
    name: string;
  } | null;
  returnAccount: {
    id: number;
    name: string;
  } | null;
  description: string;
}

export interface TaxFormInputs {
    id: number;
  name: string;
  percentage: number;
  account: { id: number; name: string } | null; 
  returnAccount: { id: number; name: string } | null; 
  description: string;
l;
}

export interface TaxFormProps {
  formId: string;
  onSubmit: SubmitHandler<TaxFormInputs>;
  initialData?: TaxFormInputs;
  onCancel?: () => void;
  loading?: boolean;
  accounts: Array<{ id: number; name: string }>;
}

export interface TaxModalProps {
  isVisible: boolean;
  onSave: (data: TaxFormInputs) => Promise<void> | void;
  onClose: () => void;
  initialData?: TaxFormInputs;
  accounts: Array<{ id: number; name: string }>;
  loading?: boolean;
  closable?: boolean;
}