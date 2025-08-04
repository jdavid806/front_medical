import { VaccineFormInputs } from "./VaccineForm";

export interface UserFormModalProps {
    show: boolean;
    handleSubmit: (data: VaccineFormInputs) => void
    initialData?: VaccineFormInputs;
    onHide?: () => void;
}
