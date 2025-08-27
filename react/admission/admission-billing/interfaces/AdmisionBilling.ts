import { Toast } from "primereact/toast";
import { AppointmentTableItem } from "../../../models/models";

export interface PatientData {
  id: string;
  nameComplet: string;
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
  insurance: string;
  affiliateType: string;
  entity_id: string;
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
  facturacionEntidad: boolean;
  facturacionConsumidor: boolean;
}

export interface Product {
  uuid: string;
  id: number;
  code: string;
  description: string;
  price: number;
  copayment: number;
  currentPrice: number;
  quantity: number;
  tax: number;
  discount: number;
  total: number;
}

export interface PaymentMethod {
  id: number;
  method: string;
  amount: number;
  total: number;
  change: number;
  reference?: string;
  authorizationNumber?: string;
  notes?: string;
  date?: Date;
}

export interface CurrentPayment {

  method: any;
  amount: number;
  authorizationNumber: string;
  notes: string;
}

export interface CompanionInfo {
  name: string;
  documentType: string;
  documentNumber: string;
  relationship: string;
  phone: string;
  address?: string;
}

export interface AdmissionBillingFormData {
  patient: PatientData;
  billing: BillingData;
  products: Product[];
  payments: PaymentMethod[];
  currentPayment: CurrentPayment;
  companion?: CompanionInfo;
}

export interface PatientStepProps {
  formData: AdmissionBillingFormData;
  updateFormData: <K extends keyof AdmissionBillingFormData>(section: K, data: Partial<AdmissionBillingFormData[K]>) => void;
  updateBillingData: <K extends keyof BillingData>(field: K, value: BillingData[K]) => void;
  nextStep: () => void;

  toast: React.RefObject<Toast | null>;
}

export interface PaymentStepProps {
  formData: AdmissionBillingFormData;
  updateFormData: (section: keyof AdmissionBillingFormData, data: Partial<AdmissionBillingFormData[keyof AdmissionBillingFormData]>) => void;
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



