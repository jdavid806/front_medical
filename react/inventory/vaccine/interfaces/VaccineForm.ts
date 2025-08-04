import { Nullable } from 'primereact/ts-helpers';

export type VaccineFormInputs = {
    name: string;
    reference: string;
    brand: string;
    sanitary_registration: string;
    weight: number;
    concentration: string;
    minimum_stock: number;
    maximum_stock: number;
    sale_price: number;
};

export interface VaccineFormProps {
    formId: string;
    onHandleSubmit: (data: VaccineFormInputs) => void;
    initialData?: VaccineFormInputs;
}
