import React, { useState } from 'react';
import { productService } from '../../../../services/api';
import { SwalManager } from '../../../../services/alertManagerImported';
import { ErrorHandler } from '../../../../services/errorHandler';
export interface UpdateProductDTO {
    product: Product;
    entities: EntityUpdate[];
}

export interface EntityUpdate {
    entity_id: number;
    price: string;
    tax_charge_id: string | null;
    withholding_tax_id: string | null;
}

export interface SupplyUpdate {
    supply_id: number;
    quantity: number;
}

interface Product {
    name: string;
    barcode: string;
    attention_type: string;
    sale_price: string;
    copayment: string;
    tax_charge_id: number | null;
    exam_type_id: number | null;
    purchase_price: number;
    scheduleable_by_ai: boolean;
    supplies: SupplyUpdate[];
}

export const usePriceConfigUpdate = () => {
    const [loading, setLoading] = useState(true);

    const updateProduct = async (id: string, data: UpdateProductDTO) => {
        setLoading(true);
        try {
            const response = await productService.updateProductEntity(id, data);
            SwalManager.success();
            return response;
        } catch (error) {
            ErrorHandler.generic(error);
            throw error
        } finally {
            setLoading(false);
        }
    };

    return {
        updateProduct,
        loading
    };
};
