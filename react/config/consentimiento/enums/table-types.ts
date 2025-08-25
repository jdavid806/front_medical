import { ReactNode } from "react";
import {
  DataTableFilterMeta,
  DataTableStateEvent,
  SortOrder,
} from "primereact/datatable";


export interface ConsentimientoTableColumn {
  field: string;
  header: string;
  body?: (rowData: any) => ReactNode;
  sortable?: boolean;
  frozen?: boolean;
  style?: React.CSSProperties;
}

export interface ConsentimientoTableProps {
  data: any;
  columns: ConsentimientoTableColumn[];
  lazy?: boolean;
  totalRecords?: number;
  first?: number;
  rows?: number;
  sortField?: string;
  sortOrder?: SortOrder;
  selectionActive?: boolean;
  loading?: boolean;
  globalFilterFields?: string[];
  customFilters?: DataTableFilterMeta;
  disableSearch?: boolean;
  onSelectedRow?: (rowData: any) => void;
  onReload?: () => void;
  onSort?: (event: DataTableStateEvent) => void;
  onPage?: (event: DataTableStateEvent) => void;
  onSearch?: (event: any) => void;
}
