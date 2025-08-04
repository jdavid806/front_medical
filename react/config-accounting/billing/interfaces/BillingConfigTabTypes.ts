export interface CuentaContable {
  id: string;
  account_code: string;
  account_name: string;
  status: string;
}

export interface ConfigFactura {
  id?: string;
  dian_prefix?: string;
  accounting_account?: string;
  accounting_account_reverse_id?: string;
  resolution_number?: string;
  invoice_from?: number;
  invoice_to?: number;
  resolution_date?: Date | string | null;
  expiration_date?: Date | string | null;
}
