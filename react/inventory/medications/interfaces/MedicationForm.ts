import { Nullable } from "primereact/ts-helpers";

export type MedicationFormInputs = {
  name: string;
  presentation: string;
  concentration: string;
  minimum_stock: number;
  maximum_stock: number;
  description: string;
  weight: number;
  capacity: number;
  sale_price: number;
};

export interface MedicationFormProps {
  formId: string;
  onHandleSubmit: (data: MedicationFormInputs) => Promise<void>;
  initialData?: MedicationFormInputs;
  isSubmitting?: boolean;
}