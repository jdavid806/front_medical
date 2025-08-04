import { FixedAssetsFormInputs } from "./FixedAssetsFormTypes";


export interface FixedAssetsModalProps {
  isVisible: boolean;
  onSave: (data: FixedAssetsFormInputs) => void;
  initialData?: FixedAssetsFormInputs;
  onClose: () => void;
  assetName?: string;
  closable?: boolean;
}
