import { useState, useEffect } from 'react';
import { productService } from '../../../../services/api';

export interface ProductDTO {
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
    purchase_price: null;
    sale_price: number;
    'sale/purchase_status': null;
    quantity: null;
    supplier_id: null;
    price_entity: string;
    attention_type: string;
    copayment: string;
    deleted_at: null;
    tax_charge_id: null;
    presentation: null;
    exam_type_id: null;
    file_url: null;
    account_number: null;
    type_unit_measure_id: null;
    category_product_id: null;
    category_product: null;
    product_type: Producttype;
    inventories: any[];
    invoice_details: Invoicedetail[];
    entities: Entity[];
    taxes: any[];
    tax_charge: null;
    package_products: any[];
    packages: any[];
}

interface Entity {
    id: number;
    product_id: number;
    entity_id: number;
    price: string;
    created_at: string;
    updated_at: string;
    tax_charge_id: null;
    withholding_tax_id: null;
    tax_charge: null;
    withholding_tax: null;
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


export const usePricesConfigTable = () => {
    const [products, setProduct] = useState<ProductDTO[]>([]);

    const fetchProducts = async () => {
        try {
            const response = await productService.getProductsServices();
            const data: ProductDTO[] = response.data || response;
            setProduct(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return { products, fetchProducts };
};

