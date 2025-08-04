import { Nullable } from "primereact/ts-helpers";

export type SupplyFormInputs = {
  name: string;
  category: string;
  presentation: string;
  minimum_stock: number;
  maximum_stock: number;
  description: string;
  weight: number;
  brand: string;
  sale_price: number;
};

export interface SupplyFormProps {
  formId: string;
  onHandleSubmit: (data: SupplyFormInputs) => void;
  initialData?: SupplyFormInputs;
}
