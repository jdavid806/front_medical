import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { CSSProperties } from "react";
import { useGeneralJournal } from "./hooks/useGeneralJournal";

interface GeneralJournalProps {
  fetchData: (startDate: string, endDate: string) => Promise<any[]>;
}

export const GeneralJournal: React.FC<GeneralJournalProps> = ({
  fetchData,
}) => {
  const { dateRange, setDateRange, generalJournal, fetchGeneralJournal, loading } = useGeneralJournal();

  const formatCurrency = (value: string) => {
    return value ? `$${parseFloat(value).toFixed(2)}` : '';
  };

  const columns = [
    { field: 'fecha', header: 'Fecha', body: (rowData: any) => new Date(rowData.fecha).toLocaleDateString() },
    { field: 'numero_asiento', header: 'N° Asiento' },
    { field: 'cuenta', header: 'Cuenta' },
    {
      field: 'debe',
      header: 'Debe',
      body: (rowData: any) => formatCurrency(rowData.debe),
      style: { textAlign: 'right' }
    },
    {
      field: 'haber',
      header: 'Haber',
      body: (rowData: any) => formatCurrency(rowData.haber),
      style: { textAlign: 'right' }
    },
    { field: 'descripcion', header: 'Descripción' },
    { field: 'tercero', header: 'Tercero' }
  ];

  return (
    <div className="container-fluid mt-4">
      <Card title="Libro Diario de Contabilidad" className="mb-3">
        <div className="row mb-4">
          <div className="col-md-4">
            <label htmlFor="dateRange" className="form-label">Rango de fechas</label>
            <Calendar
              id="dateRange"
              selectionMode="range"
              value={dateRange}
              onChange={(e) => setDateRange(e.value)}
              className="w-100"
              showIcon
              dateFormat="dd/mm/yy"
              placeholder="Seleccione un rango"
              appendTo={document.body}
            />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <Button
              label="Filtrar"
              icon="pi pi-filter"
              onClick={fetchGeneralJournal}
              className="w-100"
              disabled={!dateRange || dateRange.length !== 2}
            />
          </div>
        </div>

        <DataTable
          value={generalJournal}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          loading={loading}
          stripedRows
          className="p-datatable-gridlines"
          emptyMessage="No se encontraron asientos contables"
          tableStyle={{ minWidth: "100%" }}
          header="Asientos Contables"
        >
          {columns.map((col, i) => (
            <Column
              key={i}
              field={col.field}
              header={col.header}
              body={col.body}
              style={col.style as CSSProperties}
              sortable
            />
          ))}
        </DataTable>
      </Card>
    </div>
  );
};