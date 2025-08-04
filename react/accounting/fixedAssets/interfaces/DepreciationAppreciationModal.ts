import { DepreciationAppreciationFormInputs } from "./DepreciationAppreciationFormType";
import { FixedAsset } from "./FixedAssetsTableTypes";

export interface DepreciationAppreciationModalProps {
  isVisible: boolean;
  onSave: (data: DepreciationAppreciationFormInputs) => Promise<void>;
  onClose: () => void;
  asset: FixedAsset;
  closable?: boolean;
}
