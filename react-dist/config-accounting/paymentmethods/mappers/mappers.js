export const PaymentMethodMapperCreate = data => {
  return {
    method: data.name,
    description: data.additionalDetails,
    accounting_account_id: data.account?.id || null,
    category: data.category
  };
};
export const PaymentMethodMapperUpdate = data => {
  return {
    method: data.name,
    description: data.additionalDetails,
    accounting_account_id: data.account?.id || null,
    category: data.category
  };
};