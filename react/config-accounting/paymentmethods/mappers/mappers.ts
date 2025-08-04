import { UpdateTaxDTO } from "../../taxes/interfaces/TaxesConfigDTO";

export const PaymentMethodMapperCreate = (data: any) => {
    return {
        method: data.name,
        description: data.additionalDetails,
        accounting_account_id: data.account?.id || null,
        category: data.category
    };
};
