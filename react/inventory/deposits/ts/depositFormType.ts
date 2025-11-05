export type DepositFormInputs = {
  name: string;
  type: string | null;
  notes?: string;
};

export interface DepositFormProps {
  formId: string;
  onSubmit: (data: DepositFormInputs) => void;
  initialData?: DepositFormInputs;
  onCancel?: () => void;
  loading?: boolean;
}