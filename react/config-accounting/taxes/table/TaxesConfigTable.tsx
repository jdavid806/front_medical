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
  Tax,
  TaxesConfigTableProps,
  ToastSeverity,
} from "../interfaces/TaxesConfigTableType";
import { useAccountingAccounts } from "../../../accounting/hooks/useAccountingAccounts";

export const TaxesConfigTable: React.FC<TaxesConfigTableProps> = ({
  taxes = [],
  onEditItem,
  onDeleteItem,
  loading = false,
}) => {
  const toast = useRef<Toast>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [taxToDelete, setTaxToDelete] = useState<Tax | null>(null);
  const [filteredTaxes, setFilteredTaxes] = useState<Tax[]>([]);
  const [filtros, setFiltros] = useState<Filtros>({
    name: "",
    account: null,
    percentage: null,
  });
  const { accounts: accountingAccounts, isLoading: isLoadingAccounts } =
    useAccountingAccounts();

  const getAccountOptions = () => {
    if (!accountingAccounts) return [];

    return accountingAccounts.map((account) => ({
      label: account.account_name || `Cuenta ${account.account_code}`,
      value: account.id.toString(),
    }));
  };
  // Función mejorada para mostrar nombres de cuentas
const renderAccount = (account: { id: string; name: string } | null) => {
    if (!account) return "No asignada";
    
    if (account.name && !account.name.startsWith("Cuenta ")) {
        return account.name;
    }
    
    const fullAccount = accountingAccounts?.find(
        (acc) => acc.id.toString() === account.id
    );
    
    return fullAccount?.account_name || account.name || `Cuenta ${account.id}`;
};

  useEffect(() => {
    setFilteredTaxes(taxes);
  }, [taxes]);

  const handleFilterChange = (field: string, value: any) => {
    setFiltros((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const aplicarFiltros = () => {
    let result = [...taxes];

    if (filtros.name) {
      result = result.filter((tax) =>
        tax.name.toLowerCase().includes(filtros.name.toLowerCase())
      );
    }

    if (filtros.account) {
      result = result.filter(
        (tax) =>
          tax.account?.id === filtros.account ||
          tax.returnAccount?.id === filtros.account
      );
    }

    setFilteredTaxes(result);
  };
  const limpiarFiltros = () => {
    setFiltros({
      name: "",
      account: null,
      percentage: null,
    });
    setFilteredTaxes(taxes);
  };

  const showToast = (
    severity: ToastSeverity,
    summary: string,
    detail: string
  ) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  const actionBodyTemplate = (rowData: Tax) => {
    return (
      <div
        className="flex align-items-center justify-content-center"
        style={{ gap: "0.5rem", minWidth: "120px" }}
      >
        <Button
          className="p-button-rounded p-button-text p-button-sm"
          onClick={() => editTax(rowData)}
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

  const editTax = (tax: Tax) => {
    if (onEditItem) {
      onEditItem(tax.id.toString());
    }
    showToast("info", "Editar", `Editando impuesto: ${tax.name}`);
  };

  const confirmDelete = (tax: Tax) => {
    setTaxToDelete(tax);
    setDeleteDialogVisible(true);
  };

  const deleteTax = () => {
    if (taxToDelete && onDeleteItem) {
      onDeleteItem(taxToDelete.id.toString());
      showToast("success", "Éxito", `Impuesto ${taxToDelete.name} eliminado`);
    }
    setDeleteDialogVisible(false);
    setTaxToDelete(null);
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
        onClick={deleteTax}
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
          {taxToDelete && (
            <span>
              ¿Estás seguro que deseas eliminar el impuesto{" "}
              <b>{taxToDelete.name}</b>? Esta acción afectará a todos los
              productos asociados.
            </span>
          )}
        </div>
      </Dialog>

      <Card title="Filtros de Búsqueda" style={styles.card}>
        <div className="row g-3">
          <div className="col-md-6 col-lg-4">
            <label style={styles.formLabel}>Nombre del Impuesto</label>
            <InputText
              value={filtros.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              placeholder="Buscar por nombre"
              className={classNames("w-100")}
            />
          </div>

          <div className="col-md-6 col-lg-4">
            <label style={styles.formLabel}>Cuenta contable</label>
            <Dropdown
              value={filtros.account}
              options={getAccountOptions()}
              onChange={(e) => handleFilterChange("account", e.value)}
              optionLabel="label"
              placeholder={
                isLoadingAccounts ? "Cargando cuentas..." : "Seleccione cuenta"
              }
              className={classNames("w-100")}
             filter
                filterBy="account_name,account_code"
                showClear
              disabled={isLoadingAccounts}
              loading={isLoadingAccounts}
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

      <Card title="Configuración de Impuestos" style={styles.card}>
        <DataTable
          value={filteredTaxes}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          loading={loading}
          className="p-datatable-striped p-datatable-gridlines"
          emptyMessage="No se encontraron impuestos"
          responsiveLayout="scroll"
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column
            field="name"
            header="Nombre del Impuesto"
            sortable
            style={styles.tableCell}
          />
          <Column
            field="percentage"
            header="Porcentaje (%)"
            sortable
            body={(rowData) => `${rowData.percentage}%`}
            style={styles.tableCell}
          />
          <Column
            field="account"
            header="Cuenta Contable"
            sortable
            body={(rowData) => renderAccount(rowData.account)}
            style={styles.tableCell}
          />
          <Column
            field="returnAccount"
            header="Cuenta Contable Reversa"
            sortable
            body={(rowData) => renderAccount(rowData.returnAccount)}
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
