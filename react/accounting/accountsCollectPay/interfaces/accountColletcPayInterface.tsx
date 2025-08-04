export interface UseAccountsCollectPayParams {
    type: string;
    status: string;
}

export interface Customer {
    id: number;
    name: string;
    email?: string;
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
}

export interface InvoiceDetail {
    id: number;
    invoice_id: number;
    product_id: number;
    quantity: number;
    unit_price: string;
    amount: string;
    discount: string;
    subtotal: string;
    created_at: string;
    updated_at: string;
    tax_charge_id: number | null;
    tax_product: number;
    product_name?: string;
}

export interface InvoiceData {
    id: number;
    type: string;
    status: string;
    subtotal: string;
    discount: string;
    iva: string;
    total_amount: string;
    observations: string;
    due_date: string;
    created_at: string;
    updated_at: string;
    paid_amount: string;
    remaining_amount: string;
    quantity_total: number;
    user_id: string;
    deleted_at: string | null;
    invoice_code: string;
    resolution_number: string;
    entity_invoice_id: number | null;
    entity_type: string | null;
    entity_id: number | null;
    type_payment_form_id: number | null;
    type_currency_id: number | null;
    sub_type: string | null;
    third_party_id: number | null;
    supplier_id: number | null;
    centre_cost_id: number | null;
    accounting_account_id: number | null;
    withholdings: string;
    details: InvoiceDetail[];
    documents: any[];
    payments: any[];
    third_party: any | null;
    customer?: Customer;
    centre_cost: any | null;
    notes: any[];
}

export interface InvoiceApiResponse {
    data: InvoiceData[];
}

