export const ProductMapperCreate = data => {
  return {
    product: {
      name: data.name,
      attention_type: data.attention_type,
      barcode: data.curp,
      sale_price: (data.sale_price ?? 0).toString(),
      copayment: (data.copago ?? 0).toString(),
      tax_charge_id: data.taxProduct_type?.toString() ?? '',
      exam_type_id: data.exam_type_id?.toString() ?? '',
      purchase_price: (data.purchase_price ?? 0).toString()
    },
    entities: data.entities ? data.entities.map(entity => {
      return {
        entity_id: entity.entity_id,
        price: (entity.price ?? 0).toString(),
        tax_charge_id: entity.tax_charge_id ?? '',
        withholding_tax_id: entity.withholding_tax_id ?? ''
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
      sale_price: (data.sale_price ?? 0).toString(),
      copayment: (data.copago ?? 0).toString(),
      tax_charge_id: data.taxProduct_type && data.taxProduct_type !== '0' ? parseInt(data.taxProduct_type) : null,
      exam_type_id: data.exam_type_id && data.exam_type_id !== '0' ? parseInt(data.exam_type_id) : null,
      purchase_price: data.purchase_price ?? 0
    },
    entities: data.entities ? data.entities.map(entity => {
      return {
        entity_id: typeof entity.entity_id === 'string' ? parseInt(entity.entity_id) : +entity.entity_id,
        price: (entity.price ?? 0).toString(),
        tax_charge_id: entity.tax_charge_id || null,
        withholding_tax_id: entity.withholding_tax_id || null
      };
    }) : []
  };
};