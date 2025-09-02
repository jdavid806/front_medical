export interface AddVaccineFormInputs {
    fromInventory: boolean;
    vaccineFromInventory?: any | null;
    vaccinesFromInventory: VaccineFromInventory[];
    vaccineName?: string | null;
}

export interface AddVaccineFormProps {
    initialData?: AddVaccineFormInputs;
}

export interface VaccineFromInventory {
    uuid: string;
    name: string;
    dose: number;
    scheme: string;
    booster: string;
}

export interface AddVaccineFormRef {
    getFormData: () => AddVaccineFormInputs;
}

export interface RemoveVaccineEvent {
    data: VaccineFromInventory;
    index: number;
}

export interface AddVaccineFormTableProps {
    vaccinesFromInventory: VaccineFromInventory[];
    onRemove: (event: RemoveVaccineEvent) => void;
    updateVaccine: (index: number, data: VaccineFromInventory, field: string, value: any) => void;
}