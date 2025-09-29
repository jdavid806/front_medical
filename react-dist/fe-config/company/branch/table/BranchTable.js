import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { classNames } from "primereact/utils";
export const BranchTable = ({
  branches,
  onEditItem,
  onDeleteItem,
  loading = false
}) => {
  const toast = useRef(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [filtros, setFiltros] = useState({
    name: "",
    city: "",
    country: ""
  });
  const countries = [{
    label: "Argentina",
    value: "Argentina"
  }, {
    label: "Chile",
    value: "Chile"
  }, {
    label: "Uruguay",
    value: "Uruguay"
  }, {
    label: "Paraguay",
    value: "Paraguay"
  }, {
    label: "Bolivia",
    value: "Bolivia"
  }, {
    label: "Brasil",
    value: "Brasil"
  }];
  const cities = [{
    label: "Buenos Aires",
    value: "Buenos Aires"
  }, {
    label: "Córdoba",
    value: "Córdoba"
  }, {
    label: "Rosario",
    value: "Rosario"
  }, {
    label: "Mendoza",
    value: "Mendoza"
  }, {
    label: "Santiago",
    value: "Santiago"
  }, {
    label: "Montevideo",
    value: "Montevideo"
  }];
  useEffect(() => {
    setFilteredBranches(branches);
  }, [branches]);
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const aplicarFiltros = () => {
    let result = [...branches];
    if (filtros.name) {
      result = result.filter(branch => branch.name.toLowerCase().includes(filtros.name.toLowerCase()));
    }
    if (filtros.city) {
      result = result.filter(branch => branch.city.toLowerCase().includes(filtros.city.toLowerCase()));
    }
    if (filtros.country) {
      result = result.filter(branch => branch.country.toLowerCase().includes(filtros.country.toLowerCase()));
    }
    setFilteredBranches(result);
  };
  const limpiarFiltros = () => {
    setFiltros({
      name: "",
      city: "",
      country: ""
    });
    setFilteredBranches(branches);
  };
  const showToast = (severity, summary, detail) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000
    });
  };
  const confirmDelete = branch => {
    setBranchToDelete(branch);
    setDeleteDialogVisible(true);
  };
  const deleteBranch = () => {
    if (branchToDelete && onDeleteItem) {
      onDeleteItem(branchToDelete.id);
      showToast("success", "Éxito", `Sucursal ${branchToDelete.name} eliminada`);
    }
    setDeleteDialogVisible(false);
    setBranchToDelete(null);
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
    onClick: deleteBranch
  }));
  const TableMenu = ({
    rowData,
    onEdit,
    onDelete
  }) => {
    const menu = useRef(null);
    const handleEdit = () => {
      console.log("Editando sucursal con ID:", rowData.id);
      onEdit(rowData.id);
    };
    const handleDelete = () => {
      console.log("Solicitando eliminar sucursal con ID:", rowData.id);
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
      onEdit: onEditItem,
      onDelete: confirmDelete
    }));
  };
  const emailBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("a", {
      href: `mailto:${rowData.email}`,
      className: "text-primary"
    }, rowData.email);
  };
  const phoneBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("a", {
      href: `tel:${rowData.phone}`,
      className: "text-primary"
    }, rowData.phone);
  };
  const addressBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("span", {
      title: rowData.address
    }, rowData.address?.length > 30 ? `${rowData.address.substring(0, 30)}...` : rowData.address);
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
    className: "pi pi-exclamation-triangle mr-3",
    style: {
      fontSize: "2rem",
      color: "#f8bb86"
    }
  }), branchToDelete && /*#__PURE__*/React.createElement("span", null, "\xBFEst\xE1s seguro que desea eliminar la sucursal ", /*#__PURE__*/React.createElement("b", null, branchToDelete.name), "?", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Esta acci\xF3n no se puede deshacer.")))), /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de B\xFAsqueda",
    style: styles.card
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Nombre de la Sucursal"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.name,
    onChange: e => handleFilterChange("name", e.target.value),
    placeholder: "Buscar por nombre",
    className: classNames("w-100")
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Ciudad"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.city,
    options: cities,
    onChange: e => handleFilterChange("city", e.value),
    optionLabel: "label",
    placeholder: "Seleccione ciudad",
    className: classNames("w-100"),
    showClear: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Pa\xEDs"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.country,
    options: countries,
    onChange: e => handleFilterChange("country", e.value),
    optionLabel: "label",
    placeholder: "Seleccione pa\xEDs",
    className: classNames("w-100"),
    showClear: true
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
    title: "Sucursales",
    style: styles.card
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: filteredBranches,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    className: "p-datatable-striped p-datatable-gridlines",
    emptyMessage: "No se encontraron sucursales",
    responsiveLayout: "scroll",
    tableStyle: {
      minWidth: "50rem"
    },
    showGridlines: true
  }, /*#__PURE__*/React.createElement(Column, {
    field: "name",
    header: "Nombre",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "email",
    header: "Email",
    sortable: true,
    body: emailBodyTemplate,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "phone",
    header: "Tel\xE9fono",
    sortable: true,
    body: phoneBodyTemplate,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "address",
    header: "Direcci\xF3n",
    sortable: true,
    body: addressBodyTemplate,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "city",
    header: "Ciudad",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "country",
    header: "Pa\xEDs",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    body: actionBodyTemplate,
    header: "Acciones",
    style: {
      width: "120px",
      textAlign: "center"
    },
    exportable: false
  }))));
};