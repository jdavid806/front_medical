import React, { useState } from "react";
import { ErrorHandler } from "../../../../services/errorHandler";
import { productService } from "../../../../services/api";

interface UsePriceByIdDTO {
    id: number;
    name: string;
    description: null;
    reference: null;
    controlled_product: null;
    weight: null;
    capacity: null;
    concentration: null;
    prescription: null;
    incentives: null;
    barcode: string;
    components: null;
    medical_form_id: null;
    laboratory_id: null;
    brand_id: null;
    concentration_type_id: null;
    product_type_id: number;
    created_at: string;
    updated_at: string;
    minimum_stock: null;
    maximum_stock: null;
    stock: null;
    stock_alert: null;
    expiration_date: null;
    sanitary_registration: null;
    purchase_price: number;
    sale_price: number;
    'sale/purchase_status': null;
    quantity: null;
    supplier_id: null;
    price_entity: string;
    attention_type: string;
    copayment: string;
    deleted_at: null;
    tax_charge_id: string | null;
    presentation: null;
    exam_type_id: string | null;
    file_url: null;
    account_number: null;
    type_unit_measure_id: null;
    category_product_id: null;
    category_product: null;
    product_type: Producttype;
    inventories: any[];
    invoice_details: Invoicedetail[];
    entities: any[];
    taxes: any[];
    tax_charge: null;
    package_products: any[];
    packages: any[];
    files: any[];
    deposits: any[];
    medical_form: null;
    laboratory: null;
    brand: null;
    concentration_type: null;
    movements: any[];
}

interface Invoicedetail {
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
}

interface Producttype {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export const usePriceConfigById = () => {
    const [priceById, setPriceById] = useState<UsePriceByIdDTO | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchPriceById = async (id: string) => {
        try {
            const data = await productService.getProductById(id);
            setPriceById(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        priceById,
        setPriceById,
        fetchPriceById,
        loading
    };
};
