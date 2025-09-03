import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { useAccountingAccounts } from "../../../accounting/hooks/useAccountingAccounts";
import { Account, Filtros, RetentionConfigTableProps, ToastSeverity } from "../interfaces/RetentionConfigTableType";
import { Retention } from "../interfaces/RetentionFormConfigType";

export const RetentionConfigTable: React.FC<RetentionConfigTableProps> = ({
  retentions,
  onEditItem,
  onDeleteItem,
  loading = false
}) => {
  const toast = useRef<Toast>(null);
  const [filteredRetentions, setFilteredRetentions] = useState<Retention[]>([]);
  const [filtros, setFiltros] = useState<Filtros>({
    name: "",
    percentage: null,
    account: null,
  });

  const { accounts: accountingAccounts, isLoading: isLoadingAccounts } = useAccountingAccounts();

  const renderAccount = (account: { id: string; name: string } | null) => {
    if (!account) return "No asignada";

    if (account.name && !account.name.startsWith("Cuenta ")) {
      return account.name;
    }

    const fullAccount = accountingAccounts?.find(acc =>
      acc.id.toString() === account.id ||
      acc.account_code?.toString() === account.id
    );

    return fullAccount?.account_name || account.name || `Cuenta ${account.id}`;
  };

  useEffect(() => {
    setFilteredRetentions(retentions);
  }, [retentions]);

  const handleFilterChange = (field: keyof Filtros, value: any) => {
    setFiltros((prev) => ({ ...prev, [field]: value }));
  };

  const aplicarFiltros = () => {
    let result = [...retentions];

    if (filtros.name) {
      result = result.filter((ret) =>
        ret.name.toLowerCase().includes(filtros.name.toLowerCase())
      );
    }

    if (filtros.account) {
      result = result.filter((ret) =>
        ret.account?.id === filtros.account ||
        ret.returnAccount?.id === filtros.account
      );
    }

    setFilteredRetentions(result);
  };

  const limpiarFiltros = () => {
    setFiltros({
      name: "",
      account: null,
      percentage: null,
    });
    setFilteredRetentions(retentions);
  };

  const showToast = (
    severity: ToastSeverity,
    summary: string,
    detail: string
  ) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  const actionBodyTemplate = (rowData: Retention) => {
    return (
      <div
        className="flex align-items-center justify-content-center"
        style={{ gap: "0.5rem", minWidth: "120px" }}
      >
        <Button
          className="p-button-rounded p-button-text p-button-sm"
          onClick={() => editRetention(rowData)}
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

  const editRetention = (retention: Retention) => {
    showToast("info", "Editar", `Editando retención: ${retention.name}`);
    onEditItem(retention.id.toString());
  };

  const confirmDelete = (retention: Retention) => {
    showToast("warn", "Eliminar", `¿Seguro que desea eliminar ${retention.name}?`);
    if (onDeleteItem) {
      onDeleteItem(retention.id.toString());
    }
  };

  const getAccountOptions = () => {
    if (!accountingAccounts) return [];
    return accountingAccounts.map((account) => ({
      label: account.account_name || `Cuenta ${account.account_code}`,
      value: account.id.toString(),
    }));
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
    <div className="container-fluid mt-4" style={{ width: "100%", padding: "0 15px" }}>
      <Toast ref={toast} />

      <Card title="Filtros de Búsqueda" style={styles.card}>
        <div className="row g-3">
          <div className="col-md-6 col-lg-4">
            <label style={styles.formLabel}>Nombre de Retención</label>
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
              placeholder={isLoadingAccounts ? "Cargando cuentas..." : "Seleccione cuenta"}
              className={classNames("w-100")}
              filter
              filterBy="label"
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

      <Card title="Configuración de Retenciones" style={styles.card}>
        <DataTable
          value={filteredRetentions}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          loading={loading}
          className="p-datatable-striped p-datatable-gridlines"
          emptyMessage="No se encontraron retenciones"
          responsiveLayout="scroll"
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column
            field="name"
            header="Nombre de Retención"
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