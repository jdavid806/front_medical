import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
const DocumentTable = ({
  data,
  columns,
  loading,
  onReload,
  globalFilterFields
}) => {
  const [filters, setFilters] = useState({
    global: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: data,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    tableStyle: {
      minWidth: '50rem'
    },
    loading: loading,
    filters: filters,
    filterDisplay: "menu",
    globalFilterFields: globalFilterFields,
    emptyMessage: "No se encontraron consentimientos",
    showGridlines: true
  }, columns.map((column, index) => /*#__PURE__*/React.createElement(Column, {
    key: index,
    field: column.field,
    header: column.header,
    body: column.body,
    sortable: column.sortable,
    style: column.style
  }))));
};
export default DocumentTable;