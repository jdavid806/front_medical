// interfaces/CostCenterFormConfigType.ts
export interface CostCenterFormInputs {
  id: number;
  name: string;
  code: string;
  description: string;
}

export interface CostCenterFormProps {
  formId: string;
  onSubmit: (data: CostCenterFormInputs) => void;
  initialData?: Partial<CostCenterFormInputs>;
  onCancel?: () => void;
  loading?: boolean;
}