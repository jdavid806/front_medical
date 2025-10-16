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
export const TaxesConfigTable = ({
  taxes = [],
  onEditItem,
  onDeleteItem,
  loading = false,
  onReload
}) => {
  const toast = useRef(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [taxToDelete, setTaxToDelete] = useState(null);
  const [filteredTaxes, setFilteredTaxes] = useState([]);
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
    let result = [...taxes];

    // Aplicar filtros actuales
    if (filtros.name) {
      result = result.filter(tax => tax.name.toLowerCase().includes(filtros.name.toLowerCase()));
    }
    if (filtros.account) {
      result = result.filter(tax => tax.account?.id === filtros.account || tax.returnAccount?.id === filtros.account);
    }
    setFilteredTaxes(result);
  };

  // Sincroniza cuando cambian los taxes o los filtros
  useEffect(() => {
    syncFilteredData();
  }, [taxes, filtros]);
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
  const confirmDelete = tax => {
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
      console.log("Editando impuesto con ID:", rowData.id.toString());
      onEdit(rowData.id.toString());
    };
    const handleDelete = () => {
      console.log("Solicitando eliminar impuesto con ID:", rowData.id.toString());
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
  const tableItems = filteredTaxes.map(tax => ({
    id: tax.id,
    name: tax.name,
    percentage: `${tax.percentage}%`,
    account: renderAccount(tax.account),
    returnAccount: renderAccount(tax.returnAccount),
    description: tax.description,
    actions: tax
  }));
  const columns = [{
    field: 'name',
    header: 'Nombre del Impuesto',
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
  }), taxToDelete && /*#__PURE__*/React.createElement("span", null, "\xBFEst\xE1s seguro que desea eliminar el impuesto ", /*#__PURE__*/React.createElement("b", null, taxToDelete.name), "?"))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(Accordion, null, /*#__PURE__*/React.createElement(AccordionTab, {
    header: "Filtros"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Nombre del Impuesto"), /*#__PURE__*/React.createElement(InputText, {
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