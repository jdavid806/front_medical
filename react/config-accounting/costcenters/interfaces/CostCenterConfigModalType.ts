// interfaces/CostCenterConfigModalType.ts

import { CostCenterFormInputs } from "./CostCenterFormConfigType";

export interface CostCenterModalProps {
  isVisible: boolean;
  onSave: (data: CostCenterFormInputs) => void;
  onClose: () => void;
  initialData?: Partial<CostCenterFormInputs>;
  closable?: boolean;
  loading?: boolean;
}