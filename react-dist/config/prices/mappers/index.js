export const ProductMapperCreate = data => {
  return {
    product: {
      name: data.name,
      attention_type: data.attention_type,
      barcode: data.curp,
      sale_price: data.sale_price.toString(),
      copayment: data.copago.toString(),
      tax_charge_id: data.taxProduct_type ?? '0',
      exam_type_id: data.exam_type_id ?? '0',
      purchase_price: data.purchase_price.toString()
    },
    entities: data.entities ? data.entities.map(entity => {
      return {
        entity_id: entity.entity_id,
        price: entity.price.toString(),
        tax_charge_id: entity.tax_type,
        withholding_tax_id: entity.retention_type
      };
    }) : []
  };
};
export const ProductMapperUpdate = data => {
  return {
    product: {
      name: data.name,
      attention_type: data.attention_type,
      barcode: data.curp,
      sale_price: data.sale_price.toString(),
      copayment: data.copago.toString(),
      tax_charge_id: data.taxProduct_type ?? '0',
      exam_type_id: data.exam_type_id ?? '0',
      purchase_price: data.purchase_price
    },
    entities: data.entities ? data.entities.map(entity => {
      return {
        entity_id: +entity.entity_id,
        price: entity.price.toString(),
        tax_charge_id: entity.tax_type,
        withholding_tax_id: entity.retention_type
      };
    }) : []
  };
};