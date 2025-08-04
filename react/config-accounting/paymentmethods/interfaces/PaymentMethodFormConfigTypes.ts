import { SubmitHandler } from "react-hook-form";

export interface PaymentMethodFormInputs {
  name: string;
  category: string;
  account: { id: number; name: string } | null;
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
}

export interface PaymentMethodDTO {
  id: number;
  method: string;
  description: string;
  created_at: string;
  updated_at: string;
  account: string | null;
  accounting_account_id: number;
  category: string | null;
}