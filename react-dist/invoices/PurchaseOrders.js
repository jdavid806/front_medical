import React, { useEffect, useRef, useState, useCallback } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { CustomPRTable } from "../components/CustomPRTable.js";
import { formatDate } from "../../services/utilidades.js";
import { PurchaseBilling } from "../billing/purchase_billing/PurchaseBilling.js";
import { SalesBilling } from "../billing/sales_billing/SalesBilling.js";
import { FormPurchaseOrders } from "./form/FormPurchaseOrdersV2.js";
import { NewReceiptBoxModal } from "../accounting/paymentReceipt/modals/NewReceiptBoxModal.js";
import { generarFormatoContable } from "../../funciones/funcionesJS/generarPDFContable.js";
import { PurchaseOrderPayments } from "./PurchaseOrderPayments.js";
import { useThirdParties } from "../billing/third-parties/hooks/useThirdParties.js";
import { usePurchaseOrders } from "./hooks/usePurchaseOrders.js";
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
  componentConfigs = {
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
  const [showGenerateInvoiceModal, setShowGenerateInvoiceModal] = useState(false);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isModalToPayment, setIsModalToPayment] = useState(false);
  const [tableItems, setTableItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
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
  const getInitialDataPurchaseOrder = selectedPurchaseOrder => {
    if (!selectedPurchaseOrder) return {};
    return {
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
    };
  };
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
    totalRecords: purchaseOrdersTotal,
    first: purchaseOrdersFirst,
    loadingPurchaseOrders,
    perPage,
    sortField,
    sortOrder
  } = usePurchaseOrders(getCustomFilters);
  const {
    thirdParties
  } = useThirdParties();
  const toast = useRef(null);

  // Manejadores de cambio de filtros
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const onPageChange = event => {
    setFirst(event.first);
    setRows(event.rows);
    aplicarFiltros(event.page + 1, event.rows);
  };
  const aplicarFiltros = async (page = 1, per_page = 10) => {
    setTableLoading(true);
    try {
      // Simular aplicación de filtros
      await refresh();
    } catch (error) {
      console.error("Error aplicando filtros:", error);
      showToast("error", "Error", "No se pudieron aplicar los filtros");
    } finally {
      setTableLoading(false);
    }
  };
  useEffect(() => {
    if (initialFilters) {
      setFiltros(initialFilters);
    }
  }, [initialFilters]);
  useEffect(() => {
    const mappedItems = purchaseOrders.map(item => {
      return {
        orderNumber: item.id,
        type: item.type,
        thirdPartyName: item.third_party?.name || "",
        createdAt: new Date(item.created_at),
        dueDate: formatDate(item.due_date),
        total: item.total_amount,
        status: item.status,
        cliente: item.third_id?.toString(),
        centre_cost: item.centre_cost || null,
        discount: item.total_discount || 0,
        iva: item.total_taxes || 0,
        total_amount: item.total_amount || 0,
        due_date: new Date(item.due_date),
        quantity_total: item.total_products || 0,
        third_party_id: item.third_id || 0,
        user_id: Number(item.buyer_id) || 0,
        thirdParty: item.third_party || null,
        details: item.details || []
      };
    });
    setTableItems(mappedItems);
    setTotalRecords(purchaseOrdersTotal);
  }, [purchaseOrders]);

  // CORREGIDO: Función renombrada para evitar recursión
  const handleGenerateInvoiceClick = useCallback(rowData => {
    const orderDetails = purchaseOrders.find(order => order.id === rowData.orderNumber);
    if (orderDetails) {
      setSelectedPurchaseOrder({
        ...rowData,
        orderNumber: orderDetails.id,
        createdAt: new Date(orderDetails.created_at),
        dueDate: formatDate(orderDetails.due_date),
        total: orderDetails.total_amount,
        thirdPartyName: orderDetails.third_party?.name || "",
        cliente: orderDetails.third_id?.toString(),
        centre_cost: orderDetails.centre_cost || null
      });
      setShowGenerateInvoiceModal(true);
      setIsModalEdit(false);
      setIsModalToPayment(false);
    }
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
    refresh();
  };

  // Formatear número para montos en pesos dominicanos (DOP)
  const formatCurrency = value => {
    return value?.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) || "$0.00";
  };
  function handleToPayment(data) {
    setSelectedPurchaseOrder(data);
    setIsModalToPayment(true);
    setShowGenerateInvoiceModal(false);
    setIsModalEdit(false);
  }
  function handleInvoiceSuccess(type) {
    setShowGenerateInvoiceModal(false);
    refresh();
    showToast("success", "Éxito", `Factura de ${type} generada correctamente`);
  }
  function handleSaveToPayment() {}
  function handleSaveAndDownloadToPayment() {}
  const handleDownloadPDF = useCallback(rowData => {
    generarFormatoContable("OrdenCompra", rowData, "Impresion");
    showToast("success", "Éxito", "PDF generado correctamente");
  }, []);
  const handleDownloadExcel = useCallback(rowData => {
    // Implementar lógica de descarga Excel
    showToast("success", "Éxito", "Excel descargado correctamente");
  }, []);
  function handleToAfterEdit() {
    setIsModalEdit(false);
    refresh();
    showToast("success", "Éxito", "Orden de compra editada correctamente");
  }
  function handleViewPaymentHistory(data) {
    setSelectedPurchaseOrder(data);
    setShowPaymentHistoryModal(true);
  }
  const TableMenu = ({
    rowData
  }) => {
    const menu = useRef(null);
    const handleEdit = () => {
      handleToEdit(rowData);
    };
    const handleGenerateInvoice = () => {
      handleGenerateInvoiceClick(rowData); // Usar la función corregida
    };
    const handlePayment = () => {
      handleToPayment(rowData);
    };
    const handlePaymentHistory = () => {
      handleViewPaymentHistory(rowData);
    };
    const handlePDF = () => {
      handleDownloadPDF(rowData);
    };
    const handleExcel = () => {
      handleDownloadExcel(rowData);
    };
    const menuItems = [...(rowData.status !== "approved" ? [{
      label: "Editar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-pencil me-2"
      }),
      command: handleEdit
    }, {
      label: "Generar factura",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid far fa-file me-2"
      }),
      command: handleGenerateInvoice
    }, {
      label: "Realizar abono",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-money-bills me-2"
      }),
      command: handlePayment
    }, {
      label: "Historial de Abonos",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-history me-2"
      }),
      command: handlePaymentHistory
    }] : []), {
      label: "Descargar PDF",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-file-pdf me-2"
      }),
      command: handlePDF
    }, {
      label: "Descargar Excel",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-file-excel me-2"
      }),
      command: handleExcel
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      className: "p-button-primary flex items-center gap-2",
      onClick: e => menu.current?.toggle(e),
      "aria-controls": `popup_menu_${rowData.orderNumber}`,
      "aria-haspopup": true
    }, "Acciones", /*#__PURE__*/React.createElement("i", {
      className: "fas fa-cog ml-2"
    })), /*#__PURE__*/React.createElement(Menu, {
      model: menuItems,
      popup: true,
      ref: menu,
      id: `popup_menu_${rowData.orderNumber}`,
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
      rowData: rowData
    }));
  };
  const showToast = (severity, summary, detail) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000
    });
  };
  const handleSearchChangeCustom = searchValue => {
    setGlobalFilter(searchValue);
    handleSearchChange(searchValue);
  };
  const handleRefresh = async () => {
    limpiarFiltros();
    await refresh();
  };
  const columns = [{
    field: "orderNumber",
    header: "No. Orden",
    sortable: true
  }, {
    field: "type",
    header: "Tipo",
    sortable: true,
    body: rowData => purchaseOrderTypes[rowData.type] || rowData.type
  }, {
    field: "thirdPartyName",
    header: "Proveedor",
    sortable: true
  }, {
    field: "createdAt",
    header: "Fecha de elaboración",
    sortable: true,
    body: rowData => formatDate(rowData.createdAt)
  }, {
    field: "dueDate",
    header: "Fecha de vencimiento",
    sortable: true,
    body: rowData => rowData.dueDate
  }, {
    field: "total",
    header: "Valor Total",
    sortable: true,
    body: rowData => formatCurrency(rowData.total)
  }, {
    field: "status",
    header: "Estado",
    sortable: true,
    body: rowData => /*#__PURE__*/React.createElement(Tag, {
      value: purchaseOrderStates[rowData.status] || rowData.status,
      severity: purchaseOrderStateColors[rowData.status] || "secondary"
    })
  }, {
    field: "actions",
    header: "Acciones",
    body: actionBodyTemplate,
    exportable: false,
    width: "120px"
  }];
  return /*#__PURE__*/React.createElement("main", {
    className: "main w-100",
    id: "top"
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), loading ? /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-center align-items-center",
    style: {
      height: "50vh",
      marginLeft: "900px",
      marginTop: "300px"
    }
  }, /*#__PURE__*/React.createElement(ProgressSpinner, null)) : /*#__PURE__*/React.createElement("div", {
    className: "w-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-100 w-100 d-flex flex-column",
    style: {
      marginTop: "-30px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-end pt-3 mb-2"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-primary",
    onClick: () => window.location.href = componentConfigs.newPurchaseOrderBtn.redirect
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-file-edit me-2"
  }), componentConfigs.newPurchaseOrderBtn.label)), /*#__PURE__*/React.createElement(Accordion, null, /*#__PURE__*/React.createElement(AccordionTab, {
    header: "Filtros de B\xFAsqueda"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "No. Orden"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.orderNumber,
    onChange: e => handleFilterChange("orderNumber", e.target.value),
    placeholder: "OC-001-0000001",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Tipo"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.type,
    options: types,
    onChange: e => handleFilterChange("type", e.value),
    optionLabel: "label",
    placeholder: "Seleccionar tipo",
    className: "w-100",
    disabled: filterConfigs?.type?.disabled || false
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
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
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
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
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
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
    className: "p-button-secondary",
    onClick: limpiarFiltros
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Aplicar Filtros",
    icon: "pi pi-filter",
    className: "p-button-primary",
    onClick: () => aplicarFiltros(),
    loading: tableLoading
  }))))), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: tableItems,
    loading: tableLoading || loadingPurchaseOrders,
    onSearch: handleSearchChangeCustom,
    onReload: handleRefresh,
    paginator: true,
    rows: rows,
    first: first,
    onPage: onPageChange,
    totalRecords: totalRecords,
    rowsPerPageOptions: [5, 10, 25, 50],
    currentPageReportTemplate: "Mostrando {first} a {last} de {totalRecords} \xF3rdenes",
    emptyMessage: "No se encontraron \xF3rdenes de compra"
  }))), /*#__PURE__*/React.createElement(Dialog, {
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
    initialData: getInitialDataPurchaseOrder(selectedPurchaseOrder)
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
  })));
};