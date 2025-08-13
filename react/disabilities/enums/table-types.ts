import { ReactNode } from "react";
import {
  DataTableFilterMeta,
  DataTableStateEvent,
  SortOrder,
} from "primereact/datatable";


export interface DisabilityTableColumn {
  field: string;
  header: string;
  body?: (rowData: any) => ReactNode;
  sortable?: boolean;
  frozen?: boolean;
}

export interface DisabilityTableProps {
  data: any;
  columns: DisabilityTableColumn[];
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
