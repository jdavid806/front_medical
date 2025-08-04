import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";

interface CostCenter {
  id: number;
  code: string;
  name: string;
  description: string;
}

interface Filtros {
  code: string;
  name: string;
}

type ToastSeverity = "success" | "info" | "warn" | "error";

interface CostCenterConfigTableProps {
  costCenters: CostCenter[];
  onEditItem: (id: string) => void;
  onDeleteItem?: (id: string) => void;
}

export const CostCenterConfigTable: React.FC<CostCenterConfigTableProps> = ({
  costCenters,
  onEditItem,
  onDeleteItem,
}) => {
  const toast = useRef<Toast>(null);
  const [filteredCostCenters, setFilteredCostCenters] = useState<CostCenter[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [filtros, setFiltros] = useState<Filtros>({
    code: "",
    name: "",
  });

  useEffect(() => {
    const loadCostCenters = async () => {
      try {
        setLoading(true);
        // Mock data - replace with API call
        const mockData: CostCenter[] = [
          {
            id: 1,
            code: "CC-001",
            name: "Administración",
            description: "Centro de costo para el departamento administrativo",
          },
          {
            id: 2,
            code: "CC-002",
            name: "Ventas",
            description: "Centro de costo para el departamento de ventas",
          },
          {
            id: 3,
            code: "CC-003",
            name: "Producción",
            description: "Centro de costo para el área de producción",
          },
        ];

        setFilteredCostCenters(mockData);
      } catch (error) {
        showToast(
          "error",
          "Error",
          "No se pudieron cargar los centros de costo"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCostCenters();
  }, []);

  const handleFilterChange = (field: string, value: any) => {
    setFiltros((prev) => ({ ...prev, [field]: value }));
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
    setFiltros({ code: "", name: "" });
    setFilteredCostCenters(costCenters);
  };

  const showToast = (
    severity: ToastSeverity,
    summary: string,
    detail: string
  ) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  const actionBodyTemplate = (rowData: CostCenter) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-sm p-button-text"
        tooltip="Editar"
        tooltipOptions={{ position: "top" }}
        onClick={() => editCostCenter(rowData)}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-sm p-button-text p-button-danger"
        tooltip="Eliminar"
        tooltipOptions={{ position: "top" }}
        onClick={() => confirmDelete(rowData)}
      />
    </div>
  );

  const editCostCenter = (costCenter: CostCenter) => {
    showToast("info", "Editar", `Editando centro de costo: ${costCenter.name}`);
    onEditItem(costCenter.id.toString());
  };

  const confirmDelete = (costCenter: CostCenter) => {
    showToast(
      "warn",
      "Eliminar",
      `¿Seguro que desea eliminar ${costCenter.name}?`
    );
    if (onDeleteItem) {
      onDeleteItem(costCenter.id.toString());
    }
  };

  const addNewCostCenter = () => {
    showToast("info", "Nuevo", "Agregando nuevo centro de costo");
    // Implementar lógica para abrir modal de creación
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

      <div
        style={{ display: "flex", justifyContent: "flex-end", margin: "10px" }}
      >
        <Button
          label="Nuevo Centro de Costo"
          icon="pi pi-plus"
          className="btn btn-primary"
          onClick={addNewCostCenter}
        />
      </div>

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
              <span title={rowData.description}>
                {rowData.description.length > 30
                  ? `${rowData.description.substring(0, 30)}...`
                  : rowData.description}
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
