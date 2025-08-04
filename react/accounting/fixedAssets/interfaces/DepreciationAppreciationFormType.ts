import { SubmitHandler } from "react-hook-form";

export interface DepreciationAppreciationFormInputs {
  type: "depreciation" | "appreciation";
  amount: number;
  date: Date;
  frequency?: string;
  percentage?: number;
  reasons?: string;
}

export interface DepreciationAppreciationFormProps {
  formId: string;
  onSubmit: SubmitHandler<DepreciationAppreciationFormInputs>;
  initialData?: DepreciationAppreciationFormInputs;
  onCancel?: () => void;
  loading?: boolean;
  currentValue: number;
}