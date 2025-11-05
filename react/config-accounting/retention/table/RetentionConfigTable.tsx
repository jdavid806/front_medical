import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { CustomPRTable, CustomPRTableColumnProps } from "../../../components/CustomPRTable";
import {
  RetentionConfigTableProps,
  ToastSeverity,
} from "../interfaces/RetentionConfigTableType";
import { useAccountingAccounts } from "../../../accounting/hooks/useAccountingAccounts";
import { Retention } from "../interfaces/RetentionFormConfigType";

export const RetentionConfigTable: React.FC<RetentionConfigTableProps> = ({
  retentions = [],
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
  const [retentionToDelete, setRetentionToDelete] = useState<Retention | null>(null);
  const [filteredRetentions, setFilteredRetentions] = useState<Retention[]>([]);
  const [filtros, setFiltros] = useState({
    name: "",
    account: null as string | null,
  });

  const { accounts: accountingAccounts, isLoading: isLoadingAccounts } =
    useAccountingAccounts();

  // Función para sincronizar los datos filtrados
  const syncFilteredData = () => {
    let result = [...retentions];

    // Aplicar filtros actuales
    if (filtros.name) {
      result = result.filter((retention) =>
        retention.name.toLowerCase().includes(filtros.name.toLowerCase())
      );
    }

    if (filtros.account) {
      result = result.filter(
        (retention) =>
          retention.account?.id === filtros.account ||
          retention.returnAccount?.id === filtros.account
      );
    }

    setFilteredRetentions(result);
  };

  // Sincroniza cuando cambian las retenciones o los filtros
  useEffect(() => {
    syncFilteredData();
  }, [retentions, filtros]);

  const getAccountOptions = () => {
    if (!accountingAccounts) return [];

    return accountingAccounts.map((account) => ({
      label: account.account_name || `Cuenta ${account.account_code}`,
      value: account.id.toString(),
    }));
  };

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
      name: "",
      account: null,
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

  const confirmDelete = (retention: Retention) => {
    setRetentionToDelete(retention);
    setDeleteDialogVisible(true);
  };

  const deleteMethod = async () => {
    if (retentionToDelete && onDeleteItem) {
      await onDeleteItem(retentionToDelete.id.toString());
      showToast("success", "Éxito", `Retención ${retentionToDelete.name} eliminada`);

      // Refrescar después de eliminar
      if (onReload) {
        await onReload();
      }
    }
    setDeleteDialogVisible(false);
    setRetentionToDelete(null);
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

  const TableMenu: React.FC<{
    rowData: Retention,
    onEdit: (id: string) => void,
    onDelete: (retention: Retention) => void
  }> = ({ rowData, onEdit, onDelete }) => {

    const menu = useRef<Menu>(null);

    const handleEdit = () => {
      console.log("Editando retención con ID:", rowData.id.toString());
      onEdit(rowData.id.toString());
    };

    const handleDelete = () => {
      console.log("Solicitando eliminar retención con ID:", rowData.id.toString());
      onDelete(rowData);
    };

    return (
      <div style={{ position: "relative" }}>
        <Button
          className="p-button-primary flex items-center gap-2"
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

  const actionBodyTemplate = (rowData: Retention) => {
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
  const tableItems = filteredRetentions.map(retention => ({
    id: retention.id,
    name: retention.name,
    percentage: `${retention.percentage}%`,
    account: renderAccount(retention.account),
    returnAccount: renderAccount(retention.returnAccount),
    description: retention.description,
    actions: retention
  }));

  const columns: CustomPRTableColumnProps[] = [
    {
      field: 'name',
      header: 'Nombre de la Retención',
      sortable: true
    },
    {
      field: 'percentage',
      header: 'Porcentaje (%)',
      sortable: true
    },
    {
      field: 'account',
      header: 'Cuenta Contable',
      sortable: true
    },
    {
      field: 'returnAccount',
      header: 'Cuenta Contable Reversa',
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
          {retentionToDelete && (
            <span>
              ¿Estás seguro que desea eliminar la retención <b>{retentionToDelete.name}</b>?
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
              {createLoading || updateLoading ? 'Procesando...' : 'Nueva Retención'}
            </Button>
          </div>
          <Accordion>
            <AccordionTab header="Filtros">
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">
                    Nombre de la Retención
                  </label>
                  <InputText
                    value={filtros.name}
                    onChange={(e) => handleFilterChange("name", e.target.value)}
                    placeholder="Buscar por nombre"
                    className="w-100"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Cuenta contable
                  </label>
                  <Dropdown
                    value={filtros.account}
                    options={getAccountOptions()}
                    onChange={(e) => handleFilterChange("account", e.value)}
                    optionLabel="label"
                    placeholder={
                      isLoadingAccounts ? "Cargando cuentas..." : "Seleccione cuenta"
                    }
                    className="w-100"
                    filter
                    filterBy="label"
                    showClear
                    disabled={isLoadingAccounts}
                    loading={isLoadingAccounts}
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