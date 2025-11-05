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
  onReload,
  // Nuevas props para el botón
  onCreate,
  createLoading = false,
  updateLoading = false,
  deleteLoading = false
}) => {
  const toast = useRef<Toast>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [taxToDelete, setTaxToDelete] = useState<Tax | null>(null);
  const [filteredTaxes, setFilteredTaxes] = useState<Tax[]>([]);
  const [filtros, setFiltros] = useState({
    name: "",
    account: null as string | null,
  });

  const { accounts: accountingAccounts, isLoading: isLoadingAccounts } =
    useAccountingAccounts();

  // Función para sincronizar los datos filtrados
  const syncFilteredData = () => {
    let result = [...taxes];

    // Aplicar filtros actuales
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

  // Sincroniza cuando cambian los taxes o los filtros
  useEffect(() => {
    syncFilteredData();
  }, [taxes, filtros]);

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

  const confirmDelete = (tax: Tax) => {
    setTaxToDelete(tax);
    setDeleteDialogVisible(true);
  };

  const deleteMethod = async () => {
    if (taxToDelete && onDeleteItem) {
      await onDeleteItem(taxToDelete.id.toString());
      showToast("success", "Éxito", `Impuesto ${taxToDelete.name} eliminado`);

      // Refrescar después de eliminar
      if (onReload) {
        await onReload();
      }
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
        onClick={deleteMethod}
      />
    </div>
  );

  const TableMenu: React.FC<{
    rowData: Tax,
    onEdit: (id: string) => void,
    onDelete: (tax: Tax) => void
  }> = ({ rowData, onEdit, onDelete }) => {

    const menu = useRef<Menu>(null);

    const handleEdit = () => {
      console.log("Editando impuesto con ID:", rowData.id.toString());
      onEdit(rowData.id.toString());
    };

    const handleDelete = () => {
      console.log("Solicitando eliminar impuesto con ID:", rowData.id.toString());
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

  const actionBodyTemplate = (rowData: Tax) => {
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
  const tableItems = filteredTaxes.map(tax => ({
    id: tax.id,
    name: tax.name,
    percentage: `${tax.percentage}%`,
    account: renderAccount(tax.account),
    returnAccount: renderAccount(tax.returnAccount),
    description: tax.description,
    actions: tax
  }));

  const columns: CustomPRTableColumnProps[] = [
    {
      field: 'name',
      header: 'Nombre del Impuesto',
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
          {taxToDelete && (
            <span>
              ¿Estás seguro que desea eliminar el impuesto <b>{taxToDelete.name}</b>?
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
              {createLoading || updateLoading ? 'Procesando...' : 'Nuevo Impuesto'}
            </Button>
          </div>
          <Accordion>
            <AccordionTab header="Filtros">
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">
                    Nombre del Impuesto
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