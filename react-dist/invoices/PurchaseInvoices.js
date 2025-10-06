import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { classNames } from "primereact/utils";
import { useThirdParties } from "../billing/third-parties/hooks/useThirdParties.js";
import { useInvoicePurchase } from "./hooks/usePurcharseInvoice.js";
import { SplitButton } from "primereact/splitbutton";
import { Toast } from "primereact/toast";
import { NewReceiptBoxModal } from "../accounting/paymentReceipt/modals/NewReceiptBoxModal.js";
import { useCompany } from "../hooks/useCompany.js";
import { NewNoteModal } from "./NewNoteModal.js";
import { useApplyNote } from "./hooks/useApplyNote.js";
import { usePurchaseInvoicesFormat } from "../documents-generation/hooks/billing/invoices/usePurchaseInvoices.js";
export const PurchaseInvoices = () => {
  const {
    thirdParties
  } = useThirdParties();

  // Estado para la tabla
  const [facturas, setFacturas] = useState([]);
  const [filteredFacturas, setFilteredFacturas] = useState([]);
  const [showReciboModal, setShowReciboModal] = useState(false);
  const [facturaParaRecibo, setFacturaParaRecibo] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [tipoNota, setTipoNota] = useState("debito");
  const {
    fetchAllInvoice,
    loading
  } = useInvoicePurchase();
  const {
    company,
    setCompany,
    fetchCompany
  } = useCompany();
  const {
    applyNote,
    loading: loadingNote,
    error: errorNote
  } = useApplyNote();
  const {
    generateFormatPurchaseInvoices
  } = usePurchaseInvoicesFormat();

  // Estado para filtros
  const [filtros, setFiltros] = useState({
    numeroFactura: "",
    identificacion: "",
    fechaRango: null,
    estado: null
  });
  const toast = useRef(null);
  const tiposFactura = [{
    label: "Contado",
    value: "Contado"
  }, {
    label: "Crédito",
    value: "Crédito"
  }];
  const estadosFactura = [{
    label: "Pendiente",
    value: "pending"
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
  useEffect(() => {
    loadFacturas();
  }, []);
  const loadFacturas = async () => {
    try {
      const data = await fetchAllInvoice();
      console.log("Datos recibidos:", data);
      if (data && Array.isArray(data)) {
        setFacturas(data);
        setFilteredFacturas(data);
      } else {
        console.error("Datos no válidos:", data);
        setFacturas([]);
        setFilteredFacturas([]);
      }
    } catch (error) {
      console.error("Error cargando facturas:", error);
      showToast("error", "Error", "No se pudieron cargar las facturas");
      setFacturas([]);
      setFilteredFacturas([]);
    }
  };
  // Manejadores de filtros
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const aplicarFiltros = () => {
    if (!facturas || facturas.length === 0) {
      setFilteredFacturas([]);
      return;
    }
    let result = [...facturas];
    if (filtros.numeroFactura) {
      result = result.filter(factura => factura.numeroFactura?.toLowerCase().includes(filtros.numeroFactura.toLowerCase()));
    }
    if (filtros.identificacion) {
      result = result.filter(factura => factura.identificacion?.toString().toLowerCase().includes(filtros.identificacion.toLowerCase()));
    }
    if (filtros.fechaRango && filtros.fechaRango[0] && filtros.fechaRango[1]) {
      const startDate = new Date(filtros.fechaRango[0]);
      const endDate = new Date(filtros.fechaRango[1]);
      endDate.setHours(23, 59, 59, 999);
      result = result.filter(factura => {
        if (!factura.fecha) return false;
        const facturaDate = new Date(factura.fecha);
        return facturaDate >= startDate && facturaDate <= endDate;
      });
    }
    if (filtros.estado) {
      result = result.filter(factura => factura.estado?.toLowerCase() === filtros.estado?.toLowerCase());
    }
  };
  const limpiarFiltros = () => {
    setFiltros({
      numeroFactura: "",
      identificacion: "",
      fechaRango: null,
      estado: null
    });
    setFilteredFacturas(facturas); // Mostrar todos los datos nuevamente
  };

  // Utilidades
  const formatCurrency = value => {
    return value?.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
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
  const printInvoice = invoice => {
    generateFormatPurchaseInvoices(invoice, "Impresion");
  };
  const downloadPdf = invoice => {
    generateFormatPurchaseInvoices(invoice, "Descargar");
  };
  const createActionTemplate = (icon, label, colorClass = "") => {
    return () => /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center gap-2 p-2 point",
      style: {
        cursor: "pointer"
      } // Agrega el cursor pointer aquí
    }, /*#__PURE__*/React.createElement("i", {
      className: `fas fa-${icon} ${colorClass}`
    }), /*#__PURE__*/React.createElement("span", null, label));
  };

  // Acciones para cada fila
  const actionBodyTemplate = rowData => {
    const items = [{
      label: "Generar Recibo",
      template: createActionTemplate("receipt", "Generar Recibo", "text-green-500"),
      command: () => generateReceipt(rowData)
    }, {
      label: "Generar Nota Débito",
      template: createActionTemplate("money-bill-transfer", "Generar Nota Débito", "text-green-500"),
      command: () => {
        setFacturaParaRecibo(rowData);
        setTipoNota("debito");
        setShowNoteModal(true);
      }
    }, {
      label: "Generar Nota Crédito",
      template: createActionTemplate("money-bill-transfer", "Generar Nota Crédito", "text-green-500"),
      command: () => {
        setFacturaParaRecibo(rowData);
        setTipoNota("credito");
        setShowNoteModal(true);
      }
    }, {
      label: "Descargar Excel",
      template: createActionTemplate("file-excel", "Descargar Excel", "text-green-600"),
      command: () => downloadExcel(rowData)
    }, {
      label: "Imprimir",
      template: createActionTemplate("print", "Imprimir", "text-blue-500"),
      command: () => printInvoice(rowData)
    }, {
      label: "Descargar PDF",
      template: createActionTemplate("file-pdf", "Descargar PDF", "text-red-500"),
      command: () => downloadPdf(rowData)
    }];
    return /*#__PURE__*/React.createElement(SplitButton, {
      label: "Acciones",
      icon: "pi pi-cog",
      model: items,
      severity: "contrast",
      className: "p-button-sm point",
      buttonClassName: "p-button-sm",
      menuButtonClassName: "p-button-sm point",
      menuStyle: {
        minWidth: "220px",
        cursor: "pointer"
      }
    });
  };
  const showToast = (severity, summary, detail) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000
    });
  };
  const getEstadoSeverity = estado => {
    switch (estado) {
      case "paid":
        return "success";
      case "pending":
      case "partially_pending":
        return "warning";
      case "cancelled":
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
        return "";
    }
  };

  // Estilos
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
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      margin: "10px"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Nueva Facturaci\xF3n Compra",
    icon: "pi pi-file-edit",
    className: "btn btn-primary",
    onClick: () => window.location.href = "Facturacion_Compras"
  })), /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de B\xFAsqueda",
    style: styles.card
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "N\xFAmero de factura"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.numeroFactura,
    onChange: e => handleFilterChange("numeroFactura", e.target.value),
    placeholder: "FAC-001-0000001",
    className: classNames("w-100")
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Identificaci\xF3n"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.identificacion,
    onChange: e => handleFilterChange("identificacion", e.target.value),
    placeholder: "RNC/C\xE9dula",
    className: classNames("w-100")
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Rango de fechas"), /*#__PURE__*/React.createElement(Calendar, {
    value: filtros.fechaRango,
    onChange: e => handleFilterChange("fechaRango", e.value),
    selectionMode: "range",
    readOnlyInput: true,
    dateFormat: "dd/mm/yy",
    placeholder: "Seleccione rango",
    className: classNames("w-100"),
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Estado"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.estado,
    options: estadosFactura,
    onChange: e => handleFilterChange("estado", e.value),
    optionLabel: "label",
    placeholder: "Seleccione estado",
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
    title: "Facturas de Compra",
    style: styles.card
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: filteredFacturas,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    className: "p-datatable-striped p-datatable-gridlines",
    emptyMessage: "No se encontraron facturas",
    responsiveLayout: "scroll",
    tableStyle: {
      minWidth: "50rem"
    }
  }, /*#__PURE__*/React.createElement(Column, {
    field: "numeroFactura",
    header: "Factura",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "fecha",
    header: "Fecha",
    sortable: true,
    body: rowData => formatDate(rowData.fecha),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "identificacion",
    header: "Identificaci\xF3n",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "proveedor",
    header: "Proveedor",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "paid",
    header: "Pagado",
    sortable: true,
    body: rowData => formatCurrency(rowData.paid),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "remainingAmount",
    header: "Restante",
    sortable: true,
    body: rowData => formatCurrency(rowData.remainingAmount),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "monto",
    header: "Valor",
    sortable: true,
    body: rowData => formatCurrency(rowData.monto),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "estado",
    header: "Estado",
    sortable: true,
    body: rowData => /*#__PURE__*/React.createElement(Tag, {
      value: getEstadoLabel(rowData.estado),
      severity: getEstadoSeverity(rowData.estado)
    }),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    body: actionBodyTemplate,
    header: "Acciones",
    style: {
      width: "100px"
    },
    exportable: false
  }))), /*#__PURE__*/React.createElement(NewReceiptBoxModal, {
    visible: showReciboModal,
    onHide: () => {
      setShowReciboModal(false);
      setFacturaParaRecibo(null);
      loadFacturas();
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
  }), /*#__PURE__*/React.createElement(NewNoteModal, {
    visible: showNoteModal,
    onHide: () => setShowNoteModal(false),
    factura: facturaParaRecibo,
    tipo: tipoNota,
    onSubmit: async data => {
      try {
        console.log(data);
        await applyNote(data);
        showToast("success", "Éxito", `Nota ${data.type === "credit" ? "Crédito" : "Débito"} aplicada correctamente`);
        await loadFacturas();
      } catch (err) {
        showToast("error", "Error", errorNote || "No se pudo aplicar la nota");
      }
    }
  }));
};