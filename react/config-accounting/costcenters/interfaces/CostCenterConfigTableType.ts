export interface CostCenter {
  id: number;
  code: string;
  name: string;
  description: string;
}

export interface Filtros {
  code: string;
  name: string;
}

export type ToastSeverity = "success" | "info" | "warn" | "error";

export interface CostCenterConfigTableProps {
  costCenters: CostCenter[];
  onEditItem: (id: string) => void;
  onDeleteItem?: (id: string) => void;
  loading?: boolean;
  onReload: () => void;
  onCreate?: () => void;
  createLoading?: boolean;
  updateLoading?: boolean;
  deleteLoading?: boolean;
}
