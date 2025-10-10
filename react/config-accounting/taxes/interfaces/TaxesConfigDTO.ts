export interface TaxFormInputs {
  id?: string;
  name: string;
  percentage: number;
  accounting_account_id: number | null;
  accounting_account_reverse_id: number | null;
  sell_accounting_account_id: number | null;
  sell_reverse_accounting_account_id: number | null;
  description: string;
}

export interface TaxDTO {
  id: string;
  name: string;
  percentage: number;
  accounting_account_id: number | null;
  accounting_account_name?: string;
  accounting_account_reverse_id: number | null;
  accounting_account_reverse_name?: string;
  sell_accounting_account_id: number | null;
  sell_accounting_account_name?: string;
  sell_reverse_accounting_account_id: number | null;
  sell_reverse_accounting_account_name?: string;
  description: string | null;
}

export interface CreateTaxDTO {
  name: string;
  percentage: number;
  accounting_account_id: number | null;
  accounting_account_reverse_id: number | null;
  sell_accounting_account_id: number | null;
  sell_reverse_accounting_account_id: number | null;
  description: string;
}

export interface UpdateTaxDTO {
  name?: string;
  percentage?: number | null;
  accounting_account_id?: number | null;
  accounting_account_reverse_id?: number | null;
  sell_accounting_account_id?: number | null;
  sell_reverse_accounting_account_id?: number | null;
  description?: string;
}