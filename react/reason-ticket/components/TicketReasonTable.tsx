import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { CustomPRTable, CustomPRTableColumnProps } from "../../components/CustomPRTable";
import { TicketReasonDto } from "../../models/models";
import { SwalManager } from "../../../services/alertManagerImported";

interface TicketReasonTableProps {
  ticketReasons: TicketReasonDto[];
  onEditItem?: (id: string) => void;
  onDeleteItem?: (id: string) => void;
  loading?: boolean;
  onReload?: () => void;
}

interface TicketReasonTableItem {
  id: number;
  label: string;
  actions: any;
}

export const TicketReasonTable: React.FC<TicketReasonTableProps> = ({
  ticketReasons,
  onEditItem,
  onDeleteItem,
  loading = false,
  onReload
}) => {
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [reasonToDelete, setReasonToDelete] = useState<TicketReasonTableItem | null>(null);
  const [filteredReasons, setFilteredReasons] = useState<TicketReasonTableItem[]>([]);
  const [filtros, setFiltros] = useState({
    label: "",
  });
  const toast = useRef<Toast>(null);

  // Mapear y filtrar los motivos cuando cambian los datos o los filtros
  useEffect(() => {
    const mappedReasons: TicketReasonTableItem[] = ticketReasons.map(reason => ({
      id: reason.id,
      label: reason.label,
      actions: { id: reason.id, label: reason.label }
    }));

    // Aplicar filtros
    let result = [...mappedReasons];

    if (filtros.label) {
      result = result.filter(reason =>
        reason.label.toLowerCase().includes(filtros.label.toLowerCase())
      );
    }

    setFilteredReasons(result);
  }, [ticketReasons, filtros]);

  const handleFilterChange = (field: string, value: any) => {
    setFiltros((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearchChange = (searchValue: string) => {
    console.log("Search value:", searchValue);
  };

  const limpiarFiltros = () => {
    setFiltros({
      label: "",
    });
  };

  const handleRefresh = async () => {
    limpiarFiltros();

    if (onReload) {
      await onReload();
    }
  };

  const showToast = (severity: any, summary: string, detail: string) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  const confirmDelete = (reason: TicketReasonTableItem) => {
    setReasonToDelete(reason);
    setDeleteDialogVisible(true);
  };

  const deleteReason = async () => {
    if (reasonToDelete && onDeleteItem) {
      try {
        onDeleteItem(reasonToDelete.id.toString());

        SwalManager.success({
          title: "Motivo Eliminado",
        });

        // Refrescar después de eliminar
        if (onReload) {
          await onReload();
        }
      } catch (error) {
        console.error("Error al eliminar motivo:", error);
        SwalManager.error({
          title: "Error",
          text: "No se pudo eliminar el motivo",
        });
      }
    }
    setDeleteDialogVisible(false);
    setReasonToDelete(null);
  };

  const deleteDialogFooter = (
    <div className="flex justify-content-end gap-2">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => setDeleteDialogVisible(false)}
      />
      <Button
        label="Eliminar"
        icon="pi pi-check"
        className="p-button-danger"
        onClick={deleteReason}
      />
    </div>
  );

  const TableMenu: React.FC<{
    rowData: TicketReasonTableItem,
    onEdit: (id: string) => void,
    onDelete: (reason: TicketReasonTableItem) => void
  }> = ({ rowData, onEdit, onDelete }) => {
    const menu = useRef<Menu>(null);

    const handleEdit = () => {
      console.log("Editando motivo con ID:", rowData.id);
      onEdit(rowData.id.toString());
    };

    const handleDelete = () => {
      console.log("Solicitando eliminar motivo con ID:", rowData.id);
      onDelete(rowData);
    };

    return (
      <div style={{ position: "relative" }}>
        <Button
          className="btn-primary flex items-center gap-2"
          onClick={(e) => menu.current?.toggle(e)}
          aria-controls={`popup_menu_${rowData.id}`}
          aria-haspopup
        >
          Acciones
          <i className="fas fa-cog ml-2"></i>
        </Button>
        <Menu
          model={[
            {
              label: "Editar",
              icon: <i className="fas fa-edit me-2"></i>,
              command: handleEdit,
            },
            {
              label: "Eliminar",
              icon: <i className="fas fa-trash me-2"></i>,
              command: handleDelete,
            }
          ]}
          popup
          ref={menu}
          id={`popup_menu_${rowData.id}`}
          appendTo={document.body}
          style={{ zIndex: 9999 }}
        />
      </div>
    );
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div
        className="flex align-items-center justify-content-end"
        style={{ gap: "0.5rem", minWidth: "120px" }}
      >
        <TableMenu
          rowData={rowData.actions}
          onEdit={onEditItem ? onEditItem : () => { }}
          onDelete={confirmDelete}
        />
      </div>
    );
  };

  const columns: CustomPRTableColumnProps[] = [
    {
      field: 'label',
      header: 'Label',
      sortable: true
    },
    {
      field: 'actions',
      header: 'Acciones',
      body: actionBodyTemplate,
      exportable: false,
      width: "150px"
    }
  ];

  return (
    <div className="w-100">
      <Toast ref={toast} />

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        visible={deleteDialogVisible}
        style={{ width: "450px" }}
        header="Confirmar"
        modal
        footer={deleteDialogFooter}
        onHide={() => setDeleteDialogVisible(false)}
      >
        <div className="flex align-items-center justify-content-center">
          <i
            className="fas fa-exclamation-triangle mr-3"
            style={{ fontSize: "2rem", color: "#F8BB86" }}
          />
          {reasonToDelete && (
            <span>
              ¿Estás seguro que deseas eliminar el motivo <b>"{reasonToDelete.label}"</b>?
            </span>
          )}
        </div>
      </Dialog>

      <div className="card mb-3">
        <div className="card-body">
          <CustomPRTable
            columns={columns}
            data={filteredReasons}
            loading={loading}
            onSearch={handleSearchChange}
            onReload={handleRefresh}
          />
        </div>
      </div>
    </div>
  );
};