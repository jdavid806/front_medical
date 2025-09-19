import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { useThirdParties } from "../billing/third-parties/hooks/useThirdParties.js";
import { usePurchaseOrders } from "./hooks/usePurchaseOrders.js";
import { CustomPRTable } from "../components/CustomPRTable.js";
import { formatDate } from "../../services/utilidades.js";
import TableActionsWrapper from "../components/table-actions/TableActionsWrapper.js";
import { PurchaseBilling } from "../billing/purchase_billing/PurchaseBilling.js";
import { SalesBilling } from "../billing/sales_billing/SalesBilling.js";
import { FormPurchaseOrders } from "./form/FormPurchaseOrdersV2.js";
import { Dialog } from "primereact/dialog";
import { NewReceiptBoxModal } from "../accounting/paymentReceipt/modals/NewReceiptBoxModal.js";
import { Toast } from "primereact/toast";
import { generarFormatoContable } from "../../funciones/funcionesJS/generarPDFContable.js";
import { PurchaseOrderPayments } from "./PurchaseOrderPayments.js";
const purchaseOrderStates = {
  pending: "Pendiente",
  approved: "Aprobada",
  completed: "Completada",
  cancelled: "Anulada"
};
const purchaseOrderStateColors = {
  pending: "warning",
  approved: "info",
  completed: "success",
  cancelled: "danger"
};
const purchaseOrderTypes = {
  purchase: "Orden de compra",
  quote_of: "Cotizacion"
};
export const PurchaseOrders = ({
  initialFilters,
  filterConfigs,
  componentConfigs
} = {
  initialFilters: undefined,
  filterConfigs: undefined,
  componentConfigs: {
    newPurchaseOrderBtn: {
      label: "Nueva Orden de Compra",
      redirect: "OrdenesCompra"
    }
  }
}) => {
  // Estado para los filtros
  const [filtros, setFiltros] = useState({
    orderNumber: "",
    type: "",
    thirdId: "",
    createdAt: null,
    status: ""
  });
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);
  const types = [{
    label: "Orden de compra",
    value: "purchase"
  }, {
    label: "Cotizacion",
    value: "quote_of"
  }];
  const states = [{
    label: "Pendiente",
    value: "pending"
  }, {
    label: "Completada",
    value: "completed"
  }, {
    label: "Rechazada",
    value: "cancelled"
  }];
  const getCustomFilters = () => {
    const filters = {};
    if (filtros.thirdId) filters.thirdId = filtros.thirdId;
    if (filtros.orderNumber) filters.order_number = filtros.orderNumber;
    if (filtros.status) filters.status = filtros.status;
    if (filtros.type) filters.type = filtros.type;
    if (filtros.createdAt && filtros.createdAt.length > 0) {
      const validDates = filtros.createdAt.filter(date => !!date);
      if (validDates.length > 0) {
        filters.start_date = validDates[0].toISOString().split('T')[0];
        if (validDates.length > 1) {
          filters.end_date = validDates[1].toISOString().split('T')[0];
        }
      }
    }
    return filters;
  };
  const {
    purchaseOrders,
    handlePageChange,
    handleSortChange,
    handleSearchChange,
    refresh,
    totalRecords,
    first,
    loadingPurchaseOrders,
    perPage,
    sortField,
    sortOrder
  } = usePurchaseOrders(getCustomFilters);
  const {
    thirdParties
  } = useThirdParties();
  const [tableItems, setTableItems] = useState([]);
  const [showGenerateInvoiceModal, setShowGenerateInvoiceModal] = useState(false);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isModalToPayment, setIsModalToPayment] = useState(false);
  const toast = useRef(null);

  // Manejadores de cambio de filtros
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /*useEffect(() => {
    console.log("filtros", filtros);
    refresh();
  }, [filtros]);*/

  useEffect(() => {
    if (initialFilters) {
      setFiltros(initialFilters);
      refresh();
    }
  }, [initialFilters]);
  const handleGenerateInvoice = rowData => {
    const orderDetails = purchaseOrders.find(order => order.id === rowData.orderNumber);
    if (orderDetails) {
      setSelectedPurchaseOrder({
        ...orderDetails,
        orderNumber: orderDetails.id,
        createdAt: formatDate(orderDetails.created_at),
        dueDate: formatDate(orderDetails.due_date),
        total: orderDetails.total_amount,
        thirdPartyName: orderDetails.third_party?.name || "",
        cliente: orderDetails.third_id,
        centre_cost: orderDetails.centre_cost || null
      });
      setShowGenerateInvoiceModal(true);
      setIsModalEdit(false);
      setIsModalToPayment(false);
    }
  };
  useEffect(() => {
    console.log("purchaseOrders", purchaseOrders);
    const mappedItems = purchaseOrders.map(item => {
      return {
        orderNumber: item.id,
        type: item.type,
        thirdPartyName: item.third_party.name,
        createdAt: formatDate(item.created_at),
        dueDate: formatDate(item.due_date),
        total: formatCurrency(item.total_amount),
        status: item.status,
        cliente: item.third_id,
        centre_cost: item.centre_cost || null,
        discount: item.total_discount || 0,
        iva: formatCurrency(item.total_taxes) || 0,
        total_amount: formatCurrency(item.total_amount) || 0,
        due_date: item.due_date,
        quantity_total: item.total_products || 0,
        third_party_id: item.third_id || 0,
        user_id: Number(item.buyer_id) || 0,
        thirdParty: item.third_party || null,
        details: item.details || []
      };
    });
    setTableItems(mappedItems);
  }, [purchaseOrders]);
  function handleToEdit(orderData) {
    setSelectedPurchaseOrder(orderData);
    setIsModalEdit(true);
    setShowGenerateInvoiceModal(false);
    setIsModalToPayment(false);
  }

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      orderNumber: "",
      type: "",
      thirdId: "",
      createdAt: null,
      status: null
    });
  };

  // Formatear número para montos en pesos dominicanos (DOP)
  const formatCurrency = value => {
    return value.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  function handleToPayment(data) {
    console.log("handleToPayment", data);
    setSelectedPurchaseOrder(data);
    setIsModalToPayment(true);
    setShowGenerateInvoiceModal(false); // Cerrar otros modales
    setIsModalEdit(false);
  }
  function handleInvoiceSuccess(type) {
    setShowGenerateInvoiceModal(false);
    refresh();
    toast.current?.show({
      severity: "success",
      summary: "Éxito",
      detail: "Factura de " + type + " generada correctamente",
      life: 3000
    });
  }
  function handleSaveToPayment() {}
  function handleSaveAndDownloadToPayment() {}
  const handleDownloadPDF = rowData => {
    // console.log('Datos orden:', rowData);
    generarFormatoContable("OrdenCompra", rowData, "Impresion");
  };
  function handleToAfterEdit() {
    setIsModalEdit(false);
    refresh();
    toast.current?.show({
      severity: "success",
      summary: "Éxito",
      detail: "Orden de compra editada correctamente",
      life: 3000
    });
  }
  function handleViewPaymentHistory(data) {
    setSelectedPurchaseOrder(data);
    setShowPaymentHistoryModal(true);
  }

  // Estilos integrados
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
  const columns = [{
    field: "orderNumber",
    header: "No. Orden"
  }, {
    field: "type",
    header: "Tipo",
    body: rowData => purchaseOrderTypes[rowData.type]
  }, {
    field: "thirdPartyName",
    header: "Proveedor"
  }, {
    field: "createdAt",
    header: "Fecha de elaboración",
    sortable: true
  }, {
    field: "dueDate",
    header: "Fecha de vencimiento",
    sortable: true
  }, {
    field: "total",
    header: "Valor Total",
    body: rowData => formatCurrency(rowData.total)
  }, {
    field: "status",
    header: "Estado",
    body: rowData => /*#__PURE__*/React.createElement(Tag, {
      value: purchaseOrderStates[rowData.status],
      severity: purchaseOrderStateColors[rowData.status]
    })
  }, {
    field: "",
    header: "Acciones",
    body: rowData => /*#__PURE__*/React.createElement(TableActionsWrapper, null, /*#__PURE__*/React.createElement(React.Fragment, null, rowData.status !== "approved" && /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      onClick: e => {
        e.stopPropagation();
        handleToEdit(rowData);
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-pencil",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Editar"))), rowData.status !== "approved" && /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      onClick: e => {
        e.stopPropagation();
        handleGenerateInvoice(rowData);
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid far fa-file",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Generar factura"))), rowData.status !== "approved" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      onClick: e => {
        e.stopPropagation();
        handleToPayment(rowData);
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-money-bills",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Realizar abono"))), /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      onClick: e => {
        e.stopPropagation();
        // Implementa aquí la lógica para mostrar el historial de abonos
        // Por ejemplo: handleViewPaymentHistory(rowData);
        console.log("Mostrar historial de abonos");
        handleViewPaymentHistory(rowData);
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-history",
      style: {
        width: "20px",
        color: "#3498db"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Historial de Abonos")))), /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      onClick: e => {
        e.stopPropagation();
        handleDownloadPDF(rowData);
        // Implementa aquí la lógica para descargar en PDF
        // Por ejemplo: handleDownloadPDF(rowData);
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-file-pdf",
      style: {
        width: "20px",
        color: "#e74c3c"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Descargar PDF"))), /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      onClick: e => {
        e.stopPropagation();
        // Implementa aquí la lógica para descargar en Excel
        // Por ejemplo: handleDownloadExcel(rowData);
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-file-excel",
      style: {
        width: "20px",
        color: "#27ae60"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Descargar Excel")))))
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dialog, {
    header: "Historial de Abonos",
    visible: showPaymentHistoryModal,
    onHide: () => setShowPaymentHistoryModal(false),
    maximizable: true,
    modal: true,
    style: {
      width: '90vw',
      height: '80vh',
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement(PurchaseOrderPayments, {
    purchaseOrderId: selectedPurchaseOrder?.orderNumber?.toString() || "0"
  })), /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4",
    style: {
      width: "100%",
      padding: "0 15px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      margin: "10px"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    label: componentConfigs?.newPurchaseOrderBtn?.label || "Nueva Orden de Compra",
    icon: "pi pi-file-edit",
    className: "btn btn-primary",
    onClick: () => window.location.href = componentConfigs?.newPurchaseOrderBtn?.redirect || "OrdenesCompra"
  })), /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de B\xFAsqueda",
    style: styles.card
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "No. Orden"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.orderNumber,
    onChange: e => handleFilterChange("orderNumber", e.target.value),
    placeholder: "OC-001-0000001",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Tipo"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.type,
    options: types,
    onChange: e => handleFilterChange("type", e.value),
    optionLabel: "label",
    placeholder: "Seleccionar tipo",
    className: "w-100",
    disabled: filterConfigs?.type?.disabled || false
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Proveedor"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.thirdId,
    options: thirdParties,
    onChange: e => handleFilterChange("thirdId", e.value),
    optionLabel: "name",
    optionValue: "id",
    placeholder: "Seleccionar proveedor",
    className: "w-100",
    disabled: filterConfigs?.thirdId?.disabled || false,
    filter: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Fecha de elaboraci\xF3n"), /*#__PURE__*/React.createElement(Calendar, {
    value: filtros.createdAt,
    onChange: e => handleFilterChange("createdAt", e.value),
    selectionMode: "range",
    readOnlyInput: true,
    dateFormat: "dd/mm/yy",
    placeholder: "Seleccionar rango de fechas",
    className: "w-100",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Estado"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.status,
    options: states,
    onChange: e => handleFilterChange("status", e.value),
    optionLabel: "label",
    placeholder: "Seleccionar estado",
    className: "w-100"
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
    onClick: refresh
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "\xD3rdenes de Compra",
    style: styles.card
  }, /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: tableItems,
    lazy: true,
    rowKey: "orderNumber",
    first: first,
    rows: perPage,
    totalRecords: totalRecords,
    loading: loadingPurchaseOrders,
    onPage: handlePageChange,
    onSort: handleSortChange,
    onSearch: handleSearchChange,
    onReload: refresh,
    disableSearch: true,
    sortField: sortField || "",
    sortOrder: sortOrder
  }), /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  })), /*#__PURE__*/React.createElement(Dialog, {
    contentClassName: "overflow-hidden",
    maskClassName: "overlay-invoices",
    header: "Generar Factura",
    style: {
      width: "90vw",
      maxHeight: "100%"
    },
    visible: showGenerateInvoiceModal,
    onHide: () => setShowGenerateInvoiceModal(false),
    modal: true,
    dismissableMask: true,
    resizable: true
  }, selectedPurchaseOrder?.type === "purchase" ? /*#__PURE__*/React.createElement(PurchaseBilling, {
    purchaseOrder: selectedPurchaseOrder,
    onClose: () => handleInvoiceSuccess("Compra")
  }) : selectedPurchaseOrder?.type === "quote_of" ? /*#__PURE__*/React.createElement(SalesBilling, {
    selectedInvoice: selectedPurchaseOrder,
    successSale: () => handleInvoiceSuccess("Venta")
  }) : /*#__PURE__*/React.createElement("div", null, "No se pudo determinar el tipo de facturaci\xF3n")), /*#__PURE__*/React.createElement(NewReceiptBoxModal, {
    visible: isModalToPayment,
    onHide: () => {
      setIsModalToPayment(false);
    },
    onSubmit: handleSaveToPayment,
    onSaveAndDownload: handleSaveAndDownloadToPayment,
    initialData: {
      cliente: selectedPurchaseOrder?.cliente?.toString() || "",
      idFactura: selectedPurchaseOrder?.orderNumber || 0,
      numeroFactura: "",
      fechaElaboracion: selectedPurchaseOrder?.createdAt || new Date(),
      valorPagado: selectedPurchaseOrder?.total || 0,
      centreCost: selectedPurchaseOrder?.centre_cost || null,
      invoiceType: selectedPurchaseOrder?.type === "purchase" ? "purchase-order" : "sale-order",
      discount: selectedPurchaseOrder?.discount || 0,
      iva: selectedPurchaseOrder?.iva || 0,
      total_amount: selectedPurchaseOrder?.total_amount || 0,
      due_date: selectedPurchaseOrder?.due_date,
      quantity_total: selectedPurchaseOrder?.quantity_total || 0,
      third_party_id: selectedPurchaseOrder?.third_party_id || 0,
      user_id: Number(selectedPurchaseOrder?.user_id) || 0
    }
  }), /*#__PURE__*/React.createElement(Dialog, {
    style: {
      width: "90vw"
    },
    header: "Editar Orden de Compra",
    visible: isModalEdit,
    onHide: () => setIsModalEdit(false)
  }, /*#__PURE__*/React.createElement(FormPurchaseOrders, {
    dataToEdit: selectedPurchaseOrder,
    onSuccessEdit: handleToAfterEdit
  }))));
};