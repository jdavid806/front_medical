import { Patient, ThirdPartyDto } from "../../models/models";

export interface CashRegisterProduct {
    id: number;
    name: string;
    description: string;
    concentration: string;
    presentation: string;
    price: number;
    pharmacy_available_stock: boolean;
    pharmacy_product_stock: number;
    quantity: number;
}

export interface CashRegisterPayment {
    method: any;
    amount: number;
    change: number;
}

export interface CashRegisterPaymentMethodsFormInputs {
    payments: CashRegisterPayment[];
    currentPayment: CashRegisterPayment;
}

export interface CashRegisterPaymentMethodsFormRef {
    submit: () => Promise<{
        isValid: boolean;
        getValues: CashRegisterPaymentMethodsFormInputs;
    }>;
}

export interface CashRegisterPaymentFormInputs {
    client: ThirdPartyDto | null;
    payments: { method: any, amount: number, change: number }[];
}

export interface CashRegisterPaymentFormRef {
    submit: () => Promise<{
        isValid: boolean;
        getValues: CashRegisterPaymentFormInputs;
    }>;
}
