
// Definición de tipos TypeScript
export type CuentaBancaria = {
    id: string;
    codigoCuentaContable: string;
    nombreCuentaContable: string;
    banco: string;
    numeroCuenta: string;
    tipoCuenta: string;
    moneda: string;
    saldoDisponible: number;
    saldoContable: number;
    fechaApertura: Date;
    activa: boolean;
};

export type FiltrosCuentasBancarias = {
    codigoCuenta: string;
    nombreBanco: string;
    numeroCuenta: string;
    tipoCuenta: string | null;
    moneda: string | null;
    estado: string | null;
    fechaDesde: Date | null;
    fechaHasta: Date | null;
    incluirInactivas: boolean;
};

export type AccountingAccount = {
    id: number;
    
    account: string;
    account_code: string;
    account_name: string;
    account_type: string;
    auxiliary: string;
    auxiliary_name: string | null;
    created_at: string;
    initial_balance: string;
    status: string;
    sub_account: string;
    sub_account_name: string | null;
    sub_auxiliary: string;
    sub_auxiliary_name: string | null;
    category: string | null;
    balance: string | null;
    updated_at: string;
}