import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { useAccountingAccounts } from "../../../accounting/hooks/useAccountingAccounts.js";
export const RetentionConfigTable = ({
  retentions,
  onEditItem,
  onDeleteItem,
  loading = false
}) => {
  const toast = useRef(null);
  const [filteredRetentions, setFilteredRetentions] = useState([]);
  const [filtros, setFiltros] = useState({
    name: "",
    percentage: null,
    account: null
  });
  const {
    accounts: accountingAccounts,
    isLoading: isLoadingAccounts
  } = useAccountingAccounts();
  const renderAccount = account => {
    if (!account) return "No asignada";
    if (account.name && !account.name.startsWith("Cuenta ")) {
      return account.name;
    }
    const fullAccount = accountingAccounts?.find(acc => {
      if (acc.id.toString() === account.id) return true;
      if (acc.account_code && acc.account_code.toString() === account.id) return true;
      return false;
    });
    if (fullAccount) {
      return fullAccount.account_name || `Cuenta ${account.id}`;
    }
    return account.name || `Cuenta ${account.id}`;
  };
  useEffect(() => {
    setFilteredRetentions(retentions);
  }, [retentions]);
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const aplicarFiltros = () => {
    let result = [...retentions];
    if (filtros.name) {
      result = result.filter(ret => ret.name.toLowerCase().includes(filtros.name.toLowerCase()));
    }
    if (filtros.account) {
      result = result.filter(ret => ret.account?.id === filtros.account);
    }
    setFilteredRetentions(result);
  };
  const limpiarFiltros = () => {
    setFiltros({
      name: "",
      account: null,
      percentage: null
    });
    setFilteredRetentions(retentions);
  };
  const showToast = (severity, summary, detail) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000
    });
  };
  const actionBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center justify-content-center",
      style: {
        gap: "0.5rem",
        minWidth: "120px"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      className: "p-button-rounded p-button-text p-button-sm",
      onClick: () => editRetention(rowData)
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-pencil-alt"
    })), /*#__PURE__*/React.createElement(Button, {
      className: "p-button-rounded p-button-text p-button-sm p-button-danger",
      onClick: () => confirmDelete(rowData)
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-trash"
    })));
  };
  const editRetention = retention => {
    showToast("info", "Editar", `Editando retención: ${retention.name}`);
    onEditItem(retention.id.toString());
  };
  const confirmDelete = retention => {
    showToast("warn", "Eliminar", `¿Seguro que desea eliminar ${retention.name}?`);
    if (onDeleteItem) {
      onDeleteItem(retention.id.toString());
    }
  };
  const getAccountOptions = () => {
    if (!accountingAccounts) return [];
    return accountingAccounts.map(account => ({
      label: account.account_name || `Cuenta ${account.account_code}`,
      value: account.id.toString()
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
  }, "Nombre de Retenci\xF3n"), /*#__PURE__*/React.createElement(InputText, {
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
    title: "Configuraci\xF3n de Retenciones",
    style: styles.card
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: filteredRetentions,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    className: "p-datatable-striped p-datatable-gridlines",
    emptyMessage: "No se encontraron retenciones",
    responsiveLayout: "scroll",
    tableStyle: {
      minWidth: "50rem"
    }
  }, /*#__PURE__*/React.createElement(Column, {
    field: "name",
    header: "Nombre de Retenci\xF3n",
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