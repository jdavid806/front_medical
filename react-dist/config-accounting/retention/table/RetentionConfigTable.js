import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { CustomPRTable } from "../../../components/CustomPRTable.js";
import { useAccountingAccounts } from "../../../accounting/hooks/useAccountingAccounts.js";
export const RetentionConfigTable = ({
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
  const toast = useRef(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [retentionToDelete, setRetentionToDelete] = useState(null);
  const [filteredRetentions, setFilteredRetentions] = useState([]);
  const [filtros, setFiltros] = useState({
    name: "",
    account: null
  });
  const {
    accounts: accountingAccounts,
    isLoading: isLoadingAccounts
  } = useAccountingAccounts();

  // Función para sincronizar los datos filtrados
  const syncFilteredData = () => {
    let result = [...retentions];

    // Aplicar filtros actuales
    if (filtros.name) {
      result = result.filter(retention => retention.name.toLowerCase().includes(filtros.name.toLowerCase()));
    }
    if (filtros.account) {
      result = result.filter(retention => retention.account?.id === filtros.account || retention.returnAccount?.id === filtros.account);
    }
    setFilteredRetentions(result);
  };

  // Sincroniza cuando cambian las retenciones o los filtros
  useEffect(() => {
    syncFilteredData();
  }, [retentions, filtros]);
  const getAccountOptions = () => {
    if (!accountingAccounts) return [];
    return accountingAccounts.map(account => ({
      label: account.account_name || `Cuenta ${account.account_code}`,
      value: account.id.toString()
    }));
  };
  const renderAccount = account => {
    if (!account) return "No asignada";
    if (account.name && !account.name.startsWith("Cuenta ")) {
      return account.name;
    }
    const fullAccount = accountingAccounts?.find(acc => acc.id.toString() === account.id);
    return fullAccount?.account_name || account.name || `Cuenta ${account.id}`;
  };
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSearchChange = searchValue => {
    console.log("Search value:", searchValue);
  };
  const limpiarFiltros = () => {
    setFiltros({
      name: "",
      account: null
    });
  };
  const handleRefresh = async () => {
    limpiarFiltros();
    if (onReload) {
      await onReload();
    }
  };
  const showToast = (severity, summary, detail) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000
    });
  };
  const confirmDelete = retention => {
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
  const deleteDialogFooter = /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    className: "p-button-text",
    onClick: () => setDeleteDialogVisible(false)
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Eliminar",
    icon: "pi pi-check",
    className: "p-button-danger",
    onClick: deleteMethod
  }));
  const TableMenu = ({
    rowData,
    onEdit,
    onDelete
  }) => {
    const menu = useRef(null);
    const handleEdit = () => {
      console.log("Editando retención con ID:", rowData.id.toString());
      onEdit(rowData.id.toString());
    };
    const handleDelete = () => {
      console.log("Solicitando eliminar retención con ID:", rowData.id.toString());
      onDelete(rowData);
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      className: "p-button-primary flex items-center gap-2",
      onClick: e => menu.current?.toggle(e),
      "aria-controls": `popup_menu_${rowData.id}`,
      "aria-haspopup": true
    }, "Acciones", /*#__PURE__*/React.createElement("i", {
      className: "fa fa-cog ml-2"
    })), /*#__PURE__*/React.createElement(Menu, {
      model: [{
        label: "Editar",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fa-solid fa-pen me-2"
        }),
        command: handleEdit
      }, {
        label: "Eliminar",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fa fa-trash me-2"
        }),
        command: handleDelete
      }],
      popup: true,
      ref: menu,
      id: `popup_menu_${rowData.id}`,
      appendTo: document.body,
      style: {
        zIndex: 9999
      }
    }));
  };
  const actionBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center justify-content-center",
      style: {
        gap: "0.5rem",
        minWidth: "120px"
      }
    }, /*#__PURE__*/React.createElement(TableMenu, {
      rowData: rowData,
      onEdit: onEditItem ? onEditItem : () => {},
      onDelete: confirmDelete
    }));
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
  const columns = [{
    field: 'name',
    header: 'Nombre de la Retención',
    sortable: true
  }, {
    field: 'percentage',
    header: 'Porcentaje (%)',
    sortable: true
  }, {
    field: 'account',
    header: 'Cuenta Contable',
    sortable: true
  }, {
    field: 'returnAccount',
    header: 'Cuenta Contable Reversa',
    sortable: true
  }, {
    field: 'description',
    header: 'Descripción',
    body: rowData => /*#__PURE__*/React.createElement("span", {
      title: rowData.description
    }, rowData.description && rowData.description.length > 30 ? `${rowData.description.substring(0, 30)}...` : rowData.description || "N/A")
  }, {
    field: 'actions',
    header: 'Acciones',
    body: rowData => actionBodyTemplate(rowData.actions),
    exportable: false
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "w-100"
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(Dialog, {
    visible: deleteDialogVisible,
    style: {
      width: "450px"
    },
    header: "Confirmar",
    modal: true,
    footer: deleteDialogFooter,
    onHide: () => setDeleteDialogVisible(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex align-items-center justify-content-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-exclamation-triangle mr-3",
    style: {
      fontSize: "2rem",
      color: "#F8BB86"
    }
  }), retentionToDelete && /*#__PURE__*/React.createElement("span", null, "\xBFEst\xE1s seguro que desea eliminar la retenci\xF3n ", /*#__PURE__*/React.createElement("b", null, retentionToDelete.name), "?"))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "400px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body h-100 w-100 d-flex flex-column",
    style: {
      marginTop: "-50px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-end pt-3 mb-2"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-primary",
    onClick: onCreate,
    disabled: createLoading || updateLoading || deleteLoading
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus me-2"
  }), createLoading || updateLoading ? 'Procesando...' : 'Nueva Retención')), /*#__PURE__*/React.createElement(Accordion, null, /*#__PURE__*/React.createElement(AccordionTab, {
    header: "Filtros"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Nombre de la Retenci\xF3n"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.name,
    onChange: e => handleFilterChange("name", e.target.value),
    placeholder: "Buscar por nombre",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Cuenta contable"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.account,
    options: getAccountOptions(),
    onChange: e => handleFilterChange("account", e.value),
    optionLabel: "label",
    placeholder: isLoadingAccounts ? "Cargando cuentas..." : "Seleccione cuenta",
    className: "w-100",
    filter: true,
    filterBy: "label",
    showClear: true,
    disabled: isLoadingAccounts,
    loading: isLoadingAccounts
  }))))), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: tableItems,
    loading: loading,
    onSearch: handleSearchChange,
    onReload: handleRefresh
  }))));
};