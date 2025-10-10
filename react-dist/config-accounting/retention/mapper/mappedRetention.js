export const RetentionMapperCreate = data => {
  // Cambiar las validaciones para permitir null pero no undefined
  if (data.accounting_account_id === undefined) {
    throw new Error("La cuenta contable principal de compras es requerida");
  }
  if (data.accounting_account_reverse_id === undefined) {
    throw new Error("La cuenta contable reversa de compras es requerida");
  }
  if (data.sell_accounting_account_id === undefined) {
    throw new Error("La cuenta contable principal de ventas es requerida");
  }
  if (data.sell_reverse_accounting_account_id === undefined) {
    throw new Error("La cuenta contable reversa de ventas es requerida");
  }
  return {
    name: data.name,
    percentage: data.percentage,
    accounting_account_id: data.accounting_account_id ? Number(data.accounting_account_id) : null,
    accounting_account_reverse_id: data.accounting_account_reverse_id ? Number(data.accounting_account_reverse_id) : null,
    sell_accounting_account_id: data.sell_accounting_account_id ? Number(data.sell_accounting_account_id) : null,
    sell_reverse_accounting_account_id: data.sell_reverse_accounting_account_id ? Number(data.sell_reverse_accounting_account_id) : null,
    tax_id: data.tax_id ? Number(data.tax_id) : null,
    description: data.description
  };
};
export const RetentionMapperUpdate = data => {
  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.percentage !== undefined) updateData.percentage = data.percentage;
  if (data.description !== undefined) updateData.description = data.description;

  // Para accounting_account_id - enviar null si está vacío
  if (data.accounting_account_id !== undefined) {
    updateData.accounting_account_id = data.accounting_account_id ? Number(data.accounting_account_id) : null;
  }

  // Para accounting_account_reverse_id - enviar null si está vacío
  if (data.accounting_account_reverse_id !== undefined) {
    updateData.accounting_account_reverse_id = data.accounting_account_reverse_id ? Number(data.accounting_account_reverse_id) : null;
  }

  // Para sell_accounting_account_id - enviar null si está vacío
  if (data.sell_accounting_account_id !== undefined) {
    updateData.sell_accounting_account_id = data.sell_accounting_account_id ? Number(data.sell_accounting_account_id) : null;
  }

  // Para sell_reverse_accounting_account_id - enviar null si está vacío
  if (data.sell_reverse_accounting_account_id !== undefined) {
    updateData.sell_reverse_accounting_account_id = data.sell_reverse_accounting_account_id ? Number(data.sell_reverse_accounting_account_id) : null;
  }

  // Para tax_id - enviar null si está vacío
  if (data.tax_id !== undefined) {
    updateData.tax_id = data.tax_id ? Number(data.tax_id) : null;
  }
  return updateData;
};