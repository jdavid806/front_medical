import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

interface branch {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

interface BranchTableProps {
  branches: branch[];
  onEditItem: (id: string) => void;
}

export const BranchTable: React.FC<BranchTableProps> = ({
  branches,
  onEditItem,
}) => {
  const actionBodyTemplate = (rowData: branch) => {
    return (
      <Button
        icon={<i className="fas fa-pencil"></i>}
        rounded
        text
        onClick={() => onEditItem(rowData.id)}
      />
    );
  };

  return (
    <Card>
      <DataTable
        value={branches}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: "30rem" }}
        emptyMessage="No se encontraron marcas"
        showGridlines
      >
        <Column
          field="name"
          header="Nombre"
          sortable
          style={{ width: "60%" }}
        />
        <Column
          field="email"
          header="Email"
          sortable
          style={{ width: "60%" }}
        />
        <Column
          field="address"
          header="Dirección"
          sortable
          style={{ width: "60%" }}
        />
        <Column
          field="city"
          header="Ciudad"
          sortable
          style={{ width: "60%" }}
        />
        <Column
          field="country"
          header="Pais"
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
