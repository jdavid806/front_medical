import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { classNames } from "primereact/utils";

interface Branch {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

interface Filtros {
  name: string;
  city: string;
  country: string;
}

interface BranchTableProps {
  branches: Branch[];
  onEditItem: (id: string) => void;
  onDeleteItem?: (id: string) => void;
  loading?: boolean;
}

type ToastSeverity = "success" | "info" | "warn" | "error";

export const BranchTable: React.FC<BranchTableProps> = ({
  branches,
  onEditItem,
  onDeleteItem,
  loading = false,
}) => {
  const toast = useRef<Toast>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const [filtros, setFiltros] = useState<Filtros>({
    name: "",
    city: "",
    country: "",
  });



  useEffect(() => {
    setFilteredBranches(branches);
  }, [branches]);

  const handleFilterChange = (field: string, value: any) => {
    setFiltros((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const aplicarFiltros = () => {
    let result = [...branches];

    if (filtros.name) {
      result = result.filter((branch) =>
        branch.name.toLowerCase().includes(filtros.name.toLowerCase())
      );
    }

    if (filtros.city) {
      result = result.filter((branch) =>
        branch.city.toLowerCase().includes(filtros.city.toLowerCase())
      );
    }

    if (filtros.country) {
      result = result.filter((branch) =>
        branch.country.toLowerCase().includes(filtros.country.toLowerCase())
      );
    }

    setFilteredBranches(result);
  };

  const limpiarFiltros = () => {
    setFiltros({
      name: "",
      city: "",
      country: "",
    });
    setFilteredBranches(branches);
  };

  const showToast = (
    severity: ToastSeverity,
    summary: string,
    detail: string
  ) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  const confirmDelete = (branch: Branch) => {
    setBranchToDelete(branch);
    setDeleteDialogVisible(true);
  };

  const deleteBranch = () => {
    if (branchToDelete && onDeleteItem) {
      onDeleteItem(branchToDelete.id);
      showToast("success", "Éxito", `Sucursal ${branchToDelete.name} eliminada`);
    }
    setDeleteDialogVisible(false);
    setBranchToDelete(null);
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
        onClick={deleteBranch}
      />
    </div>
  );

  const TableMenu: React.FC<{
    rowData: Branch,
    onEdit: (id: string) => void,
    onDelete: (branch: Branch) => void
  }> = ({ rowData, onEdit, onDelete }) => {

    const menu = useRef<Menu>(null);

    const handleEdit = () => {
      console.log("Editando sucursal con ID:", rowData.id);
      onEdit(rowData.id);
    };

    const handleDelete = () => {
      console.log("Solicitando eliminar sucursal con ID:", rowData.id);
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

  const actionBodyTemplate = (rowData: Branch) => {
    return (
      <div
        className="flex align-items-center justify-content-center"
        style={{ gap: "0.5rem", minWidth: "120px" }}
      >
        <TableMenu
          rowData={rowData}
          onEdit={onEditItem}
          onDelete={confirmDelete}
        />
      </div>
    );
  };

  const emailBodyTemplate = (rowData: Branch) => {
    return (
      <a href={`mailto:${rowData.email}`} className="text-primary">
        {rowData.email}
      </a>
    );
  };

  const phoneBodyTemplate = (rowData: Branch) => {
    return (
      <a href={`tel:${rowData.phone}`} className="text-primary">
        {rowData.phone}
      </a>
    );
  };

  const addressBodyTemplate = (rowData: Branch) => {
    return (
      <span title={rowData.address}>
        {rowData.address?.length > 30
          ? `${rowData.address.substring(0, 30)}...`
          : rowData.address}
      </span>
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
          {branchToDelete && (
            <span>
              ¿Estás seguro que desea eliminar la sucursal <b>{branchToDelete.name}</b>?
              <br />
              <small className="text-muted">Esta acción no se puede deshacer.</small>
            </span>
          )}
        </div>
      </Dialog>

      <Card title="Filtros de Búsqueda" style={styles.card}>
        <div className="row g-3">
          <div className="col-md-6 col-lg-4">
            <label style={styles.formLabel}>Nombre de la Sucursal</label>
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

      <Card title="Sucursales" style={styles.card}>
        <DataTable
          value={filteredBranches}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          loading={loading}
          className="p-datatable-striped p-datatable-gridlines"
          emptyMessage="No se encontraron sucursales"
          responsiveLayout="scroll"
          tableStyle={{ minWidth: "50rem" }}
          showGridlines
        >
          <Column
            field="name"
            header="Nombre"
            sortable
            style={styles.tableCell}
          />
          <Column
            field="email"
            header="Email"
            sortable
            body={emailBodyTemplate}
            style={styles.tableCell}
          />
          <Column
            field="phone"
            header="Teléfono"
            sortable
            body={phoneBodyTemplate}
            style={styles.tableCell}
          />
          <Column
            field="address"
            header="Dirección"
            sortable
            body={addressBodyTemplate}
            style={styles.tableCell}
          />
          <Column
            field="city"
            header="Ciudad"
            sortable
            style={styles.tableCell}
          />
          <Column
            field="country"
            header="País"
            sortable
            style={styles.tableCell}
          />
          <Column
            body={actionBodyTemplate}
            header="Acciones"
            style={{ width: "120px", textAlign: "center" }}
            exportable={false}
          />
        </DataTable>
      </Card>
    </div>
  );
};