import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Menu } from "primereact/menu";
import { classNames } from "primereact/utils";
import { useAccountingAccounts } from "../../../accounting/hooks/useAccountingAccounts.js";
export const TaxesConfigTable = ({
  taxes = [],
  onEditItem,
  onDeleteItem,
  loading = false
}) => {
  const toast = useRef(null);
  const [filteredTaxes, setFilteredTaxes] = useState([]);
  const [filtros, setFiltros] = useState({
    name: "",
    account: null,
    percentage: null
  });
  const {
    accounts: accountingAccounts,
    isLoading: isLoadingAccounts
  } = useAccountingAccounts();
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
    console.log('fullAccount', fullAccount);
    return fullAccount?.account_name || account.name || `Cuenta ${account.id}`;
  };
  useEffect(() => {
    setFilteredTaxes(taxes);
  }, [taxes]);
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const aplicarFiltros = () => {
    let result = [...taxes];
    if (filtros.name) {
      result = result.filter(tax => tax.name.toLowerCase().includes(filtros.name.toLowerCase()));
    }
    if (filtros.account) {
      result = result.filter(tax => tax.account?.id === filtros.account || tax.returnAccount?.id === filtros.account);
    }
    setFilteredTaxes(result);
  };
  const limpiarFiltros = () => {
    setFiltros({
      name: "",
      account: null,
      percentage: null
    });
    setFilteredTaxes(taxes);
  };
  const showToast = (severity, summary, detail) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000
    });
  };
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
      className: "btn-primary flex items-center gap-2",
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
      onDelete: tax => {
        if (onDeleteItem) {
          onDeleteItem(tax.id.toString());
        }
      }
    }));
  };
  const styles = {
    card: {
      marginBottom: "20px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px"
    },
    cardTitle: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#333"
    },
    tableHeader: {
      backgroundColor: "#f8f9fa",
      color: "#495057",
      fontWeight: 600
    },
    tableCell: {
      padding: "0.75rem 1rem"
    },
    formLabel: {
      fontWeight: 500,
      marginBottom: "0.5rem",
      display: "block"
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4",
    style: {
      width: "100%",
      padding: "0 15px"
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de B\xFAsqueda",
    style: styles.card
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Nombre del Impuesto"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.name,
    onChange: e => handleFilterChange("name", e.target.value),
    placeholder: "Buscar por nombre",
    className: classNames("w-100")
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Cuenta contable"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.account,
    options: getAccountOptions(),
    onChange: e => handleFilterChange("account", e.value),
    optionLabel: "label",
    placeholder: isLoadingAccounts ? "Cargando cuentas..." : "Seleccione cuenta",
    className: classNames("w-100"),
    filter: true,
    filterBy: "label",
    showClear: true,
    disabled: isLoadingAccounts,
    loading: isLoadingAccounts
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar",
    icon: "pi pi-trash",
    className: "btn btn-phoenix-secondary",
    onClick: limpiarFiltros
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Aplicar Filtros",
    icon: "pi pi-filter",
    className: "btn btn-primary",
    onClick: aplicarFiltros,
    loading: loading
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "Configuraci\xF3n de Impuestos",
    style: styles.card
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: filteredTaxes,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    className: "p-datatable-striped p-datatable-gridlines",
    emptyMessage: "No se encontraron impuestos",
    responsiveLayout: "scroll",
    tableStyle: {
      minWidth: "50rem"
    }
  }, /*#__PURE__*/React.createElement(Column, {
    field: "name",
    header: "Nombre del Impuesto",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "percentage",
    header: "Porcentaje (%)",
    sortable: true,
    body: rowData => `${rowData.percentage}%`,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "account",
    header: "Cuenta Contable",
    sortable: true,
    body: rowData => renderAccount(rowData.account),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "returnAccount",
    header: "Cuenta Contable Reversa",
    sortable: true,
    body: rowData => renderAccount(rowData.returnAccount),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "description",
    header: "Descripci\xF3n",
    style: styles.tableCell,
    body: rowData => /*#__PURE__*/React.createElement("span", {
      title: rowData.description || ""
    }, rowData.description && rowData.description.length > 30 ? `${rowData.description.substring(0, 30)}...` : rowData.description || "N/A")
  }), /*#__PURE__*/React.createElement(Column, {
    body: actionBodyTemplate,
    header: "Acciones",
    style: {
      width: "120px"
    },
    exportable: false
  }))));
};