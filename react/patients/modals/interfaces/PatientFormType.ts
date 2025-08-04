import { Patient } from "../../../models/models";

export interface PatientFormModalProps {
  visible: boolean;
  onHide: () => void;
  onSuccess?: () => void;
 patientData?: Patient | null;
}
export interface StepValidations {
  [key: number]: string[];
}
export interface FormDataObject {
  [key: string]: any;
}
export type PatientFormFields =
  | "patient.document_type"
  | "patient.document_number"
  | "patient.first_name"
  | "patient.middle_name"
  | "patient.last_name"
  | "patient.second_last_name"
  | "patient.gender"
  | "patient.date_of_birth"
  | "patient.whatsapp"
  | "patient.email"
  | "patient.civil_status"
  | "patient.ethnicity"
  | "patient.blood_type"
  | "patient.country_id"
  | "patient.department_id"
  | "patient.city_id"
  | "patient.address"
  | "patient.nationality"
  | "social_security.entity_id"
  | "social_security.arl"
  | "social_security.afp";
export interface Companion {
  document_type: string;
  document_number: string;
  first_name: string;
  last_name: string;
  relationship: string;
  mobile: string;
  email?: string;
}