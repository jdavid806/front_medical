// interfaces/RetentionConfigTypes.ts
import { SubmitHandler } from "react-hook-form";
import { RetentionFormInputs } from "./RetentionDTO";
import { Account } from "./RetentionConfigTableType";

export interface Retention {
  id: number;
  name: string;
  percentage: number;
 account: Account | null;
  returnAccount: Account | null;
  description: string;

}


export interface RetentionFormProps {
  formId: string;
  onSubmit: SubmitHandler<RetentionFormInputs>;
  initialData?: RetentionFormInputs;
  onCancel?: () => void;
  loading?: boolean;
   accounts: {
    id: number;
    account_name: string;
    account_code: string;
  }[];
}

