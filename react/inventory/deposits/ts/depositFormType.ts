export type DepositFormInputs = {
  name: string;
  notes?: string;
};

 export interface DepositFormProps {
  formId: string;
  onSubmit: (data: DepositFormInputs) => void;
  initialData?: DepositFormInputs;
  onCancel?: () => void;
  loading?: boolean;
}