import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { SplitButton } from "primereact/splitbutton";

export interface pharmacyInvoicesI {
  id: number;
  invoice: string;
  date: any;
  client: string;
  paid: number;
  remaining_amount: number;
  total_amount: number;
  status: number;
}

interface PharmacyTableProps {
  invoices: pharmacyInvoicesI[];
  lazyState: any;
  loading: boolean;
  totalRecords: number;
  onPage: any;
}

export const PharmacyInvoices: React.FC<PharmacyTableProps> = ({
  invoices,
  lazyState,
  loading,
  totalRecords,
  onPage,
}) => {
const actionBodyTemplate = (rowData: pharmacyInvoicesI) => {
    const items = [
        {
            label: "Descargar Excel",
            command: () => {
                // Lógica para descargar en Excel
                console.log("Descargar Excel", rowData);
            },
        },
        {
            label: "Descargar PDF",
            command: () => {
                // Lógica para descargar en PDF
                console.log("Descargar PDF", rowData);
            },
        },
        {
            label: "Imprimir",
            command: () => {
                // Lógica para imprimir
                console.log("Imprimir", rowData);
            },
        },
    ];

    return (
        <SplitButton
            label="Acciones"
            model={items}
            className="p-button-sm"
        />
    );
};

  return (
    <Card>
      <DataTable
        value={invoices}
        lazy
        paginator
        first={lazyState.first}
        rows={lazyState.rows}
        totalRecords={totalRecords}
        onPage={onPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        loading={loading}
        tableStyle={{ minWidth: "30rem" }}
        emptyMessage="No se encontraron facturas"
        showGridlines
      >
        <Column
          field="invoice"
          header="Factura"
          sortable
          style={{ width: "60%" }}
        />
        <Column field="date" header="Fecha" sortable style={{ width: "60%" }} />
        <Column
          field="client"
          header="Cliente"
          sortable
          style={{ width: "60%" }}
        />
        <Column
          field="paid"
          header="Pagado"
          sortable
          style={{ width: "60%" }}
        />
        <Column
          field="remaining_amount"
          header="Restante"
          sortable
          style={{ width: "60%" }}
        />
        <Column
          field="total_amount"
          header="Monto"
          sortable
          style={{ width: "60%" }}
        />
        <Column
          field="status"
          header="Estado"
          sortable
          style={{ width: "60%" }}
        />
        <Column
          body={actionBodyTemplate}
          header="Acciones"
          style={{ width: "20%", textAlign: "center" }}
        />
      </DataTable>
    </Card>
  );
};
