import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { DocumentoConsentimiento } from '../types/DocumentData';

interface DocumentTableProps {
  data: DocumentoConsentimiento[];
  columns: any[];
  loading: boolean;
  onReload: () => void;
  globalFilterFields: string[];
}

const DocumentTable: React.FC<DocumentTableProps> = ({
  data,
  columns,
  loading,
  onReload,
  globalFilterFields
}) => {
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  return (
    <div className="card">
      <DataTable
        value={data}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: '50rem' }}
        loading={loading}
        filters={filters}
        filterDisplay="menu"
        globalFilterFields={globalFilterFields}
        emptyMessage="No se encontraron consentimientos"
        showGridlines
      >
        {columns.map((column, index) => (
          <Column
            key={index}
            field={column.field}
            header={column.header}
            body={column.body}
            sortable={column.sortable}
            style={column.style}
          />
        ))}
      </DataTable>
    </div>
  );
};

export default DocumentTable;
