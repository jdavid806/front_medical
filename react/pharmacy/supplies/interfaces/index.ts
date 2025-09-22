import { ProductDto } from "../../../models/models";

export interface SuppliesDeliveryFormModalProps {
    visible: boolean;
    onHide: () => void;
    onSave: () => void;
}

export interface SuppliesDeliveryFormProps {
    formId: string;
    onSubmit: (data: SuppliesDeliveryFormData) => void;
}

export interface SuppliesDeliveryFormInputs {
    supply: any | null;
    supplies: {
        id: number;
        name: string;
        quantity: number;
    }[];
    observations: string;
}

export interface SuppliesDeliveryFormData {
    status: string;
    delivery_date: string | null;
    observations: string;
    products: {
        product_id: number;
        quantity: number;
    }[];
}

export interface SuppliesDeliveriesTableRef {
    refresh: () => void
}

export interface SuppliesDeliveriesTableItem {
    id: number;
    type: string;
    observations: string | null;
    status: {
        label: string;
        severity: "success" | "info" | "warning" | "danger" | "secondary" | "contrast" | null | undefined;
    };
    products: {
        id: number;
        name: string;
        quantity: number;
    }[];
    original: MedicalSupply;
}

interface Product {
    id: number;
    name: string;
}

interface RequestedProduct {
    id: number;
    medical_supply_id: number;
    product_id: number;
    quantity: number;
    created_at: string;
    updated_at: string;
    product: ProductDto;
}

export interface MedicalSupply {
    id: number;
    status: string;
    delivery_date: string | null;
    observations: string | null;
    created_at: string;
    updated_at: string;
    products: RequestedProduct[];
}

export interface MedicalSupplyResponse {
    data: MedicalSupply[];
}