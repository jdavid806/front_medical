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
}

export interface SuppliesDeliveryFormData {
    quantity: number;
}