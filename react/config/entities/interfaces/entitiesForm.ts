import { EntitiesDTO } from "./entitiesDTO";


export interface EntitiesFormInputs {
    name: string;
    document_type: string;
    document_number: string;
    email: string;
    address: string;
    phone: string;
    city_id: string;
    tax_charge_id: string | null;
    withholding_tax_id: string | null;
    koneksi_sponsor_slug?: string | null;
}

export interface EntitiesFormProps {
    formId: string;
    onSubmit: (data: EntitiesFormInputs) => void;
    initialData?: EntitiesDTO;
    onCancel?: () => void;
    loading?: boolean;
}