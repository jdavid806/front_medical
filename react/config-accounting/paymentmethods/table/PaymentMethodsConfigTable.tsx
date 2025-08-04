import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import {
  Filtros,
  PaymentMethod,
  PaymentMethodsConfigTableProps,
  ToastSeverity,
} from "../interfaces/PaymentMethodsConfigTableTypes";

export const PaymentMethodsConfigTable: React.FC<
  PaymentMethodsConfigTableProps
> = ({ onEditItem, paymentMethods = [], loading = false, onDeleteItem }) => {
  const toast = useRef<Toast>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<PaymentMethod | null>(
    null
  );
  const [filteredMethods, setFilteredMethods] = useState<PaymentMethod[]>([]);
  const [filtros, setFiltros] = useState<Filtros>({
    name: "",
    category: null,
  });

  const categories = [
  { label: "Transaccional", value: "transactional" },
  { label: "Vencimiento Proveedores", value: "card" },
  { label: "Transferencia", value: "supplier_expiration" },
  { label: "Vencimiento Clientes", value: "customer_expiration" },
  { label: "Anticipo Clientes", value: "customer_advance" },
  { label: "Anticipo Proveedores", value: "supplier_advance" },
  ];

    const getCategoryLabel = (categoryValue: string) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  useEffect(() => {
    setFilteredMethods(paymentMethods);
  }, [paymentMethods]);

  const handleFilterChange = (field: string, value: any) => {
    setFiltros((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const aplicarFiltros = () => {
    let result = [...paymentMethods];

    if (filtros.name) {
      result = result.filter((method) =>
        method.name.toLowerCase().includes(filtros.name.toLowerCase())
      );
    }

    if (filtros.category) {
      result = result.filter((method) => method.category === filtros.category);
    }

    setFilteredMethods(result);
  };

  const limpiarFiltros = () => {
    setFiltros({
      name: "",
      category: null,
    });
    setFilteredMethods(paymentMethods);
  };

  const showToast = (
    severity: ToastSeverity,
    summary: string,
    detail: string
  ) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };


  const actionBodyTemplate = (rowData: PaymentMethod) => {
    return (
      <div
        className="flex align-items-center justify-content-center"
        style={{ gap: "0.5rem", minWidth: "120px" }}
      >
        <Button
          className="p-button-rounded p-button-text p-button-sm"
          onClick={() => editMethod(rowData)}
        >
          <i className="fas fa-pencil-alt"></i>
        </Button>
        <Button
          className="p-button-rounded p-button-text p-button-sm p-button-danger"
          onClick={() => confirmDelete(rowData)}
        >
          <i className="fa-solid fa-trash"></i>
        </Button>
      </div>
    );
  };

const editMethod = (method: PaymentMethod) => {
  if (onEditItem) {
    onEditItem(method.id.toString()); 
  }
  showToast("info", "Editar", `Editando método: ${method.name}`);
};

  const confirmDelete = (method: PaymentMethod) => {
    setMethodToDelete(method);
    setDeleteDialogVisible(true);
  };

  const deleteMethod = () => {
    if (methodToDelete && onDeleteItem) {
      onDeleteItem(methodToDelete.id.toString());
      showToast("success", "Éxito", `Método ${methodToDelete.name} eliminado`);
    }
    setDeleteDialogVisible(false);
    setMethodToDelete(null);
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
        onClick={deleteMethod}
      />
    </div>
  );

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
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem", color: "#f8bb86" }}
          />
          {methodToDelete && (
            <span>
              ¿Estás seguro que desea  eliminar el método de pago, tenga en cuenta que afectará a todos los pagos asociados <b>{methodToDelete.name}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Card title="Filtros de Búsqueda" style={styles.card}>
        <div className="row g-3">
          <div className="col-md-6 col-lg-4">
            <label style={styles.formLabel}>Nombre del Método</label>
            <InputText
              value={filtros.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              placeholder="Buscar por nombre"
              className={classNames("w-100")}
            />
          </div>

          <div className="col-md-6 col-lg-4">
            <label style={styles.formLabel}>Categoría</label>
            <Dropdown
              value={filtros.category}
              options={categories}
              onChange={(e) => handleFilterChange("category", e.value)}
              optionLabel="label"
              placeholder="Seleccione categoría"
              className={classNames("w-100")}
              showClear
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

      <Card title="Métodos de Pago" style={styles.card}>
        <DataTable
          value={filteredMethods}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          loading={loading}
          className="p-datatable-striped p-datatable-gridlines"
          emptyMessage="No se encontraron métodos de pago"
          responsiveLayout="scroll"
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column
            field="name"
            header="Nombre del Método"
            sortable
            style={styles.tableCell}
          />
          <Column
            field="category"
            header="Categoría"
            sortable
            body={(rowData) => getCategoryLabel(rowData.category)}
            style={styles.tableCell}
          />
          <Column
            field="account"
            header="Cuenta Contable"
            sortable
            body={(rowData) => rowData.account?.name || "No asignada"}
            style={styles.tableCell}
          />
          <Column
            field="additionalDetails"
            header="Detalles Adicionales"
            style={styles.tableCell}
            body={(rowData) => (
              <span title={rowData.additionalDetails}>
                {rowData.additionalDetails?.length > 30
                  ? `${rowData.additionalDetails.substring(0, 30)}...`
                  : rowData.additionalDetails}
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
