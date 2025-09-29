export interface RetentionFormInputs {
  id?: string;
  name: string;
  percentage: number;
  accounting_account_id: number | null;
  accounting_account_reverse_id: number | null;
  sell_accounting_account_id: number | null;
  sell_reverse_accounting_account_id: number | null;
  description: string;
  tax_id: number | null;
}

export interface RetentionDTO {
  id: string;
  name: string;
  percentage: number;
  accounting_account_id: string | null;
  accounting_account_name?: string;
  accounting_account_reverse_id: number | null;
  accounting_account_reverse_name?: string;
  sell_accounting_account_id: number | null;
  sell_accounting_account_name?: string;
  sell_reverse_accounting_account_id: number | null;
  sell_reverse_accounting_account_name?: string;
  description: string | null;
}

export interface CreateRetentionDTO {
  name: string;
  percentage: number;
  accounting_account_id: number;
  accounting_account_reverse_id: number;
  sell_accounting_account_id: number;
  sell_reverse_accounting_account_id: number;
  tax_id?: number | null;
  description: string;
}

export interface UpdateRetentionDTO {
  name?: string;
  percentage?: number;
  accounting_account_id?: number;
  accounting_account_reverse_id?: number;
  sell_accounting_account_id?: number;
  sell_reverse_accounting_account_id?: number;
  description?: string;
  tax_id?: number | null;
}