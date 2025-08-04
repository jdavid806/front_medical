import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

interface category {
  id: string;
  name: string;
  description: string;
}

interface CategoryTableProps {
  categories: category[];
  onEditItem: (id: string) => void;
}

export const CategoriesTable: React.FC<CategoryTableProps> = ({
  categories,
  onEditItem,
}) => {
  const actionBodyTemplate = (rowData: category) => {
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
        value={categories}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: "30rem" }}
        emptyMessage="No se encontraron marcas"
        showGridlines
      >
        <Column field="id" header="ID" sortable style={{ width: "20%" }} />
        <Column
          field="name"
          header="Nombre"
          sortable
          style={{ width: "60%" }}
        />
        <Column
          field="description"
          header="Descripción"
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
