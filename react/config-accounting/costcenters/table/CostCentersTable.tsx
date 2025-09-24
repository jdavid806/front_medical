import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Menu } from "primereact/menu";
import { classNames } from "primereact/utils";
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
}) => {
  const toast = useRef<Toast>(null);
  const [filteredCostCenters, setFilteredCostCenters] = useState<CostCenter[]>([]);
  const [filtros, setFiltros] = useState({
    code: "",
    name: "",
  });

  useEffect(() => {
    setFilteredCostCenters(costCenters);
  }, [costCenters]);

  const handleFilterChange = (field: string, value: any) => {
    setFiltros((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const aplicarFiltros = () => {
    let result = [...costCenters];

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

  const limpiarFiltros = () => {
    setFiltros({
      code: "",
      name: "",
    });
    setFilteredCostCenters(costCenters);
  };

  const showToast = (
    severity: ToastSeverity,
    summary: string,
    detail: string
  ) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

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
          onDelete={(costCenter) => {
            if (onDeleteItem) {
              onDeleteItem(costCenter.id.toString());
            }
          }}
        />
      </div>
    );
  };

  const styles = {
    card: {
      marginBottom: "20px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
    },
    cardTitle: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#333",
    },
    tableHeader: {
      backgroundColor: "#f8f9fa",
      color: "#495057",
      fontWeight: 600,
    },
    tableCell: {
      padding: "0.75rem 1rem",
    },
    formLabel: {
      fontWeight: 500,
      marginBottom: "0.5rem",
      display: "block",
    },
  };

  return (
    <div
      className="container-fluid mt-4"
      style={{ width: "100%", padding: "0 15px" }}
    >
      <Toast ref={toast} />

      <Card title="Filtros de Búsqueda" style={styles.card}>
        <div className="row g-3">
          <div className="col-md-6 col-lg-4">
            <label style={styles.formLabel}>Código</label>
            <InputText
              value={filtros.code}
              onChange={(e) => handleFilterChange("code", e.target.value)}
              placeholder="Buscar por código"
              className={classNames("w-100")}
            />
          </div>
          <div className="col-md-6 col-lg-4">
            <label style={styles.formLabel}>Nombre</label>
            <InputText
              value={filtros.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              placeholder="Buscar por nombre"
              className={classNames("w-100")}
            />
          </div>

          <div className="col-12 d-flex justify-content-end gap-2">
            <Button
              label="Limpiar"
              icon="pi pi-trash"
              className="btn btn-phoenix-secondary"
              onClick={limpiarFiltros}
            />
            <Button
              label="Aplicar Filtros"
              icon="pi pi-filter"
              className="btn btn-primary"
              onClick={aplicarFiltros}
              loading={loading}
            />
          </div>
        </div>
      </Card>

      <Card title="Configuración de Centros de Costo" style={styles.card}>
        <DataTable
          value={filteredCostCenters}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          loading={loading}
          className="p-datatable-striped p-datatable-gridlines"
          emptyMessage="No se encontraron centros de costo"
          responsiveLayout="scroll"
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column
            field="code"
            header="Código"
            sortable
            style={styles.tableCell}
          />
          <Column
            field="name"
            header="Nombre"
            sortable
            style={styles.tableCell}
          />
          <Column
            field="description"
            header="Descripción"
            style={styles.tableCell}
            body={(rowData) => (
              <span title={rowData.description || ""}>
                {rowData.description && rowData.description.length > 30
                  ? `${rowData.description.substring(0, 30)}...`
                  : rowData.description || "N/A"}
              </span>
            )}
          />
          <Column
            body={actionBodyTemplate}
            header="Acciones"
            style={{ width: "120px" }}
            exportable={false}
          />
        </DataTable>
      </Card>
    </div>
  );
};