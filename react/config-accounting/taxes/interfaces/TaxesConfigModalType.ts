import { TaxFormInputs } from "./TaxesConfigFormType";

export interface TaxModalProps {
  isVisible: boolean;
  onSave: (data: TaxFormInputs) => Promise<void> | void;
  onClose: () => void;
  initialData?: TaxFormInputs;
  accounts: Array<{ id: number; name: string }>;
  loading?: boolean;
  closable?: boolean;
}