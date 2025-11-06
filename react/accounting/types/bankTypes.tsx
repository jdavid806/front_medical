
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

// Tipos para la nueva estructura de datos
export interface Movimiento {
    fecha: string;
    asiento: string;
    descripcion: string;
    tercero: string;
    debit: string;
    credit: number;
    saldo: number;
}

export interface CuentaContable {
    cuenta: string;
    nombre: string;
    saldo_inicial: string;
    movimientos: Movimiento[];
    saldo_final: number;
}

export interface MovimientoPago {
    fecha: string;
    monto: string;
    banco_o_tarjeta: string | null;
    nro_referencia: string | null;
    cuenta: string | null;
    notas: string | null;
}

export interface MetodoPago {
    metodo_pago: string;
    tipo: string;
    es_efectivo: boolean;
    total: number;
    movimientos: MovimientoPago[];
}
