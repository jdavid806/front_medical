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
  country_id: string;
  department_id: string;
  city_id: string;
  whatsapp: string;
  email: string;
  civil_status: string;
  ethnicity: string;
  social_security_id: number;
  is_active: boolean;
  blood_type: string;
  minio_url?: string; 
  minio_id?: string;  
  social_security: Socialsecurity;
  companions: Companion[];
  appointments: AppointmentDto[];
  vaccine_applications: any[];
  disabilities: Disability[];
  nursing_notes: Nursingnote[];
  country: CountryDto;
  city: CityDto;
  clinical_records: Clinicalrecord[];
  validated_data: Partial<Patient>;
  label: string;
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
  user_availability: UserAvailability;
  appointment_state: AppointmentStateDto;
  product_id: string;
}

interface AppointmentStateDto {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AppointmentTableItem {
  id: string;
  patientName: string;
  patientDNI: string;
  patientId: string;
  productId: string;
  date: string;
  time: string;
  doctorName: string;
  entity: string;
  status: string;
  stateId: string;
  stateKey: string;
  attentionType: string;
  branchId: string | null;
  isChecked: boolean;
  specialtyId: string;
  patient?: Patient;
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
  entity_id: string;
  entity: EntityDto;
}

export interface EntityDto {
  id: string;
  name: string;
  document_type: string;
  document_number: string;
  email: string;
  address: string;
  phone: string;
  city_id: string;
  deleted_at: null;
  created_at: string;
  updated_at: string;
}

export interface UserDto {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  second_last_name: string;
  external_id: string;
  user_role_id: string;
  user_specialty_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  country_id: string;
  city_id: string;
  gender: string;
  address: string;
  phone: string;
  data: any;
  deleted_at: string | null;
  email: string;
  role: UserRoleDto;
  specialty: UserSpecialtyDto | null;
  availabilities: UserAvailability[];
  today_module_name?: string;
  today_module_id?: string;
  minio_id: string | null;
  full_name: string;
  label: string;
  clinical_record: string;
  assistants: UserDto[];
}

export interface UserTableItem {
  id: string;
  fullName: string;
  role: string;
  city: string;
  phone: string;
  email: string;
  roleGroup: string;
}

export interface PrescriptionTableItem {
  id: string;
  doctor: string;
  patient: string;
  created_at: string;
  status?: string;
}

export interface UserAvailability {
  id: string;
  user_id: string;
  appointment_type_id: string;
  branch_id: string | null;
  appointment_duration: number;
  days_of_week: string | string[];
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  office: string;
  module_id: string;
  user: UserDto;
  appointment_type: AppointmentTypeDto;
  branch: BranchDto;
  free_slots: UserAvailabilityFreeSlot[];
}

export interface UserAvailabilityTableItem {
  id: string;
  doctorName: string;
  appointmentType: string;
  branchName: string;
  daysOfWeek: string;
  endTime: string;
  startTime: string;
}

export interface UserAvailabilityFreeSlot {
  id: string;
  user_availability_id: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface UserSpecialtyDto {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  label: string;
}

export interface UserRoleDto {
  id: string;
  name: string;
  group: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  permissions: UserRolePermissionDto[];
  menus: UserRoleMenuDto[];
}

export interface UserRolePermissionDto {
  id: number;
  key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRoleMenuDto {
  id: number;
  key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PrescriptionDto {
  id: string;
  patient_id: string;
  user_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  patient: Patient;
  prescriber: UserDto;
  recipe_items: Medicine[];
  invoice_id: string;
}

export interface Medicine {
  medication: string;
  concentration: string;
  frequency: string;
  duration: number;
  medication_type: string;
  take_every_hours: number;
  quantity: number;
  observations: string;
  showQuantity: boolean;
  showTimeField: boolean;
}

export enum TicketReason {
  ADMISSION_PRESCHEDULED = "ADMISSION_PRESCHEDULED",
  CONSULTATION_GENERAL = "CONSULTATION_GENERAL",
  SPECIALIST = "SPECIALIST",
  VACCINATION = "VACCINATION",
  LABORATORY = "LABORATORY",
  OTHER = "OTHER",
}

export enum TicketPriority {
  NONE = "NONE",
  SENIOR = "SENIOR",
  PREGNANT = "PREGNANT",
  DISABILITY = "DISABILITY",
  CHILDREN_BABY = "CHILDREN_BABY",
}

export enum TicketStatus {
  PENDING = "PENDING",
  CALLED = "CALLED",
  COMPLETED = "COMPLETED",
  MISSED = "MISSED",
}

export interface TicketDto {
  id: string;
  ticket_number: string;
  phone: string;
  email?: string | null;
  reason: TicketReason;
  priority: TicketPriority;
  status: TicketStatus;
  module_id: string;
  branch_id: string;
  created_at: string;
  updated_at: string;

  // Relaciones (opcionales dependiendo de la consulta)
  module?: ModuleDto;
  branch?: BranchDto;
}

export interface TicketTableItemDto {
  id: string;
  ticket_number: string;
  phone: string;
  reason: string;
  priority: string;
  status: string;
  statusView: string;
  statusColor: string;
  step: number;
  created_at: string;
  branch_id: string;
  module_id: string;
}

export interface CreateTicketDTO {
  phone: string;
  email?: string;
  reason: TicketReason;
  priority: TicketPriority;
  branch_id: number;
  module_id?: number; // Opcional cuando se usa asignación automática
}

export interface ModuleDto {
  id: string;
  name: string;
  allowed_reasons: TicketReason[];
  is_active: boolean;
  branch_id: string;
  last_assigned_at?: string | null;
  branch: BranchDto;
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
  type: string;
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
  appointment_id: string;
  exam_order_state_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  exam_type?: ExamTypeDto;
  exam_order_state?: ExamOrderStateDto;
  exam_result?: ExamResultDto | null;
  minio_id?: string;
  items: ExamOrderItemDto[];
  patient: Patient;
}

interface ExamResultDto {
  id: string;
  exam_order_id: string;
  created_by_user_id: string;
  results: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  resource_url?: string;
}

export interface ExamOrderItemDto {
  id: string;
  exam_order_id: string;
  exam_type_id: string;
  created_at: string;
  updated_at: string;
  exam: ExamTypeDto;
}

export interface ExamOrderStateDto {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PatientClinicalRecordDto {
  id: string;
  clinical_record_type_id: string;
  created_by_user_id: string;
  patient_id: string;
  branch_id: string;
  description: string | null;
  data: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  clinical_record_type: ClinicalRecordTypeDto;
  created_by_user: UserDto;
  patient: Patient;
  status: string;
  latest_pending_cancellation_request: GeneralRequestDto | null;
}

export interface GeneralRequestDto {
  id: number;
  type: string;
  status: string;
  priority: string;
  notes: string;
  requestable_id: number;
  requestable_type: string;
  requested_by: number;
  resolved_by: string | null;
  resolved_at: string | null;
  resolution_notes: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClinicalRecordTypeDto {
  id: string;
  name: string;
  description: string;
  form_config: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  key_: string | null;
}

export interface AppointmentTypeDto {
  id: string;
  name: string;
}

export interface SpecializableDto {
  id: string;
  specialty_id: string;
  specializable_id: string;
  specializable_type: string;
  created_at: string;
  updated_at: string;
}

export interface CashControlReportItem {
  id: string;
  total_expected: number;
  total_received: number;
  remaining_amount: number;
  who_delivers: string;
  who_validate: string;
  deleted_at?: string;
  created_at: string;
  updated_at: string;
  details: CashControlReportItemDetail[];
  who_delivers_name: string;
  who_validate_name: string;
  method_payment_name: string;
}

export interface CashControlReportItemDetail {
  id: string;
  cash_closure_id: string;
  payment_method_id: string;
  total_expected: number;
  total_received: number;
  remaining_amount: number;
  created_at: string;
  updated_at: string;
  payment_method_name: string;
}

export interface ExamRecipeDto {
  id: string;
  patient_id: string;
  user_id: string;
  deleted_at: null;
  created_at: string;
  updated_at: string;
  details: ExamRecipeDetailDto[];
  user: UserDto;
  status: string;
  result: ExamRecipeResultDto;
}

export interface ExamRecipeResultDto {
  result_minio_id?: string;
}

export interface ExamRecipeDetailDto {
  id: string;
  exam_recipe_id: string;
  exam_type_id: string;
  created_at: string;
  updated_at: string;
  exam_type: ExamTypeDto;
}

export interface UserAbsenceDto {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user: UserDto;
}

export interface ComissionConfigDto {
  id: string;
  attention_type: string;
  application_type: string;
  commission_type: string;
  percentage_base: string;
  percentage_value: boolean;
  commission_value: string;
  services: string;
  user: UserDto;
}

export interface AccountingVoucherDto {
  id: number;
  description: string;
  status: string;
  seat_date: string;
  seat_number: string;
  total_should_be: number;
  total_is: number;
  created_at: string;
  details: DetailsDto[];
  third_party: ThirdPartyDto;
}

export interface ThirdPartyDto {
  id: number;
  first_name: string;
  second_name: string;
  middle_name: string;
  last_name: string;
  ruc: string;
  address: string;
  phone: string;
  email: string;
}

export interface DetailsDto {
  id: number;
  accounting_account_id: number;
  amount: number;
  type: string;
  description: string;
}
