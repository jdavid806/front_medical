import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Menu } from "primereact/menu";
import { classNames } from "primereact/utils";
export const CostCenterConfigTable = ({
  costCenters = [],
  onEditItem,
  onDeleteItem,
  loading = false
}) => {
  const toast = useRef(null);
  const [filteredCostCenters, setFilteredCostCenters] = useState([]);
  const [filtros, setFiltros] = useState({
    code: "",
    name: ""
  });
  useEffect(() => {
    setFilteredCostCenters(costCenters);
  }, [costCenters]);
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const aplicarFiltros = () => {
    let result = [...costCenters];
    if (filtros.code) {
      result = result.filter(cc => cc.code.toLowerCase().includes(filtros.code.toLowerCase()));
    }
    if (filtros.name) {
      result = result.filter(cc => cc.name.toLowerCase().includes(filtros.name.toLowerCase()));
    }
    setFilteredCostCenters(result);
  };
  const limpiarFiltros = () => {
    setFiltros({
      code: "",
      name: ""
    });
    setFilteredCostCenters(costCenters);
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
      console.log("Editando centro de costo con ID:", rowData.id.toString());
      onEdit(rowData.id.toString());
    };
    const handleDelete = () => {
      console.log("Solicitando eliminar centro de costo con ID:", rowData.id.toString());
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
      onDelete: costCenter => {
        if (onDeleteItem) {
          onDeleteItem(costCenter.id.toString());
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
  }, "C\xF3digo"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.code,
    onChange: e => handleFilterChange("code", e.target.value),
    placeholder: "Buscar por c\xF3digo",
    className: classNames("w-100")
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Nombre"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.name,
    onChange: e => handleFilterChange("name", e.target.value),
    placeholder: "Buscar por nombre",
    className: classNames("w-100")
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
    title: "Configuraci\xF3n de Centros de Costo",
    style: styles.card
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: filteredCostCenters,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    className: "p-datatable-striped p-datatable-gridlines",
    emptyMessage: "No se encontraron centros de costo",
    responsiveLayout: "scroll",
    tableStyle: {
      minWidth: "50rem"
    }
  }, /*#__PURE__*/React.createElement(Column, {
    field: "code",
    header: "C\xF3digo",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "name",
    header: "Nombre",
    sortable: true,
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