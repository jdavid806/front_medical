import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { useThirdParties } from "../billing/third-parties/hooks/useThirdParties.js";
import { useInvoicePurchase } from "./hooks/usePurcharseInvoice.js";
import { NewReceiptBoxModal } from "../accounting/paymentReceipt/modals/NewReceiptBoxModal.js";
import { FormDebitCreditNotes } from "../invoices/form/FormDebitCreditNotes.js";
import { usePurchaseInvoicesFormat } from "../documents-generation/hooks/billing/invoices/usePurchaseInvoices.js";
export const PurchaseInvoices = () => {
  const {
    thirdParties
  } = useThirdParties();
  const {
    fetchAllInvoice
  } = useInvoicePurchase();
  const {
    generateFormatPurchaseInvoices
  } = usePurchaseInvoicesFormat();

  // Estado para los datos de la tabla
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showReciboModal, setShowReciboModal] = useState(false);
  const [facturaParaRecibo, setFacturaParaRecibo] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [invoiceToNote, setInvoiceToNote] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");

  // Pagination state
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const generateInvoiceRef = useRef(generateFormatPurchaseInvoices);
  useEffect(() => {
    generateInvoiceRef.current = generateFormatPurchaseInvoices;
  }, [generateFormatPurchaseInvoices]);

  // Estado para los filtros
  const [filtros, setFiltros] = useState({
    numeroFactura: "",
    identificacion: "",
    fechaRango: null,
    estado: null
  });
  const toast = useRef(null);
  const estadosFactura = [{
    label: "Pendiente",
    value: "pending"
  }, {
    label: "Parcialmente Pagada",
    value: "partially_pending"
  }, {
    label: "Pagada",
    value: "paid"
  }, {
    label: "Anulada",
    value: "cancelled"
  }, {
    label: "Vencida",
    value: "expired"
  }];

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

  // Función para cargar facturas
  const loadFacturas = async (page = 1, per_page = 10) => {
    setTableLoading(true);
    try {
      const data = await fetchAllInvoice();
      if (data && Array.isArray(data)) {
        const startIndex = (page - 1) * per_page;
        const endIndex = startIndex + per_page;
        const paginatedData = data.slice(startIndex, endIndex);
        setFacturas(paginatedData);
        setTotalRecords(data.length);
      } else {
        console.error("Datos no válidos:", data);
        setFacturas([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Error cargando facturas:", error);
      showToast("error", "Error", "No se pudieron cargar las facturas");
      setFacturas([]);
      setTotalRecords(0);
    } finally {
      setTableLoading(false);
    }
  };

  // Función para aplicar filtros
  const aplicarFiltros = async (page = 1, per_page = 10) => {
    setTableLoading(true);
    try {
      const data = await fetchAllInvoice();
      if (data && Array.isArray(data)) {
        let filteredData = [...data];

        // Aplicar filtros
        if (filtros.numeroFactura) {
          filteredData = filteredData.filter(factura => factura.numeroFactura?.toLowerCase().includes(filtros.numeroFactura.toLowerCase()));
        }
        if (filtros.identificacion) {
          filteredData = filteredData.filter(factura => factura.identificacion?.toString().toLowerCase().includes(filtros.identificacion.toLowerCase()));
        }
        if (filtros.fechaRango && filtros.fechaRango[0] && filtros.fechaRango[1]) {
          const startDate = new Date(filtros.fechaRango[0]);
          const endDate = new Date(filtros.fechaRango[1]);
          endDate.setHours(23, 59, 59, 999);
          filteredData = filteredData.filter(factura => {
            if (!factura.fecha) return false;
            const facturaDate = new Date(factura.fecha);
            return facturaDate >= startDate && facturaDate <= endDate;
          });
        }
        if (filtros.estado) {
          filteredData = filteredData.filter(factura => factura.estado?.toLowerCase() === filtros.estado?.toLowerCase());
        }

        // Paginación
        const startIndex = (page - 1) * per_page;
        const endIndex = startIndex + per_page;
        const paginatedData = filteredData.slice(startIndex, endIndex);
        setFacturas(paginatedData);
        setTotalRecords(filteredData.length);
      } else {
        setFacturas([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Error aplicando filtros:", error);
      showToast("error", "Error", "No se pudieron aplicar los filtros");
      setFacturas([]);
      setTotalRecords(0);
    } finally {
      setTableLoading(false);
    }
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      numeroFactura: "",
      identificacion: "",
      fechaRango: null,
      estado: null
    });
    loadFacturas(1, rows);
  };

  // Formatear número para montos en pesos dominicanos (DOP)
  const formatCurrency = value => {
    return value?.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Formatear fecha
  const formatDate = value => {
    return value?.toLocaleDateString("es-DO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  // Funciones para las acciones
  const generateReceipt = invoice => {
    setFacturaParaRecibo(invoice);
    setShowReciboModal(true);
  };
  const handleGenerarRecibo = formData => {
    showToast("success", "Éxito", `Recibo generado para ${facturaParaRecibo?.numeroFactura}`);
    setShowReciboModal(false);
    setFacturaParaRecibo(null);
  };
  const downloadExcel = invoice => {
    showToast("success", "Éxito", `Descargando Excel para ${invoice.numeroFactura}`);
    // Aquí iría la llamada a la API para descargar Excel
  };
  const printInvoice = useCallback(async invoice => {
    generateInvoiceRef.current(invoice, "Impresion");
  }, [generateFormatPurchaseInvoices]);
  const downloadPdf = useCallback(async invoice => {
    generateInvoiceRef.current(invoice, "Descargar");
  }, [generateFormatPurchaseInvoices]);
  function generateDebitNote(invoice) {
    invoice.noteType = {
      id: "DEBIT",
      name: "Débito"
    };
    setInvoiceToNote(invoice);
    setShowNoteModal(true);
  }
  function generateCreditNote(invoice) {
    invoice.noteType = {
      id: "CREDIT",
      name: "Crédito"
    };
    setInvoiceToNote(invoice);
    setShowNoteModal(true);
  }
  function handleNoteSuccess() {
    toast.current?.show({
      severity: "success",
      summary: "Éxito",
      detail: "Nota guardada",
      life: 2000
    });
    setTimeout(() => {
      setShowNoteModal(false);
      aplicarFiltros(Math.floor(first / rows) + 1, rows);
    }, 1000);
  }
  const TableMenu = ({
    rowData
  }) => {
    const menu = useRef(null);
    const handleGenerateReceipt = () => {
      generateReceipt(rowData);
    };
    const handleGenerateDebitNote = () => {
      generateDebitNote(rowData);
    };
    const handleGenerateCreditNote = () => {
      generateCreditNote(rowData);
    };
    const handleDownloadExcel = () => {
      downloadExcel(rowData);
    };
    const handlePrintInvoice = () => {
      printInvoice(rowData);
    };
    const handleDownloadPdf = () => {
      downloadPdf(rowData);
    };
    const menuItems = [{
      label: "Generar Recibo",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-receipt me-2"
      }),
      command: handleGenerateReceipt
    }, {
      label: "Generar Nota Débito",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-file-invoice-dollar me-2"
      }),
      command: handleGenerateDebitNote,
      disabled: rowData.notes.length > 0
    }, {
      label: "Generar Nota Crédito",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-file-invoice me-2"
      }),
      command: handleGenerateCreditNote,
      disabled: rowData.notes.length > 0
    }, {
      label: "Descargar Excel",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-file-excel me-2"
      }),
      command: handleDownloadExcel
    }, {
      label: "Imprimir",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-print me-2"
      }),
      command: handlePrintInvoice
    }, {
      label: "Descargar PDF",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-file-pdf me-2"
      }),
      command: handleDownloadPdf
    }];
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
      model: menuItems,
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

  // Estilo para los tags de estado - RESPETANDO TODOS LOS ESTADOS ORIGINALES
  const getEstadoSeverity = estado => {
    switch (estado) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "partially_pending":
        return "info";
      case "cancelled":
        return "danger";
      case "expired":
        return "danger";
      default:
        return null;
    }
  };
  const getEstadoLabel = estado => {
    switch (estado) {
      case "paid":
        return "Pagada";
      case "pending":
        return "Pendiente";
      case "partially_pending":
        return "Parcialmente Pagada";
      case "cancelled":
        return "Anulada";
      case "expired":
        return "Vencida";
      default:
        return estado || "";
    }
  };

  // Mapear los datos para la tabla
  const tableItems = facturas.map(factura => ({
    id: factura.id,
    numeroFactura: factura.numeroFactura,
    fecha: factura.fecha,
    identificacion: factura.identificacion,
    proveedor: factura.proveedor,
    paid: factura.paid || factura.monto - factura.remainingAmount,
    remainingAmount: factura.remainingAmount,
    monto: factura.monto,
    adjustedType: factura.adjustedType,
    estado: factura.estado,
    actions: factura
  }));
  const columns = [{
    field: 'numeroFactura',
    header: 'Factura',
    sortable: true
  }, {
    field: 'fecha',
    header: 'Fecha',
    sortable: true,
    body: rowData => formatDate(rowData.fecha)
  }, {
    field: 'identificacion',
    header: 'Identificación',
    sortable: true
  }, {
    field: 'proveedor',
    header: 'Proveedor',
    sortable: true
  }, {
    field: 'paid',
    header: 'Pagado',
    sortable: true,
    body: rowData => formatCurrency(rowData.paid)
  }, {
    field: 'remainingAmount',
    header: 'Restante',
    sortable: true,
    body: rowData => formatCurrency(rowData.remainingAmount)
  }, {
    field: 'monto',
    header: 'Valor',
    sortable: true,
    body: rowData => formatCurrency(rowData.monto)
  }, {
    field: 'adjustedType',
    header: 'Ajuste',
    sortable: true
  }, {
    field: 'estado',
    header: 'Estado',
    sortable: true,
    body: rowData => /*#__PURE__*/React.createElement(Tag, {
      value: getEstadoLabel(rowData.estado),
      severity: getEstadoSeverity(rowData.estado)
    })
  }, {
    field: 'actions',
    header: 'Acciones',
    body: rowData => actionBodyTemplate(rowData.actions),
    exportable: false,
    width: "120px"
  }];
  const handleSearchChange = searchValue => {
    setGlobalFilter(searchValue);
  };
  const handleRefresh = async () => {
    limpiarFiltros();
    await loadFacturas(1, rows);
  };
  useEffect(() => {
    loadFacturas(1, rows);
  }, []);
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
    className: " h-100 w-100 d-flex flex-column",
    style: {
      marginTop: "-30px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-end pt-3 mb-2"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-primary",
    onClick: () => window.location.href = "Facturacion_Compras"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-file-edit me-2"
  }), "Nueva Facturaci\xF3n Compra")), /*#__PURE__*/React.createElement(Accordion, null, /*#__PURE__*/React.createElement(AccordionTab, {
    header: "Filtros de B\xFAsqueda"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "N\xFAmero de factura"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.numeroFactura,
    onChange: e => handleFilterChange("numeroFactura", e.target.value),
    placeholder: "FAC-001-0000001",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Identificaci\xF3n"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.identificacion,
    onChange: e => handleFilterChange("identificacion", e.target.value),
    placeholder: "RNC/C\xE9dula",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Rango de fechas"), /*#__PURE__*/React.createElement(Calendar, {
    value: filtros.fechaRango,
    onChange: e => handleFilterChange("fechaRango", e.value),
    selectionMode: "range",
    readOnlyInput: true,
    dateFormat: "dd/mm/yy",
    placeholder: "Seleccione rango",
    className: "w-100",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Estado"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.estado,
    options: estadosFactura,
    onChange: e => handleFilterChange("estado", e.value),
    optionLabel: "label",
    placeholder: "Seleccione estado",
    className: "w-100",
    showClear: true
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
    loading: tableLoading,
    onSearch: handleSearchChange,
    onReload: handleRefresh,
    paginator: true,
    rows: rows,
    first: first,
    onPage: onPageChange,
    totalRecords: totalRecords,
    rowsPerPageOptions: [5, 10, 25, 50],
    currentPageReportTemplate: "Mostrando {first} a {last} de {totalRecords} facturas",
    emptyMessage: "No se encontraron facturas"
  }))), /*#__PURE__*/React.createElement(NewReceiptBoxModal, {
    visible: showReciboModal,
    onHide: () => {
      setShowReciboModal(false);
      setFacturaParaRecibo(null);
      aplicarFiltros();
    },
    onSubmit: handleGenerarRecibo,
    onSaveAndDownload: handleGenerarRecibo,
    initialData: {
      cliente: facturaParaRecibo?.third_party?.id?.toString() || "",
      idFactura: facturaParaRecibo?.id || 0,
      numeroFactura: facturaParaRecibo?.numeroFactura || "",
      fechaElaboracion: facturaParaRecibo?.fecha || new Date(),
      valorPagado: facturaParaRecibo?.remainingAmount || 0,
      centreCost: facturaParaRecibo?.centre_cost || null,
      invoiceType: "purchase-invoice"
    }
  }), /*#__PURE__*/React.createElement(Dialog, {
    style: {
      width: "85vw"
    },
    header: "Generar Nota",
    visible: showNoteModal,
    onHide: () => setShowNoteModal(false)
  }, /*#__PURE__*/React.createElement(FormDebitCreditNotes, {
    initialData: invoiceToNote,
    onSuccess: handleNoteSuccess
  })));
};