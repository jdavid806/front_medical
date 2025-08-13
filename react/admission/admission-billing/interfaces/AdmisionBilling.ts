import { Toast } from "primereact/toast";
import { AppointmentTableItem } from "../../../models/models";

export interface PatientData {
  documentType: string;
  documentNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  secondLastName: string;
  birthDate: Date | null;
  gender: string;
  country: string;
  department: string;
  city: string;
  address: string;
  email: string;
  whatsapp: string;
  bloodType: string;
  hasCompanion: boolean;
  facturacionEntidad: boolean;
  facturacionConsumidor: boolean;
}


export interface BillingData {
  entity: string;
  authorizationDate: Date | null;
  authorizationNumber: string;
  authorizedAmount: string;
  consumerName?: string;
  consumerDocument?: string;
  consumerEmail?: string;
  consumerPhone?: string;
  invoiceNumber?: string;
  invoiceDate?: Date;
}

export interface Product {
  id: number;
  code: string;
  description: string;
  price: number;
  quantity: number;
  tax: number;
  discount: number;
  total: number;
}

export interface PaymentMethod {
  id: number;
  method: string;
  amount: number;
  reference?: string;
  authorizationNumber?: string;
  notes?: string;
  date?: Date;
}

export interface CurrentPayment {
  method: string;
  amount: string;
  authorizationNumber: string;
  notes: string;
}

export interface CompanionInfo {
  name: string;
  documentType: DocumentType;
  documentNumber: string;
  relationship: string;
  phone: string;
  address?: string;
}

export interface FormData {
  patient: PatientData;
  billing: BillingData;
  products: Product[];
  payments: PaymentMethod[];
  currentPayment: CurrentPayment;
  companion?: CompanionInfo;
}

export interface PatientStepProps {
  formData: FormData;
  updateFormData: (section: keyof FormData, data: Partial<FormData[keyof FormData]>) => void;
  nextStep: () => void;
  toast: React.RefObject<Toast>;
}

export interface PaymentStepProps {
  formData: FormData;
  updateFormData: (section: keyof FormData, data: Partial<FormData[keyof FormData]>) => void;
  addPayment: (payment: Omit<PaymentMethod, 'id'>) => void;
  removePayment: (id: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  toast: React.RefObject<Toast>;
}

export interface AdmissionBillingProps {
  visible: boolean;
  onHide: () => void;
  appointmentData?: AppointmentTableItem | null;
  onSuccess?: () => void;
}

export interface SelectOption {
  label: string;
  value: any;
  icon?: string;
}

export interface FormErrors {
  [key: string]: {
    message: string;
    type: string;
  };
}