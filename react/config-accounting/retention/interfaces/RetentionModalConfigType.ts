import { RetentionFormInputs } from "./RetentionDTO";

export interface Account {
  id: string; 
  name: string;
}

export interface RetentionModalProps {
  isVisible: boolean;
  onSave: (data: RetentionFormInputs) => Promise<void> | void;
  onClose: () => void;
  initialData?: RetentionFormInputs;
  loading?: boolean;
  closable?: boolean;
    accounts: {
    id: number;
    account_name: string;
    account_code: string;
  }[]
}