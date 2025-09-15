export interface SuppliesDeliveryFormModalProps {
    visible: boolean;
    onHide: () => void;
}

export interface SuppliesDeliveryFormProps {
    formId: string;
    onSubmit: (data: SuppliesDeliveryFormData) => void;
}

export interface SuppliesDeliveryFormInputs {
    quantity: number;
    supply: any | null;
    supplies: any[];
}

export interface SuppliesDeliveryFormData {
    quantity: number;
    supply: any | null;
    supplies: any[];
}