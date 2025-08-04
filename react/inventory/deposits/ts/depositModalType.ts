import { DepositFormInputs } from "./depositFormType";

export interface DepositModalProps {
  isVisible: boolean;
  onSave: (data: DepositFormInputs) => void;
  initialData?: DepositFormInputs | null;
  onClose: () => void;
  closable?: boolean;
}