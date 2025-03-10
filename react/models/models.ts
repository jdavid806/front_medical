export interface Patient {
    id: number;
    document_type: string;
    document_number: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    second_last_name: string;
    gender: string;
    date_of_birth: string;
    address: string;
    nationality: string;
    created_at: string;
    updated_at: string;
    country_id: number;
    department_id: number;
    city_id: number;
    whatsapp: string;
    email: string;
    civil_status: string;
    ethnicity: string;
    social_security_id: number;
    is_active: boolean;
    blood_type: string;
    social_security: Socialsecurity;
    companions: Companion[];
    appointments: AppointmentDto[];
    vaccine_applications: any[];
    disabilities: Disability[];
    nursing_notes: Nursingnote[];
    country: CountryDto;
    city: CityDto;
    clinical_records: Clinicalrecord[];
}

export interface Clinicalrecord {
    id: number;
    clinical_record_type_id: number;
    created_by_user_id: number;
    patient_id: number;
    branch_id: number;
    description: null;
    data: any;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CityDto {
    id: string;
    name: string;
    area_code: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    department_id: number;
}

export interface CountryDto {
    id: string;
    name: string;
    country_code: string;
    phone_code: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Nursingnote {
    id: number;
    patient_id: number;
    user_id: number;
    note: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Disability {
    id: number;
    patient_id: number;
    user_id: number;
    start_date: string;
    end_date: string;
    reason: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface AppointmentDto {
    id: number;
    assigned_user_availability_id: number;
    created_by_user_id: number;
    patient_id: number;
    appointment_state_id: number;
    appointment_time: string;
    appointment_date: string;
    attention_type: string;
    consultation_purpose: string;
    consultation_type: string;
    external_cause: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    patient: Patient;
    user_availability: UserAvailability
}

export interface AppointmentTableItem {
    id: string
    patientName: string;
    patientDNI: string;
    date: string;
    time: string;
    doctorName: string;
    entity: string;
    status: string;
    branchId: string | null;
    isChecked: boolean
}

export interface Companion {
    id: number;
    first_name: string;
    last_name: string;
    mobile: string;
    email: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    document_type: string;
    document_number: string;
    pivot: CompanionPivot;
}

export interface CompanionPivot {
    patient_id: number;
    companion_id: number;
    relationship: string;
    status: null;
    created_at: string;
    updated_at: string;
}

export interface Socialsecurity {
    id: number;
    type_scheme: string;
    affiliate_type: string;
    category: string;
    eps: string;
    arl: string;
    afp: string;
    insurer: null;
    created_at: string;
    updated_at: string;
}

export interface UserDto {
    id: number
    first_name: string
    middle_name: string
    last_name: string
    second_last_name: string
    external_id: string
    user_role_id: number
    user_specialty_id: number
    country_id: string
    city_id: string
    gender: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface UserTableItem {
    fullName: string,
    specialty: string,
    gender: string,
    phone: string,
    email: string
}

export interface PrescriptionTableItem {
    doctor: {
        first_name: string,
        last_name: string
    },
    patient: {
        first_name: string,
        last_name: string
    },
    created_at: string
}


export interface UserAvailability {
    id: number;
    user_id: number;
    appointment_type_id: number;
    branch_id: number | null;
    appointment_duration: number;
    days_of_week: number[];
    start_time: string;
    end_time: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    office: string;
    user: UserDto;
}

export interface UserSpecialtyDto {
    id: string;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface UserRoleDto {
    id: string;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}


export interface PrescriptionDto {
    patient_id: number
    user_id: number
    is_active: boolean
    created_at: string
    medicines: Medicine[]
}

export interface Medicine {
    medication: string
    concentration: string
    frequency: string
    duration: number
    medication_type: string
    take_every_hours: number
    quantity: number
    observations: string
    showQuantity: boolean;
    showTimeField: boolean;
}

export enum TicketReason {
    ADMISSION_PRESCHEDULED = 'ADMISSION_PRESCHEDULED',
    CONSULTATION_GENERAL = 'CONSULTATION_GENERAL',
    SPECIALIST = 'SPECIALIST',
    VACCINATION = 'VACCINATION',
    LABORATORY = 'LABORATORY',
    OTHER = 'OTHER'
}

export enum TicketPriority {
    NONE = 'NONE',
    SENIOR = 'SENIOR',
    PREGNANT = 'PREGNANT',
    DISABILITY = 'DISABILITY',
    CHILDREN_BABY = 'CHILDREN_BABY'
}

export enum TicketStatus {
    PENDING = 'PENDING',
    CALLED = 'CALLED',
    COMPLETED = 'COMPLETED',
    MISSED = 'MISSED'
}

export interface TicketDto {
    id: string
    ticket_number: string
    phone: string
    email?: string | null
    reason: TicketReason
    priority: TicketPriority
    status: TicketStatus
    module_id: string
    branch_id: string
    created_at: string
    updated_at: string

    // Relaciones (opcionales dependiendo de la consulta)
    module?: ModuleDto
    branch?: BranchDto
}

export interface TicketTableItemDto {
    id: string
    ticket_number: string
    phone: string
    reason: string
    priority: string
    status: string
    statusView: string
    statusColor: string
    step: number
    created_at: string
    branch_id: string
    module_id: string
}

export interface CreateTicketDTO {
    phone: string
    email?: string
    reason: TicketReason
    priority: TicketPriority
    branch_id: number
    module_id?: number // Opcional cuando se usa asignación automática
}

export interface ModuleDto {
    id: string
    name: string
    allowed_reasons: TicketReason[]
    is_active: boolean
    branch_id: string
    last_assigned_at?: string | null
    branch: BranchDto
}

export interface BranchDto {
    id: number;
    city_id: number;
    address: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ExamTypeDto {
    id: string;
    name: string;
    description: string | null;
    form_config: any;
    exam_category_id: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ExamCategoryDto {
    id: string;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ExamOrderDto {
    id: string;
    exam_type_id: string;
    patient_id: string;
    exam_order_state_id: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    exam_type?: ExamTypeDto;
    exam_order_state?: ExamOrderStateDto;
}

export interface ExamOrderStateDto {
    id: string;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}