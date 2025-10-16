import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const TicketReasonTable = ({
  ticketReasons,
  onEditItem,
  onDeleteItem,
  loading = false,
  onReload
}) => {
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [reasonToDelete, setReasonToDelete] = useState(null);
  const [filteredReasons, setFilteredReasons] = useState([]);
  const [filtros, setFiltros] = useState({
    label: ""
  });
  const toast = useRef(null);

  // Mapear y filtrar los motivos cuando cambian los datos o los filtros
  useEffect(() => {
    const mappedReasons = ticketReasons.map(reason => ({
      id: reason.id,
      label: reason.label,
      actions: {
        id: reason.id,
        label: reason.label
      }
    }));

    // Aplicar filtros
    let result = [...mappedReasons];
    if (filtros.label) {
      result = result.filter(reason => reason.label.toLowerCase().includes(filtros.label.toLowerCase()));
    }
    setFilteredReasons(result);
  }, [ticketReasons, filtros]);
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
      label: ""
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
  const confirmDelete = reason => {
    setReasonToDelete(reason);
    setDeleteDialogVisible(true);
  };
  const deleteReason = async () => {
    if (reasonToDelete && onDeleteItem) {
      try {
        onDeleteItem(reasonToDelete.id.toString());
        SwalManager.success({
          title: "Motivo Eliminado"
        });

        // Refrescar después de eliminar
        if (onReload) {
          await onReload();
        }
      } catch (error) {
        console.error("Error al eliminar motivo:", error);
        SwalManager.error({
          title: "Error",
          text: "No se pudo eliminar el motivo"
        });
      }
    }
    setDeleteDialogVisible(false);
    setReasonToDelete(null);
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
    onClick: deleteReason
  }));
  const TableMenu = ({
    rowData,
    onEdit,
    onDelete
  }) => {
    const menu = useRef(null);
    const handleEdit = () => {
      console.log("Editando motivo con ID:", rowData.id);
      onEdit(rowData.id.toString());
    };
    const handleDelete = () => {
      console.log("Solicitando eliminar motivo con ID:", rowData.id);
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
      className: "flex align-items-center justify-content-end",
      style: {
        gap: "0.5rem",
        minWidth: "120px"
      }
    }, /*#__PURE__*/React.createElement(TableMenu, {
      rowData: rowData.actions,
      onEdit: onEditItem ? onEditItem : () => {},
      onDelete: confirmDelete
    }));
  };
  const columns = [{
    field: 'label',
    header: 'Label',
    sortable: true
  }, {
    field: 'actions',
    header: 'Acciones',
    body: actionBodyTemplate,
    exportable: false,
    width: "150px"
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
  }), reasonToDelete && /*#__PURE__*/React.createElement("span", null, "\xBFEst\xE1s seguro que deseas eliminar el motivo ", /*#__PURE__*/React.createElement("b", null, "\"", reasonToDelete.label, "\""), "?"))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: filteredReasons,
    loading: loading,
    onSearch: handleSearchChange,
    onReload: handleRefresh
  }))));
};