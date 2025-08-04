export type InventariableFormInputs = {
    name: string;
    category: string;
    reference: string;
    minimum_stock: number;
    maximum_stock: number;
    description: string;
    weight: number;
    brand: string;
    sale_price: number;
};

export interface InventariableFormProps {
    formId: string;
    onHandleSubmit: (data: InventariableFormInputs) => void;
    initialData?: InventariableFormInputs;
}
