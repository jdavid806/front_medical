import { CreateRetentionDTO, RetentionFormInputs, UpdateRetentionDTO } from "../interfaces/RetentionDTO";

export const RetentionMapperCreate = (data: RetentionFormInputs): CreateRetentionDTO => {
  if (!data.accounting_account) {
    throw new Error("La cuenta contable principal es requerida");
  }
  
  if (!data.accounting_account_reverse_id) {
    throw new Error("La cuenta contable reversa es requerida");
  }

  return {
    name: data.name,
    percentage: data.percentage,
    accounting_account: data.accounting_account.toString(),
    description: data.description,
    accounting_account_reverse_id: Number(data.accounting_account_reverse_id)
  };
};

export const RetentionMapperUpdate = (data: RetentionFormInputs): UpdateRetentionDTO => {
  return {
    name: data.name,
    percentage: data.percentage,
    accounting_account: data.accounting_account.toString(),
    description: data.description,
    accounting_account_reverse_id: Number(data.accounting_account_reverse_id)
  };
};