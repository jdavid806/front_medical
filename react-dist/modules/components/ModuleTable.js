import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { ticketService } from "../../../services/api/index.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const ModuleTable = ({
  modules,
  onEditItem,
  onDeleteItem,
  loading = false,
  onReload
}) => {
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);
  const [reasonMap, setReasonMap] = useState({});
  const [filteredModules, setFilteredModules] = useState([]);
  const [filtros, setFiltros] = useState({
    moduleName: "",
    branchName: "",
    allowedReasons: ""
  });
  const toast = useRef(null);

  // Cargar las razones de tickets
  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const response = await ticketService.getAllTicketReasons();
        const map = {};
        response.reasons.forEach(r => {
          map[r.key] = r.label;
        });
        setReasonMap(map);
      } catch (error) {
        console.error("Error cargando razones:", error);
      }
    };
    fetchReasons();
  }, []);

  // Mapear y filtrar los módulos cuando cambian los datos o los filtros
  useEffect(() => {
    if (Object.keys(reasonMap).length === 0) return;
    const mappedModules = modules.map(module_ => {
      const allowedReasonsText = module_.allowed_reasons.map(reason => reasonMap[reason] || reason).join(', ');
      return {
        id: module_.id,
        moduleName: module_.name,
        branchName: module_.branch.address,
        allowedReasons: allowedReasonsText,
        actions: {
          id: module_.id,
          moduleName: module_.name
        }
      };
    });

    // Aplicar filtros
    let result = [...mappedModules];
    if (filtros.moduleName) {
      result = result.filter(module => module.moduleName.toLowerCase().includes(filtros.moduleName.toLowerCase()));
    }
    if (filtros.branchName) {
      result = result.filter(module => module.branchName.toLowerCase().includes(filtros.branchName.toLowerCase()));
    }
    if (filtros.allowedReasons) {
      result = result.filter(module => module.allowedReasons.toLowerCase().includes(filtros.allowedReasons.toLowerCase()));
    }
    setFilteredModules(result);
  }, [modules, reasonMap, filtros]);
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
      moduleName: "",
      branchName: "",
      allowedReasons: ""
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
  const confirmDelete = module => {
    setModuleToDelete(module);
    setDeleteDialogVisible(true);
  };
  const deleteModule = async () => {
    if (moduleToDelete && onDeleteItem) {
      try {
        onDeleteItem(moduleToDelete.id);
        SwalManager.success({
          title: "Módulo Eliminado"
        });

        // Refrescar después de eliminar
        if (onReload) {
          await onReload();
        }
      } catch (error) {
        console.error("Error al eliminar módulo:", error);
        SwalManager.error({
          title: "Error",
          text: "No se pudo eliminar el módulo"
        });
      }
    }
    setDeleteDialogVisible(false);
    setModuleToDelete(null);
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
    onClick: deleteModule
  }));
  const TableMenu = ({
    rowData,
    onEdit,
    onDelete
  }) => {
    const menu = useRef(null);
    const handleEdit = () => {
      console.log("Editando módulo con ID:", rowData.id);
      onEdit(rowData.id);
    };
    const handleDelete = () => {
      console.log("Solicitando eliminar módulo con ID:", rowData.id);
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
      className: "flex align-items-center justify-content-center",
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
    field: 'moduleName',
    header: 'Nombre',
    sortable: true
  }, {
    field: 'branchName',
    header: 'Sucursal',
    sortable: true
  }, {
    field: 'allowedReasons',
    header: 'Motivos de visita a atender',
    sortable: true
  }, {
    field: 'actions',
    header: 'Acciones',
    body: actionBodyTemplate,
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
  }), moduleToDelete && /*#__PURE__*/React.createElement("span", null, "\xBFEst\xE1s seguro que deseas eliminar el m\xF3dulo ", /*#__PURE__*/React.createElement("b", null, moduleToDelete.moduleName), "?"))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: filteredModules,
    loading: loading,
    onSearch: handleSearchChange,
    onReload: handleRefresh
  }))));
};