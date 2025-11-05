import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { CustomPRTable } from "../../../components/CustomPRTable.js";
export const PaymentMethodsConfigTable = ({
  onEditItem,
  paymentMethods = [],
  loading = false,
  onDeleteItem,
  onReload,
  onCreate,
  createLoading = false,
  updateLoading = false,
  deleteLoading = false
}) => {
  const toast = useRef(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState(null);
  const [filteredPaymentMethods, setFilteredPaymentMethods] = useState([]);
  const [filtros, setFiltros] = useState({
    name: "",
    category: null
  });
  const categories = [{
    label: "Transaccional",
    value: "transactional"
  }, {
    label: "Vencimiento Proveedores",
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
  const syncFilteredData = () => {
    let result = [...paymentMethods];
    if (filtros.name) {
      result = result.filter(method => method.name.toLowerCase().includes(filtros.name.toLowerCase()));
    }
    if (filtros.category) {
      result = result.filter(method => method.category === filtros.category);
    }
    setFilteredPaymentMethods(result);
  };
  useEffect(() => {
    syncFilteredData();
  }, [paymentMethods, filtros]);
  const getCategoryLabel = categoryValue => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
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
      category: null
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
  const confirmDelete = method => {
    setMethodToDelete(method);
    setDeleteDialogVisible(true);
  };
  const deleteMethod = async () => {
    if (methodToDelete && onDeleteItem) {
      await onDeleteItem(methodToDelete.id.toString());
      showToast("success", "Éxito", `Método ${methodToDelete.name} eliminado`);
      if (onReload) {
        await onReload();
      }
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
  const TableMenu = ({
    rowData,
    onEdit,
    onDelete
  }) => {
    const menu = useRef(null);
    const handleEdit = () => {
      onEdit(rowData.id.toString());
    };
    const handleDelete = () => {
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
      onEdit: onEditItem ? onEditItem : () => {},
      onDelete: confirmDelete
    }));
  };

  // Mapear los datos para la tabla
  const tableItems = filteredPaymentMethods.map(method => ({
    id: method.id,
    name: method.name,
    category: getCategoryLabel(method.category),
    account: method.account?.name || "No asignada",
    additionalDetails: method.additionalDetails,
    actions: method
  }));
  const columns = [{
    field: 'name',
    header: 'Nombre del Método',
    sortable: true
  }, {
    field: 'category',
    header: 'Categoría',
    sortable: true
  }, {
    field: 'account',
    header: 'Cuenta Contable',
    sortable: true
  }, {
    field: 'additionalDetails',
    header: 'Detalles Adicionales',
    body: rowData => /*#__PURE__*/React.createElement("span", {
      title: rowData.additionalDetails
    }, rowData.additionalDetails?.length > 30 ? `${rowData.additionalDetails.substring(0, 30)}...` : rowData.additionalDetails)
  }, {
    field: 'actions',
    header: 'Acciones',
    body: rowData => actionBodyTemplate(rowData.actions),
    exportable: false,
    width: "120px"
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
  }), methodToDelete && /*#__PURE__*/React.createElement("span", null, "\xBFEst\xE1s seguro que desea eliminar el m\xE9todo de pago, tenga en cuenta que afectar\xE1 a todos los pagos asociados ", /*#__PURE__*/React.createElement("b", null, methodToDelete.name), "?"))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "400px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body h-100 w-100 d-flex flex-column",
    style: {
      marginTop: "-50px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-end pt-3 mb-2"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-primary",
    onClick: onCreate,
    disabled: createLoading || updateLoading || deleteLoading
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus me-2"
  }), createLoading || updateLoading ? 'Procesando...' : 'Nuevo Método')), /*#__PURE__*/React.createElement(Accordion, null, /*#__PURE__*/React.createElement(AccordionTab, {
    header: "Filtros"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Nombre del M\xE9todo"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.name,
    onChange: e => handleFilterChange("name", e.target.value),
    placeholder: "Buscar por nombre",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Categor\xEDa"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.category,
    options: categories,
    onChange: e => handleFilterChange("category", e.value),
    optionLabel: "label",
    placeholder: "Seleccione categor\xEDa",
    className: "w-100",
    showClear: true
  }))))), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: tableItems,
    loading: loading,
    onSearch: handleSearchChange,
    onReload: handleRefresh
  }))));
};