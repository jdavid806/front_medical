import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Accordion, AccordionTab } from "primereact/accordion";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { CustomPRTable, CustomPRTableColumnProps } from "../../../components/CustomPRTable";
import {
  CostCenter,
  CostCenterConfigTableProps,
  ToastSeverity,
} from "../interfaces/CostCenterConfigTableType";

export const CostCenterConfigTable: React.FC<CostCenterConfigTableProps> = ({
  costCenters = [],
  onEditItem,
  onDeleteItem,
  loading = false,
  onReload,
  // Nuevas props para el botón
  onCreate,
  createLoading = false,
  updateLoading = false,
  deleteLoading = false
}) => {
  const toast = useRef<Toast>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [costCenterToDelete, setCostCenterToDelete] = useState<CostCenter | null>(null);
  const [filteredCostCenters, setFilteredCostCenters] = useState<CostCenter[]>([]);
  const [filtros, setFiltros] = useState({
    code: "",
    name: "",
  });

  // Función para sincronizar los datos filtrados
  const syncFilteredData = () => {
    let result = [...costCenters];

    // Aplicar filtros actuales
    if (filtros.code) {
      result = result.filter((cc) =>
        cc.code.toLowerCase().includes(filtros.code.toLowerCase())
      );
    }

    if (filtros.name) {
      result = result.filter((cc) =>
        cc.name.toLowerCase().includes(filtros.name.toLowerCase())
      );
    }

    setFilteredCostCenters(result);
  };

  // Sincroniza cuando cambian los costCenters o los filtros
  useEffect(() => {
    syncFilteredData();
  }, [costCenters, filtros]);

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
      code: "",
      name: "",
    });
  };

  const handleRefresh = async () => {
    limpiarFiltros();

    if (onReload) {
      await onReload();
    }
  };

  const showToast = (
    severity: ToastSeverity,
    summary: string,
    detail: string
  ) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  const confirmDelete = (costCenter: CostCenter) => {
    setCostCenterToDelete(costCenter);
    setDeleteDialogVisible(true);
  };

  const deleteCostCenter = async () => {
    if (costCenterToDelete && onDeleteItem) {
      await onDeleteItem(costCenterToDelete.id.toString());
      showToast("success", "Éxito", `Centro de costo ${costCenterToDelete.name} eliminado`);

      // Refrescar después de eliminar
      if (onReload) {
        await onReload();
      }
    }
    setDeleteDialogVisible(false);
    setCostCenterToDelete(null);
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
        onClick={deleteCostCenter}
      />
    </div>
  );

  const TableMenu: React.FC<{
    rowData: CostCenter,
    onEdit: (id: string) => void,
    onDelete: (costCenter: CostCenter) => void
  }> = ({ rowData, onEdit, onDelete }) => {

    const menu = useRef<Menu>(null);

    const handleEdit = () => {
      console.log("Editando centro de costo con ID:", rowData.id.toString());
      onEdit(rowData.id.toString());
    };

    const handleDelete = () => {
      console.log("Solicitando eliminar centro de costo con ID:", rowData.id.toString());
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
          <i className="fa fa-cog ml-2"></i>
        </Button>
        <Menu
          model={[
            {
              label: "Editar",
              icon: <i className="fa-solid fa-pen me-2"></i>,
              command: handleEdit,
            },
            {
              label: "Eliminar",
              icon: <i className="fa fa-trash me-2"></i>,
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

  const actionBodyTemplate = (rowData: CostCenter) => {
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

  // Mapear los datos para la tabla
  const tableItems = filteredCostCenters.map(costCenter => ({
    id: costCenter.id,
    code: costCenter.code,
    name: costCenter.name,
    description: costCenter.description,
    actions: costCenter
  }));

  const columns: CustomPRTableColumnProps[] = [
    {
      field: 'code',
      header: 'Código',
      sortable: true
    },
    {
      field: 'name',
      header: 'Nombre',
      sortable: true
    },
    {
      field: 'description',
      header: 'Descripción',
      body: (rowData: any) => (
        <span title={rowData.description}>
          {rowData.description && rowData.description.length > 30
            ? `${rowData.description.substring(0, 30)}...`
            : rowData.description || "N/A"}
        </span>
      )
    },
    {
      field: 'actions',
      header: 'Acciones',
      width: "20px",
      body: (rowData: any) => actionBodyTemplate(rowData.actions),
      exportable: false
    }
  ];

  return (
    <div className="w-100">
      <Toast ref={toast} />
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
          {costCenterToDelete && (
            <span>
              ¿Estás seguro que deseas eliminar el centro de costo <b>{costCenterToDelete.name}</b>?
            </span>
          )}
        </div>
      </Dialog>



      <div
        className="card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto"
        style={{ minHeight: "400px" }}
      >
        <div className="card-body h-100 w-100 d-flex flex-column" style={{ marginTop: "-50px" }}>
          <div className="text-end pt-3 mb-2">
            <Button
              className="p-button-primary"
              onClick={onCreate}
              disabled={createLoading || updateLoading || deleteLoading}
            >
              <i className="fas fa-plus me-2"></i>
              {createLoading || updateLoading ? 'Procesando...' : 'Nuevo Centro de Costo'}
            </Button>
          </div>
          <Accordion>
            <AccordionTab header="Filtros">
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">
                    Código
                  </label>
                  <InputText
                    value={filtros.code}
                    onChange={(e) => handleFilterChange("code", e.target.value)}
                    placeholder="Buscar por código"
                    className="w-100"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Nombre
                  </label>
                  <InputText
                    value={filtros.name}
                    onChange={(e) => handleFilterChange("name", e.target.value)}
                    placeholder="Buscar por nombre"
                    className="w-100"
                  />
                </div>
              </div>
            </AccordionTab>
          </Accordion>
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