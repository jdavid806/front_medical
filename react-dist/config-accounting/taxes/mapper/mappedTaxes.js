export const TaxesMapperCreate = data => {
  return {
    name: data.name,
    percentage: data.percentage,
    accounting_account_id: Number(data.accounting_account_id) || null,
    accounting_account_reverse_id: Number(data.accounting_account_reverse_id) || null,
    sell_accounting_account_id: Number(data.sell_accounting_account_id) || null,
    sell_reverse_accounting_account_id: Number(data.sell_reverse_accounting_account_id) || null,
    description: data.description
  };
};
export const TaxesMapperUpdate = data => {
  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.percentage !== undefined) updateData.percentage = data.percentage;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.accounting_account_id !== undefined) {
    updateData.accounting_account_id = data.accounting_account_id ? Number(data.accounting_account_id) : null;
  }
  if (data.accounting_account_reverse_id !== undefined) {
    updateData.accounting_account_reverse_id = data.accounting_account_reverse_id ? Number(data.accounting_account_reverse_id) : null;
  }
  if (data.sell_accounting_account_id !== undefined) {
    updateData.sell_accounting_account_id = data.sell_accounting_account_id ? Number(data.sell_accounting_account_id) : null;
  }
  if (data.sell_reverse_accounting_account_id !== undefined) {
    updateData.sell_reverse_accounting_account_id = data.sell_reverse_accounting_account_id ? Number(data.sell_reverse_accounting_account_id) : null;
  }
  return updateData;
};