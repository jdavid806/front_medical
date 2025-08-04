// interfaces/TaxesConfigDTO.ts
export interface TaxFormInputs {
  id?: string;
  name: string;
  percentage: number;
  accounting_account: number | null;
  accounting_account_reverse: number | null;
  description: string;

}
export interface TaxDTO {
  id: string;
  name: string;
  percentage: number;
  accounting_account: string | null;
  accounting_account_name?: string; 
  accounting_account_reverse_id: number | null;
  accounting_account_reverse_name?: string; 
  description: string | null;
}
export interface CreateTaxDTO {
  name: string;
  percentage: number;
  accounting_account: string;
  accounting_account_reverse_id: number;
  description: string;
}

export interface UpdateTaxDTO {
  name?: string;
  percentage?: number;
  accounting_account: string;
  accounting_account_reverse_id: number;
  description?: string;
}