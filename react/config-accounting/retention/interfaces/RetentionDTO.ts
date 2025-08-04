// interfaces/RetentionConfigDTO.ts
export interface RetentionFormInputs {
  id?: string;
  name: string;
  percentage: number;
  accounting_account: number | null;
  accounting_account_reverse_id: number | null;
  description: string;
}

export interface RetentionDTO {
  id: string;
  name: string;
  percentage: number;
  accounting_account: string | null;
  accounting_account_name?: string;
  accounting_account_reverse_id: number | null;
  accounting_account_reverse_name?: string;
  description: string | null;
}

export interface CreateRetentionDTO {
  name: string;
  percentage: number;
  accounting_account: string;
  accounting_account_reverse_id: number;
  description: string;
}

export interface UpdateRetentionDTO {
  name?: string;
  percentage?: number;
  accounting_account: string;
  accounting_account_reverse_id: number;
  description?: string;
}