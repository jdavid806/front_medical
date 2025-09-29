import { ProductFormInputs } from "../form/PricesConfigForm";
import { CreateProductDTO, EntityCreate, SupplyCreate } from "../hooks/usePriceConfigCreate";
import { UpdateProductDTO, EntityUpdate, SupplyUpdate } from "../hooks/usePriceConfigUpdate";

export const ProductMapperCreate = (data: ProductFormInputs): CreateProductDTO => {
    return {
        product: {
            name: data.name,
            attention_type: data.attention_type,
            barcode: data.curp,
            sale_price: data.sale_price.toString(),
            copayment: data.copago.toString(),
            tax_charge_id: data.taxProduct_type ?? '0',
            exam_type_id: data.exam_type_id?.toString() ?? '0',
            purchase_price: data.purchase_price.toString(),
            scheduleable_by_ai: data.toggleIA || false,
            supplies: data.supplies ? data.supplies.map(supply => {
                return {
                    supply_id: supply.id,
                    quantity: supply.quantity,
                } as SupplyUpdate
            }) : []
        },
        entities: data.entities ? data.entities.map(entity => {
            return {
                entity_id: entity.entity_id,
                price: entity.price.toString(),
                tax_charge_id: entity.tax_charge_id,
                withholding_tax_id: entity.withholding_tax_id,
                negotation_type: entity.negotiation_type,  
            } as EntityCreate
        }) : []
    }

}

export const ProductMapperUpdate = (data: ProductFormInputs): UpdateProductDTO => {
    return {
        product: {
            name: data.name,
            attention_type: data.attention_type,
            barcode: data.curp,
            sale_price: data.sale_price.toString(),
            copayment: data.copago.toString(),
            tax_charge_id: data.taxProduct_type ?? '0',
            exam_type_id: data.exam_type_id?.toString() ?? '0',
            purchase_price: data.purchase_price,
            scheduleable_by_ai: data.toggleIA || false,
            supplies: data.supplies ? data.supplies.map(supply => {
                return {
                    supply_id: supply.id,
                    quantity: supply.quantity,
                } as SupplyUpdate
            }) : []
        },
        entities: data.entities ? data.entities.map(entity => {
            return {
                entity_id: +entity.entity_id,
                price: entity.price.toString(),
                tax_charge_id: entity.tax_charge_id,
                withholding_tax_id: entity.withholding_tax_id,
                negotation_type: entity.negotiation_type,  
            } as EntityUpdate
        }) : []
    }

} 