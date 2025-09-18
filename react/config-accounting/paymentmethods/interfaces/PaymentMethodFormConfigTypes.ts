import { SubmitHandler } from "react-hook-form";

export interface PaymentMethodFormInputs {
  method: string;
  name: string;
  payment_type: string;
  category: string;
  accounting_account_id: number | null;
  additionalDetails: string;
}

export interface PaymentMethodFormProps {
  formId: string;
  onSubmit: SubmitHandler<PaymentMethodFormInputs>;
  initialData?: PaymentMethodFormInputs;
  onCancel?: () => void;
  loading?: boolean;
  accounts: {
    id: number;
    name: string;
  }[];
  isLoadingAccounts: boolean;
}

export interface PaymentMethodDTO {
  id: number;
  method: string;
  description: string;
  payment_type: string;
  created_at: string;
  updated_at: string;
  account: string | null;
  accounting_account_id: number;
  category: string | null;
}