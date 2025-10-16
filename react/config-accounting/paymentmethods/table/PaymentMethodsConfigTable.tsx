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
  PaymentMethod,
  PaymentMethodsConfigTableProps,
  ToastSeverity,
} from "../interfaces/PaymentMethodsConfigTableTypes";

export const PaymentMethodsConfigTable: React.FC<
  PaymentMethodsConfigTableProps
> = ({ onEditItem, paymentMethods = [], loading = false, onDeleteItem, onReload }) => {
  const toast = useRef<Toast>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<PaymentMethod | null>(null);
  const [filteredPaymentMethods, setFilteredPaymentMethods] = useState<PaymentMethod[]>([]);
  const [filtros, setFiltros] = useState({
    name: "",
    category: null as string | null,
  });

  const categories = [
    { label: "Transaccional", value: "transactional" },
    { label: "Vencimiento Proveedores", value: "supplier_expiration" },
    // { label: "Transferencia", value: "supplier_expiration" },
    { label: "Vencimiento Clientes", value: "customer_expiration" },
    { label: "Anticipo Clientes", value: "customer_advance" },
    { label: "Anticipo Proveedores", value: "supplier_advance" },
  ];

  const syncFilteredData = () => {
    let result = [...paymentMethods];

    if (filtros.name) {
      result = result.filter((method) =>
        method.name.toLowerCase().includes(filtros.name.toLowerCase())
      );
    }
    if (filtros.category) {
      result = result.filter((method) => method.category === filtros.category);
    }

    setFilteredPaymentMethods(result);
  };

  useEffect(() => {
    syncFilteredData();
  }, [paymentMethods, filtros]);

  const getCategoryLabel = (categoryValue: string) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
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
      category: null,
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

  const confirmDelete = (method: PaymentMethod) => {
    setMethodToDelete(method);
    setDeleteDialogVisible(true);
  };

  const deleteMethod = async () => {
    if (methodToDelete && onDeleteItem) {
      await onDeleteItem(methodToDelete.id.toString());
      showToast("success", "Éxito", `Método ${methodToDelete.name} eliminado`);

      // Refrescar después de eliminar
      if (onReload) {
        await onReload();
      }
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

  const TableMenu: React.FC<{
    rowData: PaymentMethod,
    onEdit: (id: string) => void,
    onDelete: (method: PaymentMethod) => void
  }> = ({ rowData, onEdit, onDelete }) => {
    const menu = useRef<Menu>(null);
    const handleEdit = () => {
      onEdit(rowData.id.toString());
    };
    const handleDelete = () => {
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

  const actionBodyTemplate = (rowData: PaymentMethod) => {
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
  const tableItems = filteredPaymentMethods.map(method => ({
    id: method.id,
    name: method.name,
    category: getCategoryLabel(method.category),
    account: method.account?.name || "No asignada",
    additionalDetails: method.additionalDetails,
    actions: method
  }));

  const columns: CustomPRTableColumnProps[] = [
    {
      field: 'name',
      header: 'Nombre del Método',
      sortable: true
    },
    {
      field: 'category',
      header: 'Categoría',
      sortable: true
    },
    {
      field: 'account',
      header: 'Cuenta Contable',
      sortable: true
    },
    {
      field: 'additionalDetails',
      header: 'Detalles Adicionales',
      body: (rowData: any) => (
        <span title={rowData.additionalDetails}>
          {rowData.additionalDetails?.length > 30
            ? `${rowData.additionalDetails.substring(0, 30)}...`
            : rowData.additionalDetails}
        </span>
      )
    },
    {
      field: 'actions',
      header: 'Acciones',
      body: (rowData: any) => actionBodyTemplate(rowData.actions),
      exportable: false,
      width: "120px"
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
          {methodToDelete && (
            <span>
              ¿Estás seguro que desea eliminar el método de pago, tenga en cuenta que afectará a todos los pagos asociados <b>{methodToDelete.name}</b>?
            </span>
          )}
        </div>
      </Dialog>
      <div className="card mb-3">
        <div className="card-body">
          <Accordion>
            <AccordionTab header="Filtros">
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">
                    Nombre del Método
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
                    Categoría
                  </label>
                  <Dropdown
                    value={filtros.category}
                    options={categories}
                    onChange={(e) => handleFilterChange("category", e.value)}
                    optionLabel="label"
                    placeholder="Seleccione categoría"
                    className="w-100"
                    showClear
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