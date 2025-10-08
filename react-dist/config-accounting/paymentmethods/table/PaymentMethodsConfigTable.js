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
  onReload
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
  // Inicializar los datos filtrados
  useEffect(() => {
    setFilteredPaymentMethods(paymentMethods);
  }, [paymentMethods]);
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };
  // Aplicar filtros manualmente (igual que en el código que funciona)
  const aplicarFiltros = () => {
    let result = [...paymentMethods];
    // Aplicar filtros específicos
    if (filtros.name) {
      result = result.filter(method => method.name.toLowerCase().includes(filtros.name.toLowerCase()));
    }
    if (filtros.category) {
      result = result.filter(method => method.category === filtros.category);
    }
    setFilteredPaymentMethods(result);
  };
  // Función de búsqueda para CustomPRTable
  const handleSearchChange = searchValue => {
    // Si necesitas búsqueda global, puedes implementarla aquí
    console.log("Search value:", searchValue);
  };
  const limpiarFiltros = () => {
    setFiltros({
      name: "",
      category: null
    });
    setFilteredPaymentMethods(paymentMethods); // Resetear a todos los métodos
  };
  const handleRefresh = () => {
    console.log(":flechas_en_sentido_antihorario: Refresh button clicked");
    // Limpiar filtros locales
    limpiarFiltros();
    // Llamar a onReload para obtener datos frescos
    if (onReload) {
      onReload();
    }
    showToast("info", "Actualizando", "Recargando datos...");
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
  const deleteMethod = () => {
    if (methodToDelete && onDeleteItem) {
      onDeleteItem(methodToDelete.id.toString());
      showToast("success", "Éxito", `Método ${methodToDelete.name} eliminado`);
      // Refrescar automáticamente después de eliminar
      setTimeout(() => {
        if (onReload) {
          onReload();
        }
      }, 1000);
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
  }), methodToDelete && /*#__PURE__*/React.createElement("span", null, "\xBFEst\xE1s seguro que desea eliminar el m\xE9todo de pago, tenga en cuenta que afectar\xE1 a todos los pagos asociados ", /*#__PURE__*/React.createElement("b", null, methodToDelete.name), "?"))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(Accordion, null, /*#__PURE__*/React.createElement(AccordionTab, {
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
  }))), /*#__PURE__*/React.createElement("div", {
    className: "row mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar",
    icon: "fas fa-broom",
    className: "p-button-secondary",
    onClick: limpiarFiltros
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Aplicar Filtros",
    icon: "fas fa-filter",
    className: "p-button-primary",
    onClick: aplicarFiltros,
    loading: loading
  }))))), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: tableItems,
    loading: loading,
    onSearch: handleSearchChange,
    onReload: handleRefresh
  }))));
};