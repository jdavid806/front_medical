import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { CustomPRTable } from "../components/CustomPRTable.js";
import { comissionConfig } from "../../services/api/index.js";
import { SwalManager } from "../../services/alertManagerImported.js";
export const CommissionTable = ({
  commissions,
  onEditItem,
  onDeleteItem,
  loading = false,
  onReload
}) => {
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [commissionToDelete, setCommissionToDelete] = useState(null);
  const [filteredCommissions, setFilteredCommissions] = useState([]);
  const [filtros, setFiltros] = useState({
    fullName: "",
    attention_type: "",
    application_type: ""
  });
  const toast = useRef(null);

  // Función para sincronizar los datos filtrados
  const syncFilteredData = () => {
    let result = [...commissions];

    // Filtro por nombre del profesional
    if (filtros.fullName) {
      result = result.filter(commission => commission.fullName.toLowerCase().includes(filtros.fullName.toLowerCase()));
    }

    // Filtro por tipo de atención
    if (filtros.attention_type) {
      result = result.filter(commission => commission.attention_type.toLowerCase().includes(filtros.attention_type.toLowerCase()));
    }

    // Filtro por tipo de aplicación
    if (filtros.application_type) {
      result = result.filter(commission => commission.application_type.toLowerCase().includes(filtros.application_type.toLowerCase()));
    }
    setFilteredCommissions(result);
  };

  // Sincroniza cuando cambian las commissions o los filtros
  useEffect(() => {
    syncFilteredData();
  }, [commissions, filtros]);
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
      fullName: "",
      attention_type: "",
      application_type: ""
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
  const confirmDelete = commission => {
    setCommissionToDelete(commission);
    setDeleteDialogVisible(true);
  };
  const deleteCommission = async () => {
    if (commissionToDelete) {
      try {
        const response = await comissionConfig.CommissionConfigDelete(commissionToDelete.id);
        console.log(response);
        SwalManager.success({
          title: "Registro Eliminado"
        });

        // Refrescar después de eliminar
        if (onReload) {
          await onReload();
        }
      } catch (error) {
        console.error("Error al eliminar comisión:", error);
        SwalManager.error({
          title: "Error",
          text: "No se pudo eliminar el registro"
        });
      }
    }
    setDeleteDialogVisible(false);
    setCommissionToDelete(null);
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
    onClick: deleteCommission
  }));
  const TableMenu = ({
    rowData,
    onEdit,
    onDelete
  }) => {
    const menu = useRef(null);
    const handleEdit = () => {
      console.log("Editando comisión con ID:", rowData.id);
      onEdit(rowData.id);
    };
    const handleDelete = () => {
      console.log("Solicitando eliminar comisión con ID:", rowData.id);
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
      rowData: rowData,
      onEdit: onEditItem ? onEditItem : () => {},
      onDelete: confirmDelete
    }));
  };

  // Función para formatear valores de comisión
  const formatCommissionValue = commission => {
    if (commission.commission_type === "Porcentaje") {
      return `${commission.commission_value}%`;
    }
    return `$${commission.commission_value}`;
  };

  // Función para formatear porcentaje
  const formatPercentage = value => {
    return value ? `${value}%` : "N/A";
  };

  // Mapear los datos para la tabla
  const tableItems = filteredCommissions.map(commission => ({
    id: commission.id,
    fullName: commission.fullName,
    attention_type: commission.attention_type,
    application_type: commission.application_type,
    commission_type: commission.commission_type,
    commission_value: formatCommissionValue(commission),
    percentage_base: commission.percentage_base || "N/A",
    percentage_value: formatPercentage(commission.percentage_value),
    actions: commission
  }));
  const columns = [{
    field: 'fullName',
    header: 'Profesional',
    sortable: true
  }, {
    field: 'attention_type',
    header: 'Tipo de atención',
    sortable: true
  }, {
    field: 'application_type',
    header: 'Tipo de aplicación',
    sortable: true
  }, {
    field: 'commission_type',
    header: 'Comisión',
    sortable: true
  }, {
    field: 'commission_value',
    header: 'Valor de la comisión',
    sortable: true
  }, {
    field: 'percentage_base',
    header: 'Porcentaje aplicado',
    sortable: true
  }, {
    field: 'percentage_value',
    header: 'Porcentaje',
    sortable: true
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
  }), commissionToDelete && /*#__PURE__*/React.createElement("span", null, "\xBFEst\xE1s seguro que deseas eliminar la comisi\xF3n de ", /*#__PURE__*/React.createElement("b", null, commissionToDelete.fullName), "?"))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: tableItems,
    loading: loading,
    onSearch: handleSearchChange,
    onReload: handleRefresh
  }))));
};