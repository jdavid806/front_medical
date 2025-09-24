
export const PaymentMethodMapperCreate = (data: any) => {
    return {
        method: data.name,
        payment_type: data.payment_type,
        description: data.additionalDetails,
        accounting_account_id: data.account?.id || null,
        category: data.category,
        isCash: data.isCash
    };
};
