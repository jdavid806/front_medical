// interfaces/PrescriptionInterfaces.ts
export interface PrescriptionModalProps {
    show: boolean;
    handleSubmit: (data: any) => void;
    onHide: () => void;
}

export interface PrescriptionFormProps {
    formId: string;
    handleSubmit: (data: any) => void;
}
