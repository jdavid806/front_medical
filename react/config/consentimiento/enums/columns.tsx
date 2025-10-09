import { ConsentimientoData } from "./ConsentimientoData";
import { ConsentimientoTableColumn } from "./table-types";
import React from "react";
import { Button } from 'primereact/button';

interface ColumnActionsProps {
  editConsentimiento: (id: string) => void;
  deleteConsentimiento: (id: string) => void;
}

export const getColumns = ({ editConsentimiento, deleteConsentimiento }: ColumnActionsProps): ConsentimientoTableColumn[] => [
  // { field: "tenant_id", header: "ID del Tenant" },
  { field: "title", header: "Título",},
  //{ field: "data", header: "Datos" },
  { field: "description", header: "Descripción" },
  {
    field: "",
    header: "Acciones",
    style: { width: '60px' },
    body: (rowData: ConsentimientoData) => (
      <div>
        <Button
          className="p-button-rounded p-button-text p-button-sm"
          onClick={(e) => {
            e.stopPropagation();
            editConsentimiento(rowData.id ?? '');
          }}
        >
          <i className="fas fa-pencil-alt"></i>
        </Button>
        <Button
          className="p-button-rounded p-button-text p-button-sm p-button-danger"
          onClick={(e) => {
            e.stopPropagation();
            deleteConsentimiento(rowData.id ?? '');
          }}
        >
          <i className="fa-solid fa-trash"></i>
        </Button>
      </div>
    ),
  },
];
