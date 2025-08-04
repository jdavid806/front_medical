// interfaces/MaintenanceFormTypes.ts
import { SubmitHandler } from "react-hook-form";
import { FixedAsset } from "./FixedAssetsTableTypes";

export interface MaintenanceFormInputs {
  assetStatus: string;
  assignedTo: string;
  maintenanceDate: Date;
  maintenanceType: string;
  comments: string;
  cost?: number;
  nextMaintenanceDate?: Date;
}

export interface MaintenanceModalProps {
  isVisible: boolean;
  onSave: (data: MaintenanceFormInputs) => Promise<void> | void;
  onClose: () => void;
  asset: FixedAsset;
  closable?: boolean;
  statusOptions: { label: string; value: string }[];
  maintenanceTypeOptions: { label: string; value: string }[];
  userOptions: { label: string; value: string }[];
}

export interface MaintenanceFormProps {
  formId: string;
  onSubmit: SubmitHandler<MaintenanceFormInputs>;
  initialData?: Partial<MaintenanceFormInputs>;
  onCancel?: () => void;
  loading?: boolean;
  statusOptions: { label: string; value: string }[];
  maintenanceTypeOptions: { label: string; value: string }[];
  userOptions: { label: string; value: string }[];
  currentStatus: string;
  asset: FixedAsset;
}