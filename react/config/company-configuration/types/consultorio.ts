export interface Company {
    id?: number;
    legal_name: string;
    document_type: string;
    document_number: string;
    logo: string;
    watermark: string;
    phone: string;
    email: string;
    address: string;
    country: string;
    province: string | null;
    city: string;
    nit: string | null;
    trade_name: string | null;
    economic_activity: string | null;
    created_at: string;
    updated_at: string;
}

export interface Representative {
    id?: string;
    name: string;
    phone: string;
    email: string;
    document_type: string;
    document_number: string;
}

export interface InvoiceConfig {
    id?: string;
    dian_prefix: string;
    resolution_number: string;
    invoice_from: number;
    invoice_to: number;
    type: 'tax_invoice' | 'consumer' | 'government_invoice' | 'credit_note';
    resolution_date: string;
    expiration_date: string;
}

export interface SmtpConfig {
    id?: string;
    smtp_server: string;
    port: number;
    security: 'tls' | 'ssl' | 'none';
    email: string;
    password: string;
}

export interface WhatsAppStatus {
    connected: boolean;
    qrCode?: string;
}

export interface Branch {
    id?: string;
    company_id?: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    city: string;
    country: string;
    is_main: boolean;
    status: 'active' | 'inactive';
    created_at?: string;
    updated_at?: string;
}

export interface BranchFormData {
    name: string;
    address: string;
    phone: string;
    email: string;
    city: string;
    country: string;
    is_main: boolean;
}