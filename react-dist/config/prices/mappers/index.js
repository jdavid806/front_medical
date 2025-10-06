export const ProductMapperCreate = data => {
  return {
    product: {
      name: data.name,
      attention_type: data.attention_type,
      barcode: data.curp,
      sale_price: data.sale_price.toString(),
      copayment: data.copago.toString(),
      tax_charge_id: data.taxProduct_type == '0' || !data.taxProduct_type ? null : +data.taxProduct_type,
      exam_type_id: `${data.exam_type_id}` ?? '0',
      purchase_price: data.purchase_price.toString(),
      scheduleable_by_ai: data.toggleIA || false,
      supplies: data.supplies ? data.supplies.map(supply => {
        return {
          supply_id: supply.id,
          quantity: supply.quantity,
          accounting_account_debit_id: supply.accounting_account_debit_id,
          accounting_account_credit_id: supply.accounting_account_credit_id
        };
      }) : []
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
      tax_charge_id: data.taxProduct_type == '0' || !data.taxProduct_type ? null : +data.taxProduct_type,
      exam_type_id: `${data.exam_type_id}` ?? '0',
      purchase_price: data.purchase_price,
      scheduleable_by_ai: data.toggleIA || false,
      supplies: data.supplies ? data.supplies.map(supply => {
        return {
          supply_id: supply.id,
          quantity: supply.quantity,
          accounting_account_debit_id: supply.accounting_account_debit_id,
          accounting_account_credit_id: supply.accounting_account_credit_id
        };
      }) : []
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