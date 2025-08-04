
// Definimos los tipos de datos del formulario
export type FixedAssetsFormInputs = {
  assetType: "physical" | "non-physical";
  assetName: string;
  asset_category_id: string;
  user_id: string;
  brand: string;
  model: string;
  serial_number: string;
  internal_code: string;
  description: string;
};

export interface FixedAssetsFormProps {
  formId?: string;
  onSubmit: (data: FixedAssetsFormInputs) => void;
  initialData?: FixedAssetsFormInputs | null;
  onCancel?: () => void; // Nueva prop para manejar el cancelar
  loading?: boolean; // Nueva prop para el estado de carga

}
