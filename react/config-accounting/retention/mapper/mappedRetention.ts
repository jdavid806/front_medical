import { CreateRetentionDTO, RetentionFormInputs, UpdateRetentionDTO } from "../interfaces/RetentionDTO";

export const RetentionMapperCreate = (data: RetentionFormInputs): CreateRetentionDTO => {
  if (!data.accounting_account_id) {
    throw new Error("La cuenta contable principal de compras es requerida");
  }

  if (!data.accounting_account_reverse_id) {
    throw new Error("La cuenta contable reversa de compras es requerida");
  }

  if (!data.sell_accounting_account_id) {
    throw new Error("La cuenta contable principal de ventas es requerida");
  }

  if (!data.sell_reverse_accounting_account_id) {
    throw new Error("La cuenta contable reversa de ventas es requerida");
  }

  return {
    name: data.name,
    percentage: data.percentage,
    accounting_account_id: Number(data.accounting_account_id),
    accounting_account_reverse_id: Number(data.accounting_account_reverse_id),
    sell_accounting_account_id: Number(data.sell_accounting_account_id),
    sell_reverse_accounting_account_id: Number(data.sell_reverse_accounting_account_id),
    tax_id: data.tax_id ? Number(data.tax_id) : null,
    description: data.description,
  };
};

export const RetentionMapperUpdate = (data: RetentionFormInputs): UpdateRetentionDTO => {
  const updateData: UpdateRetentionDTO = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.percentage !== undefined) updateData.percentage = data.percentage;
  if (data.description !== undefined) updateData.description = data.description;

  if (data.accounting_account_id !== null && data.accounting_account_id !== undefined) {
    updateData.accounting_account_id = Number(data.accounting_account_id);
  }

  if (data.accounting_account_reverse_id !== null && data.accounting_account_reverse_id !== undefined) {
    updateData.accounting_account_reverse_id = Number(data.accounting_account_reverse_id);
  }

  if (data.sell_accounting_account_id !== null && data.sell_accounting_account_id !== undefined) {
    updateData.sell_accounting_account_id = Number(data.sell_accounting_account_id);
  }

  if (data.sell_reverse_accounting_account_id !== null && data.sell_reverse_accounting_account_id !== undefined) {
    updateData.sell_reverse_accounting_account_id = Number(data.sell_reverse_accounting_account_id);
  }

  if (data.tax_id !== null && data.tax_id !== undefined) {
    updateData.tax_id = data.tax_id ? Number(data.tax_id) : null;
  }

  return updateData;
};