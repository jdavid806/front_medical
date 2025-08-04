import { TaxFormInputs } from "./TaxesConfigDTO";

export interface TaxModalProps {
  isVisible: boolean;
  onSave: (data: TaxFormInputs) => Promise<void> | void;
  initialData?: TaxFormInputs;
  onClose: () => void;
  closable?: boolean;
  accounts: {
    id: number;
    account_name: string;
    account_code: string;
  }[];
  loading?: boolean;
}