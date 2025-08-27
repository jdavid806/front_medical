import React from "react";
import { Button } from 'primereact/button';
import { DocumentoConsentimiento } from "../types/DocumentData";
import { DocumentTableColumn } from "../types/table-types";

interface ColumnActionsProps {
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const getDocumentColumns = ({ onView, onEdit, onDelete }: ColumnActionsProps): DocumentTableColumn[] => [
  { 
    field: "fecha", 
    header: "Fecha",
    sortable: true,
    body: (rowData: DocumentoConsentimiento) => {
      if (!rowData.fecha) return '-';
      return new Date(rowData.fecha).toLocaleDateString('es-ES');
    }
  },
  { 
    field: "titulo", 
    header: "Título",
    sortable: true,
    body: (rowData: DocumentoConsentimiento) => (
      <div>
        <div className="fw-bold">{rowData.titulo || 'Sin título'}</div>
        {rowData.motivo && (
          <small className="text-muted">{rowData.motivo}</small>
        )}
      </div>
    )
  },
  {
    field: "",
    header: "Acciones",
    style: { width: '120px', textAlign: 'center' },
    body: (rowData: DocumentoConsentimiento) => (
      <div className="d-flex justify-content-center gap-1">
        <Button
          className="p-button-rounded p-button-text p-button-sm p-button-info"
          tooltip="Ver documento"
          onClick={(e) => {
            e.stopPropagation();
            onView(rowData.id ?? '');
          }}
        >
          <i className="fas fa-eye"></i>
        </Button>
        <Button
          className="p-button-rounded p-button-text p-button-sm p-button-warning"
          tooltip="Editar documento"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(rowData.id ?? '');
          }}
        >
          <i className="fas fa-pencil-alt"></i>
        </Button>
        <Button
          className="p-button-rounded p-button-text p-button-sm p-button-danger"
          tooltip="Eliminar documento"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(rowData.id ?? '');
          }}
        >
          <i className="fa-solid fa-trash"></i>
        </Button>
      </div>
    ),
  },
];
