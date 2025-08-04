import { SupplyFormInputs } from "./SupplyForm";

export interface UserFormModalProps {
  show: boolean;
  handleSubmit: (data: SupplyFormInputs) => void;
  initialData?: SupplyFormInputs;
  onHide?: () => void;
}
