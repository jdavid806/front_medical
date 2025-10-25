import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { CustomPRTable } from "../../components/CustomPRTable.js";
export const UserRoleTable = ({
  userRoles,
  onEditItem,
  onDeleteItem,
  onReload,
  onCreateRole,
  loading = false
}) => {
  const [tableUserRoles, setTableUserRoles] = useState([]);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [filteredUserRoles, setFilteredUserRoles] = useState([]);
  const [filtros, setFiltros] = useState({
    name: ""
  });
  const toast = useRef(null);
  useEffect(() => {
    const mappedUserRoles = userRoles.map(userRole => {
      return {
        id: userRole.id,
        name: userRole.name
      };
    });
    setTableUserRoles(mappedUserRoles);
  }, [userRoles]);
  const syncFilteredData = () => {
    let result = [...tableUserRoles];
    if (filtros.name) {
      result = result.filter(role => role.name.toLowerCase().includes(filtros.name.toLowerCase()));
    }
    setFilteredUserRoles(result);
  };
  useEffect(() => {
    syncFilteredData();
  }, [tableUserRoles, filtros]);
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
      name: ""
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
  const confirmDelete = role => {
    setRoleToDelete(role);
    setDeleteDialogVisible(true);
  };
  const deleteRole = async () => {
    if (roleToDelete && onDeleteItem) {
      await onDeleteItem(roleToDelete.id);
      showToast("success", "Éxito", `Rol ${roleToDelete.name} eliminado`);
      if (onReload) {
        await onReload();
      }
    }
    setDeleteDialogVisible(false);
    setRoleToDelete(null);
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
    onClick: deleteRole
  }));
  const TableMenu = ({
    rowData,
    onEdit,
    onDelete
  }) => {
    const menu = useRef(null);
    const handleEdit = () => {
      console.log("Editando rol con ID:", rowData.id);
      onEdit(rowData.id);
    };
    const handleDelete = () => {
      console.log("Solicitando eliminar rol con ID:", rowData.id);
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
      className: "fas fa-cog ml-2"
    })), /*#__PURE__*/React.createElement(Menu, {
      model: [{
        label: "Editar",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fas fa-edit me-2"
        }),
        command: handleEdit
      }, {
        label: "Eliminar",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fas fa-trash me-2"
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
      onEdit: onEditItem,
      onDelete: confirmDelete
    }));
  };
  const tableItems = filteredUserRoles.map(role => ({
    id: role.id,
    name: role.name,
    actions: role
  }));
  const columns = [{
    field: 'name',
    header: 'Nombre del Rol',
    sortable: true
  }, {
    field: 'actions',
    header: 'Acciones',
    body: rowData => actionBodyTemplate(rowData.actions),
    exportable: false,
    width: "20px"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "w-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "400px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body h-100 w-100 d-flex flex-column"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end mb-3"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-primary d-flex align-items-center",
    onClick: onCreateRole,
    disabled: loading
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus me-2"
  }), loading ? 'Cargando...' : 'Nuevo Rol')), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: tableItems,
    loading: loading,
    onSearch: handleSearchChange,
    onReload: handleRefresh
  }))), /*#__PURE__*/React.createElement(Toast, {
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
  }), roleToDelete && /*#__PURE__*/React.createElement("span", null, "\xBFEst\xE1s seguro que deseas eliminar el rol ", /*#__PURE__*/React.createElement("b", null, roleToDelete.name), "?"))));
};