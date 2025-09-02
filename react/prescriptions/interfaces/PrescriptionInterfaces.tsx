import { PrescriptionFormInputs } from "../components/PrescriptionForm";

// interfaces/PrescriptionInterfaces.ts
export interface PrescriptionModalProps {
    title: string;
    show: boolean;
    handleSubmit: (data: any) => void;
    onHide: () => void;
    initialData?: PrescriptionFormInputs;
}

export interface PrescriptionFormProps {
    formId?: string;
    handleSubmit?: (data: any) => void;
    initialData?: PrescriptionFormInputs;
    ref?: React.RefObject<any>;
}
