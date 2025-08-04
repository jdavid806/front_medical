import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
export const PaymentMethodsConfigTable = ({
  onEditItem,
  paymentMethods = [],
  loading = false,
  onDeleteItem
}) => {
  const toast = useRef(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState(null);
  const [filteredMethods, setFilteredMethods] = useState([]);
  const [filtros, setFiltros] = useState({
    name: "",
    category: null
  });
  const categories = [{
    label: "Transaccional",
    value: "transactional"
  }, {
    label: "Vencimiento Proveedores",
    value: "card"
  }, {
    label: "Transferencia",
    value: "supplier_expiration"
  }, {
    label: "Vencimiento Clientes",
    value: "customer_expiration"
  }, {
    label: "Anticipo Clientes",
    value: "customer_advance"
  }, {
    label: "Anticipo Proveedores",
    value: "supplier_advance"
  }];
  const getCategoryLabel = categoryValue => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };
  useEffect(() => {
    setFilteredMethods(paymentMethods);
  }, [paymentMethods]);
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const aplicarFiltros = () => {
    let result = [...paymentMethods];
    if (filtros.name) {
      result = result.filter(method => method.name.toLowerCase().includes(filtros.name.toLowerCase()));
    }
    if (filtros.category) {
      result = result.filter(method => method.category === filtros.category);
    }
    setFilteredMethods(result);
  };
  const limpiarFiltros = () => {
    setFiltros({
      name: "",
      category: null
    });
    setFilteredMethods(paymentMethods);
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
      onClick: () => editMethod(rowData)
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-pencil-alt"
    })), /*#__PURE__*/React.createElement(Button, {
      className: "p-button-rounded p-button-text p-button-sm p-button-danger",
      onClick: () => confirmDelete(rowData)
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-trash"
    })));
  };
  const editMethod = method => {
    if (onEditItem) {
      onEditItem(method.id.toString());
    }
    showToast("info", "Editar", `Editando método: ${method.name}`);
  };
  const confirmDelete = method => {
    setMethodToDelete(method);
    setDeleteDialogVisible(true);
  };
  const deleteMethod = () => {
    if (methodToDelete && onDeleteItem) {
      onDeleteItem(methodToDelete.id.toString());
      showToast("success", "Éxito", `Método ${methodToDelete.name} eliminado`);
    }
    setDeleteDialogVisible(false);
    setMethodToDelete(null);
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
  }), methodToDelete && /*#__PURE__*/React.createElement("span", null, "\xBFEst\xE1s seguro que desea  eliminar el m\xE9todo de pago, tenga en cuenta que afectar\xE1 a todos los pagos asociados ", /*#__PURE__*/React.createElement("b", null, methodToDelete.name), "?"))), /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de B\xFAsqueda",
    style: styles.card
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Nombre del M\xE9todo"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.name,
    onChange: e => handleFilterChange("name", e.target.value),
    placeholder: "Buscar por nombre",
    className: classNames("w-100")
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Categor\xEDa"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.category,
    options: categories,
    onChange: e => handleFilterChange("category", e.value),
    optionLabel: "label",
    placeholder: "Seleccione categor\xEDa",
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
    title: "M\xE9todos de Pago",
    style: styles.card
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: filteredMethods,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    className: "p-datatable-striped p-datatable-gridlines",
    emptyMessage: "No se encontraron m\xE9todos de pago",
    responsiveLayout: "scroll",
    tableStyle: {
      minWidth: "50rem"
    }
  }, /*#__PURE__*/React.createElement(Column, {
    field: "name",
    header: "Nombre del M\xE9todo",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "category",
    header: "Categor\xEDa",
    sortable: true,
    body: rowData => getCategoryLabel(rowData.category),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "account",
    header: "Cuenta Contable",
    sortable: true,
    body: rowData => rowData.account?.name || "No asignada",
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "additionalDetails",
    header: "Detalles Adicionales",
    style: styles.tableCell,
    body: rowData => /*#__PURE__*/React.createElement("span", {
      title: rowData.additionalDetails
    }, rowData.additionalDetails?.length > 30 ? `${rowData.additionalDetails.substring(0, 30)}...` : rowData.additionalDetails)
  }), /*#__PURE__*/React.createElement(Column, {
    body: actionBodyTemplate,
    header: "Acciones",
    style: {
      width: "120px"
    },
    exportable: false
  }))));
};