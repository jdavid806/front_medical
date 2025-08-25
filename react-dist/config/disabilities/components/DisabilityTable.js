import React, { useEffect, useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { useDebounce } from 'primereact/hooks';
const CustomPRTable = ({
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
  disableSearch,
  onSelectedRow,
  onReload,
  loading,
  onSort,
  onPage,
  onSearch
}) => {
  const [filters, setFilters] = useState({
    global: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS
    },
    ...customFilters
  });
  const [globalFilterValue, debounceGlobalFilterValue, setGlobalFilterValue] = useDebounce('', 500);
  const [selectedItem, setSelectedItem] = useState(null);
  const onGlobalFilterChange = e => {
    const value = e.target.value;
    let _filters = {
      ...filters
    };

    // @ts-ignore
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const handleOnSelectionChange = e => {
    if (!selectionActive) return;
    setSelectedItem(e.value);
    onSelectedRow && onSelectedRow(e.value);
  };
  const header = () => {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "btn btn-outline-primary me-2",
      onClick: onReload
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-sync"
    })), !disableSearch && /*#__PURE__*/React.createElement(InputText, {
      value: globalFilterValue,
      onChange: onGlobalFilterChange,
      placeholder: "Buscar"
    }));
  };
  useEffect(() => {
    onSearch && onSearch(debounceGlobalFilterValue);
  }, [debounceGlobalFilterValue]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DataTable, {
    dataKey: "uuid",
    value: data,
    paginator: true,
    rows: rows,
    first: first,
    totalRecords: totalRecords,
    rowsPerPageOptions: [1, 2, 5, 10, 25, 50],
    removableSort: true,
    globalFilterFields: globalFilterFields,
    tableStyle: {
      minWidth: '50rem'
    },
    showGridlines: true,
    header: header,
    filters: filters,
    selectionMode: "single",
    selection: selectedItem,
    onSelectionChange: handleOnSelectionChange,
    emptyMessage: "No se encontraron registros.",
    currentPageReportTemplate: "Mostrando {first} a {last} de {totalRecords} registros",
    paginatorTemplate: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",
    scrollable: true,
    loading: loading,
    sortField: sortField,
    sortOrder: sortOrder || 1,
    onPage: onPage,
    onSort: onSort,
    lazy: lazy
  }, columns.map(column => /*#__PURE__*/React.createElement(Column, {
    key: column.field,
    field: column.field,
    header: column.header,
    body: column.body,
    sortable: column.sortable,
    alignFrozen: "right",
    frozen: column.frozen
  }))));
};
export default CustomPRTable;