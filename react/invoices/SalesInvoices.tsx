import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { MenuItem } from "primereact/menuitem";
import { SplitButton } from "primereact/splitbutton";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { useThirdParties } from "../billing/third-parties/hooks/useThirdParties";
import { InvoiceService } from "../../services/api/classes/invoiceService";
import { cleanJsonObject } from "../../services/utilidades";
import { NewReceiptBoxModal } from "../accounting/paymentReceipt/modals/NewReceiptBoxModal";
import { generatePDFFromHTML } from "../../funciones/funcionesJS/exportPDF";
import { useCompany } from "../hooks/useCompany";
import { CustomModal } from "../components/CustomModal";
import { FormDebitCreditNotes } from "../invoices/form/FormDebitCreditNotes";
import { generarFormatoContable } from "../../funciones/funcionesJS/generarPDFContable";

interface FacturaVenta {
  id: number;
  numeroFactura: string;
  fecha: Date;
  cliente: string;
  monto: number;
  remainingAmount: number;
  paid: number;
  tipoFactura: string;
  estado: string;
  rncCliente: string;
  formaPago?: string;
  details: null;
  payments: null;
  third_party: {
    id: number;
    name: string;
  } | null;
  centre_cost: any;
  notes: any[];
  adjustedType: string;
}

export const SalesInvoices = () => {
  const { thirdParties } = useThirdParties();

  // Estado para los datos de la tabla
  const [facturas, setFacturas] = useState<FacturaVenta[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showReciboModal, setShowReciboModal] = useState<boolean>(false);
  const [facturaParaRecibo, setFacturaParaRecibo] =
    useState<FacturaVenta | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [invoiceToNote, setInvoiceToNote] = useState<any>(null);

  const [lazyState, setLazyState] = useState({
    first: 0,
    rows: 10,
    page: 1,
  });

  const { company, setCompany, fetchCompany } = useCompany();

  // Estado para los filtros
  const [filtros, setFiltros] = useState({
    numeroFactura: "",
    cliente: "",
    fechaRango: null,
    tipoFactura: null,
    estado: null,
    montoMinimo: null,
    montoMaximo: null,
  });

  const toast = useRef<Toast>(null);

  const estadosFactura = [
    { label: "Pendiente", value: "pending" },
    { label: "Parcialmente Pendiente", value: "partially_pending" },
    { label: "Pagada", value: "paid" },
    { label: "Anulada", value: "cancelled" },
    { label: "Vencida", value: "expired" },
  ];

  // Manejadores de cambio de filtros
  const handleFilterChange = (field, value) => {
    setFiltros((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onPage = (event) => {
    setLazyState({
      ...lazyState,
      first: event.first,
      rows: event.rows,
      page: event.page + 1,
    });
    aplicarFiltros(event.page + 1, event.rows);
  };

  const handlePageChange = (page) => {
    aplicarFiltros(page.page + 1, page.rows);
  };

  // Función para aplicar filtros
  const aplicarFiltros = async (page = 1, per_page = 10) => {
    setLoading(true);

    // Procesar el rango de fechas
    let dateFrom: string | null = null;
    let dateTo: string | null = null;

    if (filtros.fechaRango && filtros.fechaRango[0] && filtros.fechaRango[1]) {
      dateFrom = (filtros.fechaRango[0] as Date).toISOString().split("T")[0];
      dateTo = (filtros.fechaRango[1] as Date).toISOString().split("T")[0];
    }

    const invoiceService = new InvoiceService();
    const filterInvoiceParams = {
      createdAt: dateFrom && dateTo ? `${dateFrom},${dateTo}` : null,
      invoiceCode: filtros.numeroFactura || null,
      status: filtros.estado || null,
      thirdParty: filtros.cliente || null,
      type: "sale",
      page,
      per_page,
    };

    try {
      const response = await invoiceService.filterInvoices(
        cleanJsonObject(filterInvoiceParams)
      );
      setFacturas(
        response.data.map((invoice) => mapInvoiceResponseToUI(invoice))
      );
      setTotalRecords(response.total);
    } catch (error) {
      console.error("Error al obtener facturas:", error);
    } finally {
      setLoading(false);
    }
  };

  function mapInvoiceResponseToUI(response: any): FacturaVenta {
    return {
      id: response.id.toString(),
      numeroFactura: response.invoice_code,
      fecha: new Date(response.created_at),
      cliente: response.third_party?.name || "Sin cliente",
      monto: parseFloat(response.total_amount),
      remainingAmount: parseFloat(response.remaining_amount),
      paid:
        parseFloat(response.total_amount) -
        parseFloat(response.remaining_amount),
      tipoFactura: response.type === "public" ? "Pública" : "Privada",
      estado: response.status,
      rncCliente: response.third_party?.rnc || "N/A",
      formaPago:
        response.payments
          .map((payment: any) => payment.payment_method.method)
          .join("") || "N/A",
      details: response?.details || [],
      payments: response?.payments,
      third_party: response.third_party,
      centre_cost: response.centre_cost || null,
      notes: response.notes || [],
      adjustedType:
        response?.notes && response.notes.length
          ? response.notes
              .map((note) => {
                note.name = "";
                note.type == "debit"
                  ? (note.name = "Débito")
                  : (note.name = "Crédito");
                return `${note.name}`;
              })
              .join(", ")
          : "Sin ajuste",
    };
  }

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      numeroFactura: "",
      cliente: "",
      fechaRango: null,
      tipoFactura: null,
      estado: null,
      montoMinimo: null,
      montoMaximo: null,
    });
    // Volver a cargar los datos sin filtros
    aplicarFiltros(1, lazyState.rows);
  };

  // Formatear número para montos en pesos dominicanos (DOP)
  const formatCurrency = (value) => {
    return value.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Formatear fecha
  const formatDate = (value) => {
    return value.toLocaleDateString("es-DO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Funciones para las acciones
  const generateReceipt = (invoice: FacturaVenta) => {
    setFacturaParaRecibo(invoice);
    setShowReciboModal(true);
  };

  const handleGenerarRecibo = (formData: any) => {
    showToast(
      "success",
      "Éxito",
      `Recibo generado para ${facturaParaRecibo?.numeroFactura}`
    );
    setShowReciboModal(false);
    setFacturaParaRecibo(null);
  };

  const downloadExcel = (invoice: FacturaVenta) => {
    showToast(
      "success",
      "Éxito",
      `Descargando Excel para ${invoice.numeroFactura}`
    );
    // Aquí iría la llamada a la API para descargar Excel
  };

  const printInvoice = (invoice: FacturaVenta) => {
    const namePDF = `Factura ${invoice.numeroFactura}.`;
    const companyData = {
      legal_name: "Centro Oriental de Diabetes y Endocrinologia",
      document_type: "RNC",
      document_number: "123003994",
      address: "Avenida Presidente Estrella Ureña No. 109",
      phone: "8095961335",
      email: "info@cenode.com.do",
    };
    let dataCompany = {};
    if (company) {
      dataCompany = company;
    } else {
      dataCompany = companyData;
    }
    const pdfConfigView = {
      name: namePDF,
      isDownload: false,
    };

    const htmlInvoice = `
<style>
  .invoice-header { width: 100%; }
  .invoice-title { margin: 0; }
  .invoice-date { margin: 0; text-align: right; }
  .invoice-client { margin: 0; }
  .invoice-table { 
    width: 100%; 
    border-collapse: collapse; 
    margin-top: 1rem; 
  }
  .table-header {
    background-color: #132030;
    color: white;
    padding: 8px;
    text-align: left;
  }
  .table-cell {
    padding: 8px;
    border-bottom: 1px solid #ccc;
  }

  .seccion-final {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }

        .info-qr {
            width: 40%;
        }

        .qr-image {
            width: 120px;
            height: 120px;
            background-color: #f0f0f0;
            border: 1px dashed #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
        }

        .codigo-seguridad {
            font-weight: bold;
            margin-bottom: 15px;
        }

        .fecha-firma {
            font-style: italic;
        }

        .totales {
            text-align: right;
            width: 65%;
        }

        .fila-total {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 5px;
        }

        .etiqueta-total {
            font-weight: bold;
            width: 150px;
        }

        .valor-total {
            width: 120px;
            text-align: right;
        }
</style>

<div>
  <table class="invoice-header">
    <tr>
      <td><h3 class="invoice-title">Factura de venta #${
        invoice.numeroFactura
      }</h3></td>
      <td class="invoice-date">Fecha: ${formatDate(invoice.fecha)}</td>
    </tr>
  </table>
  
  <p class="invoice-client"><strong>Cliente:</strong> ${
    invoice.cliente || "Sin cliente"
  }</p>
  <p class="invoice-client"><strong>Identificación:</strong> ${
    invoice.third_party?.document_type || "N/A"
  }-${invoice.third_party?.document_number || "-"}</p>
  <p class="invoice-client"><strong>Teléfono:</strong> ${
    invoice.third_party?.phone || "--"
  }</p>
  <p class="invoice-client"><strong>Correo:</strong> ${
    invoice.third_party?.email || "--"
  }</p>
  
  <table class="invoice-table">
    <thead>
      <tr>
        <th class="table-header">Cantidad</th>
        <th class="table-header">Descripción</th>
        <th class="table-header">Precio Unitario</th>
        <th class="table-header">ITBIS</th>
        <th class="table-header">Valor</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.details
        .map(
          (detail) => `
        <tr>
          <td class="table-cell">${detail.quantity}</td>
          <td class="table-cell">${detail.description || "Sin descripción"}</td>
          <td class="table-cell">${formatCurrency(
            parseFloat(detail.unit_price) || 0
          )}</td>
          <td class="table-cell">${formatCurrency(detail.tax || 0)}</td>
          <td class="table-cell">${formatCurrency(
            detail.unit_price * detail.quantity || 0
          )}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
</div>

        <h4>Pagos</h4>
  <table class="invoice-table">
    <thead>
      <tr>
        <th class="table-header">Valor</th>
        <th class="table-header">Metodo</th>
        <th class="table-header">Fecha</th>
      </tr>
    </thead>
    <tbody>
    ${invoice.payments
      .map(
        (payment) => `
        <tr>
        <td class="table-cell">${formatCurrency(
          parseFloat(payment.amount) || 0
        )}</td>
        <td class="table-cell">${payment.payment_method.method}</td>
        <td class="table-cell">${payment.payment_date}</td>
        </tr>
      `
      )
      .join("")}
    </tbody>
    </table>


<table style="width: 100%; margin-top: 20px;">
  <tr>
    <td style="width: 50%; vertical-align: top;">
      <div style="width: 120px; height: 120px; background-color: #f0f0f0; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
        [Código QR]
      </div>
      <div style="font-weight: bold; margin-bottom: 15px;">
        Código de seguridad: S/DQdu
      </div>
    </td>

      <td style="width: 50%; vertical-align: top; text-align: right;">
      <table style="width: 100%;">
        <tr>
          <td style="font-weight: bold;">Subtotal gravado: ${formatCurrency(
            invoice.monto || 0
          )}</td>
        </tr>
        <tr>
          <td style="font-weight: bold;">ITBIS: ${formatCurrency(0)}</td>
        </tr>
        <tr>
          <td style="font-weight: bold;">Total: ${formatCurrency(
            invoice.monto || 0
          )}</td>
        </tr>
      </table>
    </td>
  </tr>
</table>
    `;
    // showToast(
    //   "success",
    //   "Éxito",
    //   `Preparando factura ${invoice.numeroFactura} para impresión`
    // );
    // Aquí iría la llamada a la API para imprimir
    // generatePDFFromHTML(htmlInvoice, dataCompany, pdfConfigView);
    generarFormatoContable("FacturaVenta", invoice, "Impresion");
  };

  const downloadPdf = (invoice: FacturaVenta) => {
    const namePDF = `Factura ${invoice.numeroFactura}.`;
    const companyData = {
      legal_name: "Centro Oriental de Diabetes y Endocrinologia",
      document_type: "RNC",
      document_number: "123003994",
      address: "Avenida Presidente Estrella Ureña No. 109",
      phone: "8095961335",
      email: "info@cenode.com.do",
    };
    let dataCompany = {};
    if (company) {
      dataCompany = company;
    } else {
      dataCompany = companyData;
    }

    const pdfConfigDown = {
      name: namePDF,
      isDownload: true,
    };
    const htmlInvoice = `
<style>
  .invoice-header { width: 100%; }
  .invoice-title { margin: 0; }
  .invoice-date { margin: 0; text-align: right; }
  .invoice-client { margin: 0; }
  .invoice-table { 
    width: 100%; 
    border-collapse: collapse; 
    margin-top: 1rem; 
  }
  .table-header {
    background-color: #132030;
    color: white;
    padding: 8px;
    text-align: left;
  }
  .table-cell {
    padding: 8px;
    border-bottom: 1px solid #ccc;
  }

  .seccion-final {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }

        .info-qr {
            width: 40%;
        }

        .qr-image {
            width: 120px;
            height: 120px;
            background-color: #f0f0f0;
            border: 1px dashed #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
        }

        .codigo-seguridad {
            font-weight: bold;
            margin-bottom: 15px;
        }

        .fecha-firma {
            font-style: italic;
        }

        .totales {
            text-align: right;
            width: 65%;
        }

        .fila-total {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 5px;
        }

        .etiqueta-total {
            font-weight: bold;
            width: 150px;
        }

        .valor-total {
            width: 120px;
            text-align: right;
        }
</style>

<div>
  <table class="invoice-header">
    <tr>
      <td><h3 class="invoice-title">Factura de venta #${
        invoice.numeroFactura
      }</h3></td>
      <td class="invoice-date">Fecha: ${formatDate(invoice.fecha)}</td>
    </tr>
  </table>
  
  <p class="invoice-client"><strong>Cliente:</strong> ${
    invoice.cliente || "Sin cliente"
  }</p>
  <p class="invoice-client"><strong>Identificación:</strong> ${
    invoice.third_party?.document_type || "N/A"
  }-${invoice.third_party?.document_number || "-"}</p>
  <p class="invoice-client"><strong>Teléfono:</strong> ${
    invoice.third_party?.phone || "--"
  }</p>
  <p class="invoice-client"><strong>Correo:</strong> ${
    invoice.third_party?.email || "--"
  }</p>
  
  <table class="invoice-table">
    <thead>
      <tr>
        <th class="table-header">Cantidad</th>
        <th class="table-header">Descripción</th>
        <th class="table-header">Precio Unitario</th>
        <th class="table-header">ITBIS</th>
        <th class="table-header">Valor</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.details
        .map(
          (detail) => `
        <tr>
          <td class="table-cell">${detail.quantity}</td>
          <td class="table-cell">${detail.description || "Sin descripción"}</td>
          <td class="table-cell">${formatCurrency(
            parseFloat(detail.unit_price) || 0
          )}</td>
          <td class="table-cell">${formatCurrency(detail.tax || 0)}</td>
          <td class="table-cell">${formatCurrency(
            detail.unit_price * detail.quantity || 0
          )}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
</div>

        <h4>Pagos</h4>
  <table class="invoice-table">
    <thead>
      <tr>
        <th class="table-header">Valor</th>
        <th class="table-header">Metodo</th>
        <th class="table-header">Fecha</th>
      </tr>
    </thead>
    <tbody>
    ${invoice.payments
      .map(
        (payment) => `
        <tr>
        <td class="table-cell">${formatCurrency(
          parseFloat(payment.amount) || 0
        )}</td>
        <td class="table-cell">${payment.payment_method.method}</td>
        <td class="table-cell">${payment.payment_date}</td>
        </tr>
      `
      )
      .join("")}
    </tbody>
    </table>


<table style="width: 100%; margin-top: 20px;">
  <tr>
    <td style="width: 50%; vertical-align: top;">
      <div style="width: 120px; height: 120px; background-color: #f0f0f0; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
        [Código QR]
      </div>
      <div style="font-weight: bold; margin-bottom: 15px;">
        Código de seguridad: S/DQdu
      </div>
    </td>

      <td style="width: 50%; vertical-align: top; text-align: right;">
      <table style="width: 100%;">
        <tr>
          <td style="font-weight: bold;">Subtotal gravado: ${formatCurrency(
            invoice.monto || 0
          )}</td>
        </tr>
        <tr>
          <td style="font-weight: bold;">ITBIS: ${formatCurrency(0)}</td>
        </tr>
        <tr>
          <td style="font-weight: bold;">Total: ${formatCurrency(
            invoice.monto || 0
          )}</td>
        </tr>
      </table>
    </td>
  </tr>
</table>
    `;
    // showToast(
    //   "success",
    //   "Éxito",
    //   `Descargando PDF de ${invoice.numeroFactura}`
    // );
    // Aquí iría la llamada a la API para generar el PDF
    generatePDFFromHTML(htmlInvoice, dataCompany, pdfConfigDown);
  };

  function generateDebitNote(invoice) {
    invoice.noteType = { id: "DEBIT", name: "Débito" };
    setInvoiceToNote(invoice);
    setShowModal(true);
  }

  function generateCreditNote(invoice) {
    invoice.noteType = { id: "CREDIT", name: "Crédito" };
    setInvoiceToNote(invoice);
    setShowModal(true);
  }

  const createActionTemplate = (
    icon: string,
    label: string,
    colorClass: string = ""
  ) => {
    return () => (
      <div
        className="flex align-items-center gap-2 p-2 point"
        style={{ cursor: "pointer" }} // Agrega el cursor pointer aquí
      >
        <i className={`fas fa-${icon} ${colorClass}`} />
        <span>{label}</span>
      </div>
    );
  };

  function handleNoteSuccess() {
    toast.current?.show({
      severity: "success",
      summary: "Éxito",
      detail: "Nota crédito guardada",
      life: 2000,
    });
    setTimeout(() => {
      setShowModal(false);
      aplicarFiltros(lazyState.page, lazyState.rows);
    }, 1000);
  }

  // Acciones para cada fila

  const actionBodyTemplate = (rowData: FacturaVenta) => {
    const items: MenuItem[] = [
      {
        label: "Generar Recibo",
        template: createActionTemplate(
          "receipt",
          "Generar Recibo",
          "text-green-500"
        ),
        command: () => generateReceipt(rowData),
      },
      {
        label: "Generar Nota Debito",
        template: createActionTemplate(
          "money-bill-transfer",
          "Generar Nota Debito",
          "text-green-500"
        ),
        command: () => generateDebitNote(rowData),
        visible: rowData.notes.length ? false : true,
      },
      {
        label: "Generar Nota credito",
        template: createActionTemplate(
          "money-bill-transfer",
          "Generar Nota Credito",
          "text-green-500"
        ),
        command: () => generateCreditNote(rowData),
        visible: rowData.notes.length ? false : true,
      },
      {
        label: "Descargar Excel",
        template: createActionTemplate(
          "file-excel",
          "Descargar Excel",
          "text-green-600"
        ),
        command: () => downloadExcel(rowData),
      },
      {
        label: "Imprimir",
        template: createActionTemplate("print", "Imprimir", "text-blue-500"),
        command: () => printInvoice(rowData),
      },
      {
        label: "Descargar PDF",
        template: createActionTemplate(
          "file-pdf",
          "Descargar PDF",
          "text-red-500"
        ),
        command: () => downloadPdf(rowData),
      },
    ];

    return (
      <SplitButton
        label="Acciones"
        icon="pi pi-cog"
        model={items}
        severity="contrast"
        className="p-button-sm point"
        buttonClassName="p-button-sm"
        menuButtonClassName="p-button-sm point"
        menuStyle={{ minWidth: "220px", cursor: "pointer" }}
      />
    );
  };

  const showToast = (severity: string, summary: string, detail: string) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  // Estilo para los tags de estado
  const getEstadoSeverity = (estado) => {
    switch (estado) {
      case "paid":
        return "success";
      case "pending":
      case "partially_pending":
        return "warning";
      case "cancelled":
        return "danger";
      case "expired":
        return "danger";
      default:
        return null;
    }
  };

  const getEstadoLabel = (estado) => {
    switch (estado) {
      case "paid":
        return "Pagada";
      case "pending":
        return "Pendiente";
      case "partially_pending":
        return "Parcialmente Pendiente";
      case "cancelled":
        return "Anulada";
      case "expired":
        return "Vencida";
      default:
        return "";
    }
  };

  // Estilos integrados
  const styles = {
    card: {
      marginBottom: "20px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
    },
    cardTitle: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#333",
    },
    tableHeader: {
      backgroundColor: "#f8f9fa",
      color: "#495057",
      fontWeight: 600,
    },
    tableCell: {
      padding: "0.75rem 1rem",
    },
    formLabel: {
      fontWeight: 500,
      marginBottom: "0.5rem",
      display: "block",
    },
  };

  useEffect(() => {
    aplicarFiltros(lazyState.page, lazyState.rows);
  }, [lazyState.page, lazyState.rows]);

  return (
    <div
      className="container-fluid mt-4"
      style={{ width: "100%", padding: "0 15px" }}
    >
      <Toast ref={toast} />

      <div
        style={{ display: "flex", justifyContent: "flex-end", margin: "10px" }}
      >
        <Button
          label="Nuevo Facturación Venta"
          icon="pi pi-file-edit"
          className="btn btn-primary"
          onClick={() => (window.location.href = "Facturacion_Ventas")}
        />
      </div>
      <Card title="Filtros de Búsqueda" style={styles.card}>
        <div className="row g-3">
          {/* Filtro: Número de factura */}
          <div className="col-md-6 col-lg-3">
            <label style={styles.formLabel}>Número de factura</label>
            <InputText
              value={filtros.numeroFactura}
              onChange={(e) =>
                handleFilterChange("numeroFactura", e.target.value)
              }
              placeholder="B01-001-0000001"
              className="w-100"
            />
          </div>

          {/* Filtro: Cliente */}
          <div className="col-md-6 col-lg-3">
            <label style={styles.formLabel}>Cliente</label>
            <Dropdown
              value={filtros.cliente}
              onChange={(e) => handleFilterChange("cliente", e.target.value)}
              options={thirdParties}
              optionLabel="name"
              optionValue="id"
              placeholder="Seleccione un proveedor"
              className={classNames("w-100")}
            />
          </div>

          {/* Filtro: Rango de fechas */}
          <div className="col-md-6 col-lg-3">
            <label style={styles.formLabel}>Rango de fechas</label>
            <Calendar
              value={filtros.fechaRango}
              onChange={(e) => handleFilterChange("fechaRango", e.value)}
              selectionMode="range"
              readOnlyInput
              dateFormat="dd/mm/yy"
              placeholder="Seleccione un rango"
              className={classNames("w-100")}
              showIcon
            />
          </div>

          {/* Filtro: Estado */}
          <div className="col-md-6 col-lg-3">
            <label style={styles.formLabel}>Estado</label>
            <Dropdown
              value={filtros.estado}
              options={estadosFactura}
              onChange={(e) => handleFilterChange("estado", e.value)}
              optionLabel="label"
              placeholder="Seleccione estado"
              className="w-100"
            />
          </div>

          {/* Botones de acción */}
          <div className="col-12 d-flex justify-content-end gap-2">
            <Button
              label="Limpiar"
              icon="pi pi-trash"
              className="btn btn-phoenix-secondary"
              onClick={limpiarFiltros}
            />
            <Button
              label="Aplicar Filtros"
              icon="pi pi-filter"
              className="btn btn-primary"
              onClick={() => aplicarFiltros()}
              loading={loading}
            />
          </div>
        </div>
      </Card>
      {/* Tabla de resultados */}
      <Card title="Facturas de Venta" style={styles.card}>
        <DataTable
          value={facturas}
          lazy
          paginator
          first={lazyState.first}
          rows={lazyState.rows}
          totalRecords={totalRecords}
          onPage={onPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          loading={loading}
          className="p-datatable-striped p-datatable-gridlines"
          emptyMessage="No se encontraron facturas"
          responsiveLayout="scroll"
          tableStyle={{ minWidth: "10rem", width: "100%" }}
        >
          <Column
            field="numeroFactura"
            header="Factura"
            sortable
            style={styles.tableCell}
          />
          <Column
            field="fecha"
            header="Fecha"
            sortable
            body={(rowData) => formatDate(rowData.fecha)}
            style={styles.tableCell}
          />
          <Column
            field="cliente"
            header="Cliente"
            sortable
            style={styles.tableCell}
          />
          <Column
            field="paid"
            header="Pagado"
            sortable
            body={(rowData) => formatCurrency(rowData.paid)}
            style={styles.tableCell}
          />
          <Column
            field="remainingAmount"
            header="Restante"
            sortable
            body={(rowData) => formatCurrency(rowData.remainingAmount)}
            style={styles.tableCell}
          />
          <Column
            field="monto"
            header="Monto"
            sortable
            body={(rowData) => formatCurrency(rowData.monto)}
            style={styles.tableCell}
          />
          <Column
            field="adjustedType"
            header="Ajuste"
            sortable
            style={styles.tableCell}
          />
          <Column
            field="estado"
            header="Estado"
            sortable
            body={(rowData) => (
              <Tag
                value={getEstadoLabel(rowData.estado)}
                severity={getEstadoSeverity(rowData.estado)}
              />
            )}
            style={{ width: "100px" }}
          />
          <Column
            body={actionBodyTemplate}
            header="Acciones"
            style={{ width: "100px" }}
            exportable={false}
          />
        </DataTable>
      </Card>

      <NewReceiptBoxModal
        visible={showReciboModal}
        onHide={() => {
          setShowReciboModal(false);
          setFacturaParaRecibo(null);
          aplicarFiltros();
        }}
        onSubmit={handleGenerarRecibo}
        onSaveAndDownload={handleGenerarRecibo}
        initialData={{
          cliente: facturaParaRecibo?.third_party?.id?.toString() || "",
          idFactura: facturaParaRecibo?.id || 0,
          numeroFactura: facturaParaRecibo?.numeroFactura || "",
          fechaElaboracion: facturaParaRecibo?.fecha || new Date(),
          valorPagado: facturaParaRecibo?.monto || 0,
          centreCost: facturaParaRecibo?.centre_cost || null,
          invoiceType: "sale-invoice",
        }}
      />
      <CustomModal
        title="Generar Factura"
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <FormDebitCreditNotes
          initialData={invoiceToNote}
          onSuccess={handleNoteSuccess}
        ></FormDebitCreditNotes>
      </CustomModal>
    </div>
  );
};
