export interface PaymentMethodDTO {
    id: number;
    method: string;
    payment_type: string;
    description: string;
    created_at: string;
    updated_at: string;
    accounting_account_id: number;
    accounting_account_id_name: string;
    account_name: string;
    category: string;
}

export interface CreatePaymentMethodDTO {
    method: string;
    payment_type: string;
    description: string;
    accounting_account_id: number;
    category: string;
}

export interface UpdatePaymentMethodDTO {
    method?: string;
    description?: string;
    payment_type: string;
    accounting_account_id?: number;
    category?: string;
}