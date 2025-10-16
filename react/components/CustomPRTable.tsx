import React, { ReactNode, useEffect, useState } from "react";
import { DataTable, DataTableFilterMeta, DataTableStateEvent, SortOrder } from 'primereact/datatable';
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { useDebounce } from 'primereact/hooks';
import { Button } from "primereact/button";

export interface CustomPRTableColumnProps {
    field: string;
    header: string;
    body?: (rowData: any) => ReactNode;
    sortable?: boolean
    frozen?: boolean
    width?: string;
}

export interface CustomPRTableProps {
    data: any;
    columns: CustomPRTableColumnProps[];
    lazy?: boolean
    totalRecords?: number
    first?: number;
    rows?: number;
    sortField?: string
    sortOrder?: SortOrder
    selectionActive?: boolean
    loading?: boolean
    globalFilterFields?: string[]
    customFilters?: DataTableFilterMeta
    disableSearch?: boolean
    disableReload?: boolean
    disablePaginator?: boolean
    size?: "normal" | "small" | "large" | undefined,
    footerGroup?: any
    onSelectedRow?: (rowData: any) => void
    onReload?: () => void
    onSort?: (event: DataTableStateEvent) => void
    onPage?: (event: DataTableStateEvent) => void
    onSearch?: (event: any) => void
}

export const CustomPRTable: React.FC<CustomPRTableProps> = ({
    data,
    columns,
    lazy = false,
    first = 0,
    rows = 5,
    totalRecords = 0,
    sortField,
    sortOrder,
    selectionActive,
    globalFilterFields,
    customFilters,
    disableSearch = false,
    disableReload = false,
    disablePaginator = false,
    size = 'normal',
    onSelectedRow,
    onReload,
    loading,
    onSort,
    onPage,
    onSearch,
    footerGroup
}) => {

    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        ...customFilters
    });
    const [globalFilterValue, debounceGlobalFilterValue, setGlobalFilterValue] = useDebounce('', 500);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };

        // @ts-ignore
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const handleOnSelectionChange = (e: any) => {
        if (!selectionActive) return;
        setSelectedItem(e.value);
        onSelectedRow && onSelectedRow(e.value);
    };

    const header = () => {
        return (
            <div className="d-flex justify-content-between">
                {!disableReload && <Button
                    type="button"
                    className="p-button-primary me-2"
                    onClick={onReload}>
                    <i className="fas fa-sync"></i>
                </Button>}
                {!disableSearch && <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" />}
            </div>
        );
    };

    useEffect(() => {
        onSearch && onSearch(debounceGlobalFilterValue);
    }, [debounceGlobalFilterValue]);

    return (
        <>
            <DataTable
                dataKey={"uuid"}
                value={data}
                paginator={!disablePaginator}
                rows={rows}
                first={first}
                totalRecords={totalRecords}
                rowsPerPageOptions={[1, 2, 5, 10, 25, 50]}
                removableSort
                globalFilterFields={globalFilterFields}
                // tableStyle={{ minWidth: '50rem' }}
                showGridlines
                header={(!disableSearch || !disableReload) && header}
                filters={filters}
                selectionMode={"single"}
                selection={selectedItem}
                onSelectionChange={handleOnSelectionChange}
                emptyMessage="No se encontraron registros."
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                scrollable
                loading={loading}
                sortField={sortField}
                sortOrder={sortOrder || 1}
                onPage={onPage}
                onSort={onSort}
                lazy={lazy}
                size={size}
                footerColumnGroup={footerGroup}
            >
                {columns.map((column) => (
                    <Column
                        key={column.field}
                        field={column.field}
                        header={column.header}
                        body={column.body}
                        sortable={column.sortable}
                        alignFrozen="right"
                        frozen={column.frozen}
                        style={{ width: column.width || 'auto' }}
                        headerStyle={{ width: column.width || 'auto' }}
                    />
                ))}
            </DataTable>
        </>
    );
};