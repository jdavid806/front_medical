import React, { useEffect, useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useAccountsCollectPay } from "../accountsCollectPay/hooks/useAccountsCollectPay.js";
import { Paginator } from "primereact/paginator";
import { NewReceiptBoxModal } from "../../accounting/paymentReceipt/modals/NewReceiptBoxModal.js";
import { generatePDFFromHTMLV2 } from "../../../funciones/funcionesJS/exportPDFV2.js";
import { useCompany } from "../../hooks/useCompany.js";
import { exportToExcel } from "../../accounting/utils/ExportToExcelOptions.js";
import { resourcesAdminService } from "../../../services/api/index.js";
export const AccountsCollectPay = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSupplierIds, setSelectedSupplierIds] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [selectedDueDateRange, setSelectedDueDateRange] = useState(null);
  const [selectedDaysToPay, setSelectedDaysToPay] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [invoiceToReceipt, setInvoiceToReceipt] = useState(null);
  const [invoiceType, setInvoiceType] = useState("");
  const {
    company,
    setCompany,
    fetchCompany
  } = useCompany();
  useEffect(() => {
    fetchSuppliers();
  }, []);
  const formatDateRange = range => {
    if (!range || !range[0] || !range[1]) return undefined;
    const from = range[0].toISOString().slice(0, 10);
    const to = range[1].toISOString().slice(0, 10);
    return `${from},${to}`;
  };
  const commonFilters = {
    page: Math.floor(first / rows) + 1,
    // Calcula el número de página
    per_page: rows,
    // Items por página
    suppliers: selectedSupplierIds.length ? selectedSupplierIds : undefined,
    createdAt: formatDateRange(selectedDateRange),
    dueDate: formatDateRange(selectedDueDateRange),
    days_to_pay: selectedDaysToPay ?? undefined
  };
  const {
    invoices: accountsReceivable,
    loading: loadingReceivable,
    totalRecords: totalReceivable // Asegúrate que tu hook devuelva este valor
  } = useAccountsCollectPay({
    ...commonFilters,
    type: "sale,entity",
    status: "pending,partially_pending"
  });
  const {
    invoices: accountsPayable,
    loading: loadingPayable,
    totalRecords: totalPayable
  } = useAccountsCollectPay({
    ...commonFilters,
    type: "purchase",
    status: "pending,partially_pending"
  });
  const daysToPayOptions = [{
    label: "Todos",
    value: null
  }, {
    label: "Próximos a vencer (1-5 días)",
    value: "1-5"
  }, {
    label: "6-10 días",
    value: "6-10"
  }, {
    label: "11-15 días",
    value: "11-15"
  }, {
    label: "16-25 días",
    value: "16-25"
  }, {
    label: "26-35 días",
    value: "26-35"
  }, {
    label: "36-45 días",
    value: "36-45"
  }, {
    label: "Más de 60 días",
    value: "60+"
  }];
  async function fetchSuppliers() {
    const response = await resourcesAdminService.getThirdParties();
    setSuppliers(response.data);
  }
  const onPageChange = event => {
    setFirst(event.first);
    setRows(event.rows);
  };
  const formatoDinero = cantidad => {
    const amount = typeof cantidad === "string" ? parseFloat(cantidad) : cantidad;
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  const obtenerFechaFormateada = fechaStr => {
    if (!fechaStr) return "—";
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };
  const getStatusBadge = (status, days) => {
    if (status === "paid") return /*#__PURE__*/React.createElement("span", {
      className: "badge bg-success"
    }, "Pagado");
    if (status === "overdue") return /*#__PURE__*/React.createElement("span", {
      className: "badge bg-danger"
    }, "Vencido");
    if (days <= 5) return /*#__PURE__*/React.createElement("span", {
      className: "badge bg-warning text-dark"
    }, "Por vencer (", days, "d)");
    return /*#__PURE__*/React.createElement("span", {
      className: "badge bg-primary"
    }, "Pendiente (", days, "d)");
  };
  const getStatusBadgeBasic = (status, days) => {
    if (status === "paid") return "Pagado";
    if (status === "overdue") return "Vencido";
    if (days <= 5) return "Por vencer" + days + "d";
    return "Pendiente " + days + "d";
  };
  const limpiarFiltros = () => {
    setSelectedSupplierIds([]);
    setSelectedDateRange(null);
    setSelectedDueDateRange(null);
    setSelectedDaysToPay(null);
  };
  const aplicarFiltros = () => {
    console.log("Aplicando filtros...", {
      selectedSupplierIds,
      selectedDateRange,
      selectedDueDateRange,
      selectedDaysToPay
    });
  };
  function generateReceipt(rowData) {
    switch (rowData.type) {
      case "sale":
      case "entity":
        setInvoiceType("sale-invoice");
        break;
      case "purchase":
        setInvoiceType("purchase-invoice");
        break;
    }
    setInvoiceToReceipt(rowData);
    setShowReceiptModal(true);
  }
  function handleGenerarRecibo() {
    setShowReceiptModal(false);
    setInvoiceToReceipt(null);
  }
  function downloadPdf(item) {
    const today = new Date();
    const dueDate = new Date(item.due_date);
    const daysToPay = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const status = daysToPay < 0 ? "overdue" : "pending";
    const dataExport = {
      Factura: item.invoice_code,
      Cliente: item?.third_party?.nombre || "Sin cliente",
      Fecha: obtenerFechaFormateada(item.created_at),
      "Fecha vencimiento": obtenerFechaFormateada(item.due_date),
      "Días para pagar": daysToPay,
      Total: `$${Number(item.total_amount).toFixed(2)}`,
      Pendiende: `$${Number(item.remaining_amount).toFixed(2)}`,
      Estado: getStatusBadgeBasic(status, daysToPay)
    };
    const table = `
        <style>
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 25px;
          font-size: 12px;
        }
        th { 
          background-color: rgb(66, 74, 81); 
          color: white; 
          padding: 10px; 
          text-align: left;
          font-weight: normal;
        }
        td { 
          padding: 10px 8px; 
          border-bottom: 1px solid #eee;
        }
        </style>
        <table>
      <thead>
        <tr>
          ${Object.keys(dataExport).map(key => `<th>${key}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        <tr>
          ${Object.values(dataExport).map(value => `<td>${value}</td>`).join("")}
        </tr>
      </tbody>
    </table>`;
    const configPDF = {
      name: "Factura_" + item.invoice_code,
      isDownload: true
    };
    generatePDFFromHTMLV2(table, company, configPDF);
  }
  function downloadExcelGeneral(items, name) {
    const dataExport = items.map(item => {
      const today = new Date();
      const dueDate = new Date(item.due_date);
      const daysToPay = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const status = daysToPay < 0 ? "overdue" : "pending";
      return {
        Factura: item.invoice_code,
        Cliente: item?.third_party?.nombre || "Sin cliente",
        Fecha: obtenerFechaFormateada(item.created_at),
        "Fecha vencimiento": obtenerFechaFormateada(item.due_date),
        "Días para pagar": daysToPay,
        Total: `$${Number(item.total_amount).toFixed(2)}`,
        Pendiende: `$${Number(item.remaining_amount).toFixed(2)}`,
        Estado: getStatusBadgeBasic(status, daysToPay)
      };
    });
    const totals = {
      Factura: " ",
      Cliente: " ",
      Fecha: " ",
      "Fecha vencimiento": " ",
      "Días para pagar": "Totales",
      Total: `$${items.reduce((acc, item) => acc + Number(item.total_amount), 0).toFixed(2)}`,
      Pendiende: `$${items.reduce((acc, item) => acc + Number(item.remaining_amount), 0).toFixed(2)}`,
      Estado: " "
    };
    dataExport.push(totals);
    exportToExcel({
      data: dataExport,
      fileName: name
    });
  }
  function downloadPdfGeneral(items, name) {
    const dataExport = items.map(item => {
      const today = new Date();
      const dueDate = new Date(item.due_date);
      const daysToPay = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const status = daysToPay < 0 ? "overdue" : "pending";
      return {
        Factura: item.invoice_code,
        Cliente: item?.third_party?.nombre || "Sin cliente",
        Fecha: obtenerFechaFormateada(item.created_at),
        "Fecha vencimiento": obtenerFechaFormateada(item.due_date),
        "Días para pagar": daysToPay,
        Total: `$${Number(item.total_amount).toFixed(2)}`,
        Pendiende: `$${Number(item.remaining_amount).toFixed(2)}`,
        Estado: getStatusBadgeBasic(status, daysToPay)
      };
    });
    const totals = {
      Factura: " ",
      Cliente: " ",
      Fecha: " ",
      "Fecha vencimiento": " ",
      "Días para pagar": "Totales",
      Total: `$${items.reduce((acc, item) => acc + Number(item.total_amount), 0).toFixed(2)}`,
      Pendiende: `$${items.reduce((acc, item) => acc + Number(item.remaining_amount), 0).toFixed(2)}`,
      Estado: " "
    };
    dataExport.push(totals);
    const table = `
        <style>
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 25px;
          font-size: 12px;
        }
        th { 
          background-color: rgb(66, 74, 81); 
          color: white; 
          padding: 10px; 
          text-align: left;
          font-weight: normal;
        }
        td { 
          padding: 10px 8px; 
          border-bottom: 1px solid #eee;
        }
        </style>
        <table>
      <thead>
        <tr>
          ${Object.keys(dataExport[0]).map(key => `<th>${key}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${dataExport.map(row => `
          <tr>
            ${Object.values(row).map(value => `<td>${value}</td>`).join("")}
          </tr>
        `).join("")}
      </tbody>
    </table>`;
    const configPDF = {
      name: name,
      isDownload: true
    };
    generatePDFFromHTMLV2(table, company, configPDF);
  }
  const renderItemDetails = details => /*#__PURE__*/React.createElement("div", {
    className: "mt-3 d-flex align-items-center gap-3"
  }, /*#__PURE__*/React.createElement("h5", null, "Detalle de Factura"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "btn btn-phoenix-secondary mr-2 fas fa-file-pdf",
    onClick: limpiarFiltros
  }), /*#__PURE__*/React.createElement(Button, {
    className: "btn btn-phoenix-success fas fa-file-excel",
    onClick: limpiarFiltros
  })));
  const renderAccountItem = item => {
    const today = new Date();
    const dueDate = new Date(item.due_date);
    const daysToPay = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const status = daysToPay < 0 ? "overdue" : "pending";
    return /*#__PURE__*/React.createElement("div", {
      className: "p-3 border-bottom"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-center flex-wrap"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center gap-3 mb-2 mb-md-0"
    }, /*#__PURE__*/React.createElement("span", {
      className: "fw-bold"
    }, "FAC-", item.invoice_code), /*#__PURE__*/React.createElement("span", {
      className: "badge bg-secondary"
    }, item?.third_party?.name ?? "Sin cliente")), /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-end"
    }, /*#__PURE__*/React.createElement("small", {
      className: "text-muted d-block"
    }, "Fecha Factura"), /*#__PURE__*/React.createElement("span", null, obtenerFechaFormateada(item.created_at))), /*#__PURE__*/React.createElement("div", {
      className: "text-end"
    }, /*#__PURE__*/React.createElement("small", {
      className: "text-muted d-block"
    }, "Fecha Vencimiento"), /*#__PURE__*/React.createElement("span", {
      className: status === "overdue" ? "text-danger fw-bold" : ""
    }, obtenerFechaFormateada(item.due_date))), /*#__PURE__*/React.createElement("div", {
      className: "text-end"
    }, /*#__PURE__*/React.createElement("small", {
      className: "text-muted d-block"
    }, "Total"), /*#__PURE__*/React.createElement("span", {
      className: "fw-bold"
    }, formatoDinero(item.total_amount))), /*#__PURE__*/React.createElement("div", {
      className: "text-center"
    }, /*#__PURE__*/React.createElement("small", {
      className: "text-muted d-block"
    }, "Estado"), getStatusBadge(status, daysToPay)))), /*#__PURE__*/React.createElement("div", {
      className: "mt-3 row g-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "p-2 bg-light rounded"
    }, /*#__PURE__*/React.createElement("small", {
      className: "text-muted d-block"
    }, "Monto Total"), /*#__PURE__*/React.createElement("span", null, formatoDinero(item.total_amount)))), /*#__PURE__*/React.createElement("div", {
      className: "col-md-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "p-2 bg-light rounded"
    }, /*#__PURE__*/React.createElement("small", {
      className: "text-muted d-block"
    }, "Monto Pendiente"), /*#__PURE__*/React.createElement("span", null, formatoDinero(item.remaining_amount)))), /*#__PURE__*/React.createElement("div", {
      className: "col-md-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "p-2 bg-light rounded"
    }, /*#__PURE__*/React.createElement("small", {
      className: "text-muted d-block"
    }, "D\xEDas para pagar"), /*#__PURE__*/React.createElement("span", {
      className: daysToPay <= 5 ? "text-danger fw-bold" : ""
    }, daysToPay, " d\xEDas")))));
  };
  const renderAccordionItems = (items, loading) => {
    if (loading) {
      return /*#__PURE__*/React.createElement("div", {
        className: "d-flex justify-content-center align-items-center py-5"
      }, /*#__PURE__*/React.createElement("div", {
        className: "spinner-border text-primary",
        role: "status"
      }));
    }
    if (!items || items.length === 0) {
      return /*#__PURE__*/React.createElement("div", {
        className: "d-flex justify-content-center align-items-center py-5"
      }, /*#__PURE__*/React.createElement("p", {
        className: "text-muted"
      }, "No se encontraron registros con los filtros aplicados"));
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "accordion custom-accordion"
    }, items.map(item => {
      const isExpanded = expandedId === item.id.toString();
      const dueDate = new Date(item.due_date);
      const today = new Date();
      const daysToPay = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const status = daysToPay < 0 ? "overdue" : "pending";
      return /*#__PURE__*/React.createElement("div", {
        key: item.id,
        className: "accordion-item"
      }, /*#__PURE__*/React.createElement("h2", {
        className: "accordion-header"
      }, /*#__PURE__*/React.createElement("button", {
        className: `accordion-button ${isExpanded ? "" : "collapsed"}`,
        type: "button",
        onClick: () => setExpandedId(isExpanded ? null : item.id.toString())
      }, /*#__PURE__*/React.createElement("div", {
        className: "d-flex justify-content-between align-items-center w-100 pe-3"
      }, /*#__PURE__*/React.createElement("span", {
        className: "fw-bold"
      }, "FAC-", item.invoice_code), /*#__PURE__*/React.createElement("div", {
        className: "d-flex gap-4"
      }, /*#__PURE__*/React.createElement("span", null, obtenerFechaFormateada(item.due_date)), /*#__PURE__*/React.createElement("span", {
        className: "fw-bold"
      }, formatoDinero(item.total_amount)), getStatusBadge(status, daysToPay))))), /*#__PURE__*/React.createElement("div", {
        className: `accordion-collapse collapse ${isExpanded ? "show" : ""}`
      }, /*#__PURE__*/React.createElement("div", {
        className: "accordion-body p-0"
      }, renderAccountItem(item))), /*#__PURE__*/React.createElement("div", {
        className: "d-flex justify-content-end gap-2 mr-3"
      }, /*#__PURE__*/React.createElement(Button, {
        type: "button",
        raised: true,
        className: "mr-2",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fas fa-receipt"
        }),
        onClick: () => {
          generateReceipt(item);
        }
      }), /*#__PURE__*/React.createElement(Button, {
        type: "button",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fas fa-file-pdf"
        }),
        onClick: () => downloadPdf(item)
      })));
    }));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid py-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, "Gesti\xF3n de Cuentas")), /*#__PURE__*/React.createElement("div", {
    className: "card-body p-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion-item border-0"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "accordion-header"
  }, /*#__PURE__*/React.createElement("button", {
    className: "accordion-button collapsed",
    type: "button",
    "data-bs-toggle": "collapse",
    "data-bs-target": "#filtersCollapse"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-filter me-2"
  }), " Filtros")), /*#__PURE__*/React.createElement("div", {
    id: "filtersCollapse",
    className: "accordion-collapse collapse p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-lg-3 col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Cliente/Proveedor"), /*#__PURE__*/React.createElement(MultiSelect, {
    options: suppliers,
    optionLabel: "name",
    optionValue: "id",
    filter: true,
    placeholder: "Seleccione clientes/proveedores",
    className: "w-100",
    value: selectedSupplierIds,
    onChange: e => setSelectedSupplierIds(e.value),
    showClear: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-lg-3 col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Fecha de Factura"), /*#__PURE__*/React.createElement(Calendar, {
    selectionMode: "range",
    dateFormat: "dd/mm/yy",
    value: selectedDateRange,
    onChange: e => setSelectedDateRange(e.value),
    className: "w-100",
    placeholder: "Seleccione un rango"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-lg-3 col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Fecha de Vencimiento"), /*#__PURE__*/React.createElement(Calendar, {
    selectionMode: "range",
    dateFormat: "dd/mm/yy",
    value: selectedDueDateRange,
    onChange: e => setSelectedDueDateRange(e.value),
    className: "w-100",
    placeholder: "Seleccione un rango"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-lg-3 col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "D\xEDas para pagar"), /*#__PURE__*/React.createElement(Dropdown, {
    options: daysToPayOptions,
    optionLabel: "label",
    optionValue: "value",
    value: selectedDaysToPay,
    onChange: e => setSelectedDaysToPay(e.value),
    className: "w-100",
    placeholder: "Seleccione d\xEDas"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mt-3"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar",
    icon: "pi pi-trash",
    className: "btn btn-phoenix-secondary",
    onClick: limpiarFiltros
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Aplicar Filtros",
    icon: "pi pi-filter",
    className: "btn btn-primary",
    onClick: aplicarFiltros
  }))))), /*#__PURE__*/React.createElement(TabView, {
    activeIndex: activeTab,
    onTabChange: e => setActiveTab(e.index)
  }, /*#__PURE__*/React.createElement(TabPanel, {
    header: "Cuentas por Cobrar",
    className: "p-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 me-3"
  }, /*#__PURE__*/React.createElement(Button, {
    tooltip: "Exportar a excel - general",
    tooltipOptions: {
      position: "top"
    },
    type: "button",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-file-excel"
    }),
    onClick: () => {
      downloadExcelGeneral(accountsReceivable, "Cuentas_por_Cobrar");
    }
  }), /*#__PURE__*/React.createElement(Button, {
    tooltip: "Exportar a pdf - general",
    tooltipOptions: {
      position: "top"
    },
    type: "button",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-file-pdf"
    }),
    onClick: () => downloadPdfGeneral(accountsReceivable, "Cuentas_por_Cobrar")
  })), /*#__PURE__*/React.createElement("hr", {
    className: "m-2"
  }), renderAccordionItems(accountsReceivable, loadingReceivable), /*#__PURE__*/React.createElement(Paginator, {
    first: first,
    rows: rows,
    totalRecords: totalReceivable,
    rowsPerPageOptions: [10, 20, 30, 50],
    onPageChange: onPageChange
  })), /*#__PURE__*/React.createElement(TabPanel, {
    header: "Cuentas por Pagar",
    className: "p-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 me-3"
  }, /*#__PURE__*/React.createElement(Button, {
    tooltip: "Exportar a excel - general",
    tooltipOptions: {
      position: "top"
    },
    type: "button",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-file-excel"
    }),
    onClick: () => {
      downloadExcelGeneral(accountsPayable, "Cuentas_por_Pagar");
    }
  }), /*#__PURE__*/React.createElement(Button, {
    tooltip: "Exportar a pdf - general",
    tooltipOptions: {
      position: "top"
    },
    type: "button",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-file-pdf"
    }),
    onClick: () => downloadPdfGeneral(accountsPayable, "Cuentas_por_Pagar")
  })), /*#__PURE__*/React.createElement("hr", {
    className: "m-2"
  }), renderAccordionItems(accountsPayable, loadingPayable), /*#__PURE__*/React.createElement(Paginator, {
    first: first,
    rows: rows,
    totalRecords: totalPayable,
    rowsPerPageOptions: [10, 20, 30, 50],
    onPageChange: onPageChange
  }))))), /*#__PURE__*/React.createElement(NewReceiptBoxModal, {
    visible: showReceiptModal,
    onHide: () => {
      setShowReceiptModal(false);
      setInvoiceToReceipt(null);
    },
    onSubmit: handleGenerarRecibo,
    onSaveAndDownload: handleGenerarRecibo,
    initialData: {
      cliente: invoiceToReceipt?.third_party?.id?.toString() || "",
      idFactura: invoiceToReceipt?.id || 0,
      numeroFactura: invoiceToReceipt?.invoice_code || "",
      fechaElaboracion: invoiceToReceipt?.created_at || new Date(),
      valorPagado: invoiceToReceipt?.remaining_amount || 0,
      centreCost: invoiceToReceipt?.centre_cost || null,
      invoiceType: invoiceType || ""
    }
  }));
};