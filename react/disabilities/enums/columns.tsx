import { DisabilityData } from "./DisabilityData";
import { DisabilityTableColumn } from "./table-types";
import React from "react";
import { PrintTableAction } from "../../components/table-actions/PrintTableAction";
import { ShareTableAction } from "../../components/table-actions/ShareTableAction";
import { EditTableAction } from "../../components/table-actions/EditTableAction";
import TableActionsWrapper from "../../components/table-actions/TableActionsWrapper";

interface ColumnActionsProps {
  editDisability: (id: string) => void;
  deleteDisability: (id: string) => void;
  handlePrint: () => void;
  shareDisabilityWhatsApp: (disabilityData: any) => void;
}

export const getColumns = ({ editDisability, deleteDisability, handlePrint, shareDisabilityWhatsApp }: ColumnActionsProps): DisabilityTableColumn[] => [
  { field: "id", header: "ID" },
  { 
    field: "start_date", 
    header: "Fecha de inicio",
    body: (rowData: DisabilityData) => {
      const date = new Date(rowData.start_date);
      return date.toLocaleDateString('es-ES');
    }
  },
  { 
    field: "end_date", 
    header: "Fecha de fin",
    body: (rowData: DisabilityData) => {
      const date = new Date(rowData.end_date);
      return date.toLocaleDateString('es-ES');
    }
  },
  { field: "reason", header: "Razón" },
  { 
    field: "is_active", 
    header: "Estado",
    body: (rowData: DisabilityData) => (
      <span className={`badge ${rowData.is_active ? 'bg-success' : 'bg-danger'}`}>
        {rowData.is_active ? 'Activa' : 'Inactiva'}
      </span>
    )
  },
  { 
    field: "user.first_name", 
    header: "Médico",
    body: (rowData: DisabilityData) => (
      `${rowData.user.first_name} ${rowData.user.last_name}`
    )
  },
  { 
    field: "user.specialty.name", 
    header: "Especialidad",
    body: (rowData: DisabilityData) => (
      rowData.user.specialty?.name || 'N/A'
    )
  },
  { 
    field: "created_at", 
    header: "Fecha de creación",
    body: (rowData: DisabilityData) => {
      const date = new Date(rowData.created_at);
      return date.toLocaleDateString('es-ES');
    }
  },
  {
    field: "",
    header: "Acciones",
    body: (rowData: DisabilityData) => (
      <div className="text-end align-middle">
        <TableActionsWrapper>
          <PrintTableAction
            onTrigger={() => handlePrint()}
          />
          
          <EditTableAction
            onTrigger={() => editDisability(rowData.id.toString())}
          />

          <ShareTableAction
            shareType="whatsapp"
            onTrigger={() => shareDisabilityWhatsApp(rowData)}
          />
        </TableActionsWrapper>
      </div>
    ),
  },
];
