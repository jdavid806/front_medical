import { SubmitHandler } from "react-hook-form";
import { TaxFormInputs } from "./TaxesConfigDTO";


export interface TaxesFormData {
    name: string;
    percentage: number;
    accounting_account: string;
    description: string;
    accounting_account_reverse_id: number;
}

export interface TaxFormProps {
  formId: string;
  onSubmit: SubmitHandler<TaxFormInputs>;
  initialData?: TaxFormInputs;
  onCancel?: () => void;
  loading?: boolean;
  accounts: {
    id: number;
    account_name: string;
    account_code: string;
  }[];
}