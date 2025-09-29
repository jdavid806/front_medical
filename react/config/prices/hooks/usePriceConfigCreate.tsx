import { useState } from 'react'
import { SwalManager } from '../../../../services/alertManagerImported'
import { ErrorHandler } from '../../../../services/errorHandler'
import { productService } from '../../../../services/api';

export interface CreateProductDTO {
    product: Product;
    entities: EntityCreate[];
}

export interface EntityCreate {
    entity_id: string;
    price: string;
    tax_charge_id: string;
    withholding_tax_id: string;
}

export interface SupplyCreate {
    supply_id: number;
    quantity: number;
}

interface Product {
    name: string;
    barcode: string;
    attention_type: string;
    sale_price: string;
    copayment: string;
    tax_charge_id: string;
    exam_type_id: string;
    purchase_price: string;
    scheduleable_by_ai: boolean;
    supplies: SupplyCreate[];
}

export const usePriceConfigCreate = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const createProduct = async (data: Omit<CreateProductDTO, 'id'>) => {
        setLoading(true)
        try {
            const response = await productService.storeProductEntity(data)
            SwalManager.success()
            return response
        } catch (error) {
            console.log(error);
            ErrorHandler.generic(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    return { loading, createProduct }
}
