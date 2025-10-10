export interface PaymentMethodFormInputs {
  name: string;
  payment_type: string;
  category: string;
  accounting_account_id: number | null;
  additionalDetails: string;
  is_cash: boolean;
}

export interface PaymentMethodFormProps {
  formId: string;
  onSubmit: (data: PaymentMethodFormInputs) => void;
  initialData?: PaymentMethodFormInputs;
  onCancel?: () => void;
  loading?: boolean;
  accounts: any[];
  isLoadingAccounts?: boolean;
}

export interface PaymentMethodDTO {
  id: number;
  method: string;
  description: string;
  payment_type: string;
  created_at: string;
  updated_at: string;
  account: string | null;
  accounting_account_id: number | null;
  category: string | null;
  is_cash: boolean;

}