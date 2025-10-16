import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Accordion, AccordionTab } from "primereact/accordion";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { CustomPRTable, CustomPRTableColumnProps } from "../components/CustomPRTable";
import { ComissionConfigDto } from "../models/models.js";
import { comissionConfig } from "../../services/api";
import { SwalManager } from "../../services/alertManagerImported";

interface CommissionsTableProps {
  commissions: ComissionConfigDto[];
  onEditItem?: (id: string) => void;
  onDeleteItem?: (id: string) => void;
  loading?: boolean;
  onReload?: () => void;
}

export const CommissionTable: React.FC<CommissionsTableProps> = ({
  commissions,
  onEditItem,
  onDeleteItem,
  loading = false,
  onReload
}) => {
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [commissionToDelete, setCommissionToDelete] = useState<ComissionConfigDto | null>(null);
  const [filteredCommissions, setFilteredCommissions] = useState<ComissionConfigDto[]>([]);
  const [filtros, setFiltros] = useState({
    fullName: "",
    attention_type: "",
    application_type: "",
  });
  const toast = useRef<Toast>(null);

  // Función para sincronizar los datos filtrados
  const syncFilteredData = () => {
    let result = [...commissions];

    // Filtro por nombre del profesional
    if (filtros.fullName) {
      result = result.filter((commission) =>
        commission.fullName.toLowerCase().includes(filtros.fullName.toLowerCase())
      );
    }

    // Filtro por tipo de atención
    if (filtros.attention_type) {
      result = result.filter((commission) =>
        commission.attention_type.toLowerCase().includes(filtros.attention_type.toLowerCase())
      );
    }

    // Filtro por tipo de aplicación
    if (filtros.application_type) {
      result = result.filter((commission) =>
        commission.application_type.toLowerCase().includes(filtros.application_type.toLowerCase())
      );
    }

    setFilteredCommissions(result);
  };

  // Sincroniza cuando cambian las commissions o los filtros
  useEffect(() => {
    syncFilteredData();
  }, [commissions, filtros]);

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
      fullName: "",
      attention_type: "",
      application_type: "",
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

  const confirmDelete = (commission: ComissionConfigDto) => {
    setCommissionToDelete(commission);
    setDeleteDialogVisible(true);
  };

  const deleteCommission = async () => {
    if (commissionToDelete) {
      try {
        const response = await comissionConfig.CommissionConfigDelete(commissionToDelete.id);
        console.log(response);

        SwalManager.success({
          title: "Registro Eliminado",
        });

        // Refrescar después de eliminar
        if (onReload) {
          await onReload();
        }
      } catch (error) {
        console.error("Error al eliminar comisión:", error);
        SwalManager.error({
          title: "Error",
          text: "No se pudo eliminar el registro",
        });
      }
    }
    setDeleteDialogVisible(false);
    setCommissionToDelete(null);
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
        onClick={deleteCommission}
      />
    </div>
  );

  const TableMenu: React.FC<{
    rowData: ComissionConfigDto,
    onEdit: (id: string) => void,
    onDelete: (commission: ComissionConfigDto) => void
  }> = ({ rowData, onEdit, onDelete }) => {
    const menu = useRef<Menu>(null);

    const handleEdit = () => {
      console.log("Editando comisión con ID:", rowData.id);
      onEdit(rowData.id);
    };

    const handleDelete = () => {
      console.log("Solicitando eliminar comisión con ID:", rowData.id);
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

  const actionBodyTemplate = (rowData: ComissionConfigDto) => {
    return (
      <div
        className="flex align-items-center justify-content-center"
        style={{ gap: "0.5rem", minWidth: "120px" }}
      >
        <TableMenu
          rowData={rowData}
          onEdit={onEditItem ? onEditItem : () => { }}
          onDelete={confirmDelete}
        />
      </div>
    );
  };

  // Función para formatear valores de comisión
  const formatCommissionValue = (commission: ComissionConfigDto) => {
    if (commission.commission_type === "Porcentaje") {
      return `${commission.commission_value}%`;
    }
    return `$${commission.commission_value}`;
  };

  // Función para formatear porcentaje
  const formatPercentage = (value: string) => {
    return value ? `${value}%` : "N/A";
  };

  // Mapear los datos para la tabla
  const tableItems = filteredCommissions.map(commission => ({
    id: commission.id,
    fullName: commission.fullName,
    attention_type: commission.attention_type,
    application_type: commission.application_type,
    commission_type: commission.commission_type,
    commission_value: formatCommissionValue(commission),
    percentage_base: commission.percentage_base || "N/A",
    percentage_value: formatPercentage(commission.percentage_value),
    actions: commission
  }));

  const columns: CustomPRTableColumnProps[] = [
    {
      field: 'fullName',
      header: 'Profesional',
      sortable: true
    },
    {
      field: 'attention_type',
      header: 'Tipo de atención',
      sortable: true
    },
    {
      field: 'application_type',
      header: 'Tipo de aplicación',
      sortable: true
    },
    {
      field: 'commission_type',
      header: 'Comisión',
      sortable: true
    },
    {
      field: 'commission_value',
      header: 'Valor de la comisión',
      sortable: true
    },
    {
      field: 'percentage_base',
      header: 'Porcentaje aplicado',
      sortable: true
    },
    {
      field: 'percentage_value',
      header: 'Porcentaje',
      sortable: true
    },
    {
      field: 'actions',
      header: 'Acciones',
      body: (rowData: any) => actionBodyTemplate(rowData.actions),
      exportable: false
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
          {commissionToDelete && (
            <span>
              ¿Estás seguro que deseas eliminar la comisión de <b>{commissionToDelete.fullName}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <div className="card mb-3">
        <div className="card-body">


          <CustomPRTable
            columns={columns}
            data={tableItems}
            loading={loading}
            onSearch={handleSearchChange}
            onReload={handleRefresh}
          />
        </div>
      </div>
    </div>
  );
};