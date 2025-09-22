import { OptometryPrescriptionFormData } from "../../prescriptions/components/OptometryPrescriptionForm";

export interface StoreClinicalRecordInputs {
    appointment_id: string;
    clinical_record_type_id: string;
    created_by_user_id: string;
    description: string;
    branch_id: string;
    data: ClinicalRecordData;
    consultation_duration: string;
    start_time: string;
    diagnosis_main: string | null;
    created_at: string;
    exam_recipes?: Exam[];
    recipe?: Recipe;
    exam_vaccines?: Vaccine[];
    patient_disability?: Disability;
    exam_order?: ExamOrderItem[];
    remission?: Remission;
    appointment?: any;
}

export interface ClinicalRecordData {
    tabsStructure: any[];
    values: any;
    rips: any[];
}

interface Exam {
    id: string;
    name: string;
    description: string;
    form_config: any;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    type: string;
}

interface Disability {
    user_id: string;
    start_date: string;
    end_date: string;
    reason: string;
}

interface Medicine {
    medication: string; //
    concentration: string; //
    duration: number; //
    frequency: string; //
    medication_type: string; //
    observations: string; //
    quantity: number; //
    take_every_hours: number; //
}

interface Remission {
    receiver_user_id: string;
    remitter_user_id: string;
    receiver_user_specialty_id: string | null;
    note: string;
}

interface Recipe {
    user_id: string;
    patient_id: string;
    medicines?: Medicine[];
    optometry?: OptometryPrescriptionFormData;
    type: string;
}

interface Vaccine {
    user_id: string;
    patient_id: string;
    details: {
        name: string;
        dosis: number;
        scheme: string;
        booster_frequency: string;
    }[];
}

interface ExamOrderItem {
    patient_id: string;
    exam_order_item_id: string;
    exam_order_item_type: string;
}