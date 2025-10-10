export interface PaymentMethodDTO {
    id: number;
    method: string;
    payment_type: string;
    description: string;
    created_at: string;
    updated_at: string;
    category: string;
    is_cash: boolean;

}

export interface CreatePaymentMethodDTO {
    method: string;
    payment_type: string;
    description: string;
    accounting_account_id: number | null;
    category: string;
    is_cash: boolean;
}

export interface UpdatePaymentMethodDTO {
    method?: string;
    description?: string;
    payment_type: string;
    accounting_account_id?: number | null;
    category?: string;
    is_cash: boolean;

}