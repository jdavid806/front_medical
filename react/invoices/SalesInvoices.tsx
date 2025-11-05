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
import { CustomPRTable, CustomPRTableColumnProps } from "../components/CustomPRTable";
import { useThirdParties } from "../billing/third-parties/hooks/useThirdParties";
import { InvoiceService } from "../../services/api/classes/invoiceService";
import { cleanJsonObject } from "../../services/utilidades";
import { NewReceiptBoxModal } from "../accounting/paymentReceipt/modals/NewReceiptBoxModal";
import { FormDebitCreditNotes } from "../invoices/form/FormDebitCreditNotes";
import { useSaleInvoicesFormat } from "../documents-generation/hooks/billing/invoices/useSaleInvoiceFormat";

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
  subtotal?: number;
  discount?: number;
  tax?: number;
  withholding_tax?: number;
}

export const SalesInvoices = () => {
  const { thirdParties } = useThirdParties();

  // Estado para los datos de la tabla
  const [facturas, setFacturas] = useState<FacturaVenta[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showReciboModal, setShowReciboModal] = useState<boolean>(false);
  const [facturaParaRecibo, setFacturaParaRecibo] = useState<FacturaVenta | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [invoiceToNote, setInvoiceToNote] = useState<any>(null);
  const [globalFilter, setGlobalFilter] = useState("");

  // Pagination state
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  const { generateFormatSaleInvoices } = useSaleInvoicesFormat();
  const generateInvoiceRef = useRef(generateFormatSaleInvoices);

  useEffect(() => {
    generateInvoiceRef.current = generateFormatSaleInvoices;
  }, [generateFormatSaleInvoices]);

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
    { label: "Parcialmente Pagada", value: "partially_pending" },
    { label: "Pagada", value: "paid" },
    { label: "Anulada", value: "cancelled" },
    { label: "Vencida", value: "expired" },
  ];

  // Manejadores de cambio de filtros
  const handleFilterChange = (field: string, value: any) => {
    setFiltros((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onPageChange = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
    aplicarFiltros(event.page + 1, event.rows);
  };

  // Función para aplicar filtros
  const aplicarFiltros = async (page = 1, per_page = 10) => {
    setTableLoading(true);

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
      sort: "-id",
    };

    try {
      const response = await invoiceService.filterInvoices(
        cleanJsonObject(filterInvoiceParams)
      );
      setFacturas(
        response.data.map((invoice: any) => mapInvoiceResponseToUI(invoice))
      );
      setTotalRecords(response.total);
    } catch (error) {
      console.error("Error al obtener facturas:", error);
    } finally {
      setTableLoading(false);
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
      subtotal: parseFloat(response.subtotal),
      discount: parseFloat(response.discount),
      tax: parseFloat(response.iva),
      withholding_tax: parseFloat(response.withholdings),
      adjustedType:
        response?.notes && response.notes.length
          ? response.notes
            .map((note: any) => {
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
    aplicarFiltros(1, rows);
  };

  // Formatear número para montos en pesos dominicanos (DOP)
  const formatCurrency = (value: number) => {
    return value.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Formatear fecha
  const formatDate = (value: Date) => {
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

  const printInvoice = useCallback(
    async (invoice: any) => {
      generateInvoiceRef.current(invoice, "Impresion");
    },
    [generateFormatSaleInvoices]
  );

  const downloadPdf = useCallback(
    async (invoice: any) => {
      generateInvoiceRef.current(invoice, "Descargar");
    },
    [generateFormatSaleInvoices]
  );

  function generateDebitNote(invoice: any) {
    invoice.noteType = { id: "DEBIT", name: "Débito" };
    setInvoiceToNote(invoice);
    setShowModal(true);
  }

  function generateCreditNote(invoice: any) {
    invoice.noteType = { id: "CREDIT", name: "Crédito" };
    setInvoiceToNote(invoice);
    setShowModal(true);
  }

  function handleNoteSuccess() {
    toast.current?.show({
      severity: "success",
      summary: "Éxito",
      detail: "Nota crédito guardada",
      life: 2000,
    });
    setTimeout(() => {
      setShowModal(false);
      aplicarFiltros(Math.floor(first / rows) + 1, rows);
    }, 1000);
  }

  const TableMenu: React.FC<{
    rowData: FacturaVenta;
  }> = ({ rowData }) => {
    const menu = useRef<Menu>(null);

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

    const menuItems = [
      {
        label: "Generar Recibo",
        icon: <i className="fas fa-receipt me-2"></i>,
        command: handleGenerateReceipt,
      },
      {
        label: "Generar Nota Débito",
        icon: <i className="fas fa-file-invoice-dollar me-2"></i>,
        command: handleGenerateDebitNote,
        disabled: rowData.notes.length > 0
      },
      {
        label: "Generar Nota Crédito",
        icon: <i className="fas fa-file-invoice me-2"></i>,
        command: handleGenerateCreditNote,
        disabled: rowData.notes.length > 0
      },
      {
        label: "Descargar Excel",
        icon: <i className="fas fa-file-excel me-2"></i>,
        command: handleDownloadExcel,
      },
      {
        label: "Imprimir",
        icon: <i className="fas fa-print me-2"></i>,
        command: handlePrintInvoice,
      },
      {
        label: "Descargar PDF",
        icon: <i className="fas fa-file-pdf me-2"></i>,
        command: handleDownloadPdf,
      }
    ];

    return (
      <div style={{ position: "relative" }}>
        <Button
          className="p-button-primary flex items-center gap-2"
          onClick={(e) => menu.current?.toggle(e)}
          aria-controls={`popup_menu_${rowData.id}`}
          aria-haspopup
        >
          Acciones
          <i className="fas fa-cog ml-2"></i>
        </Button>
        <Menu
          model={menuItems}
          popup
          ref={menu}
          id={`popup_menu_${rowData.id}`}
          appendTo={document.body}
          style={{ zIndex: 9999 }}
        />
      </div>
    );
  };

  const actionBodyTemplate = (rowData: FacturaVenta) => {
    return (
      <div
        className="flex align-items-center justify-content-center"
        style={{ gap: "0.5rem", minWidth: "120px" }}
      >
        <TableMenu rowData={rowData} />
      </div>
    );
  };

  const showToast = (severity: "success" | "error" | "info" | "warn", summary: string, detail: string) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  // Estilo para los tags de estado
  const getEstadoSeverity = (estado: string) => {
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

  const getEstadoLabel = (estado: string) => {
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

  // Mapear los datos para la tabla
  const tableItems = facturas.map(factura => ({
    id: factura.id,
    numeroFactura: factura.numeroFactura,
    fecha: factura.fecha,
    cliente: factura.cliente,
    paid: factura.paid,
    remainingAmount: factura.remainingAmount,
    monto: factura.monto,
    adjustedType: factura.adjustedType,
    estado: factura.estado,
    actions: factura
  }));

  const columns: CustomPRTableColumnProps[] = [
    {
      field: 'numeroFactura',
      header: 'Factura',
      sortable: true
    },
    {
      field: 'fecha',
      header: 'Fecha',
      sortable: true,
      body: (rowData: any) => formatDate(rowData.fecha)
    },
    {
      field: 'cliente',
      header: 'Cliente',
      sortable: true
    },
    {
      field: 'paid',
      header: 'Pagado',
      sortable: true,
      body: (rowData: any) => formatCurrency(rowData.paid)
    },
    {
      field: 'remainingAmount',
      header: 'Restante',
      sortable: true,
      body: (rowData: any) => formatCurrency(rowData.remainingAmount)
    },
    {
      field: 'monto',
      header: 'Monto',
      sortable: true,
      body: (rowData: any) => formatCurrency(rowData.monto)
    },
    {
      field: 'adjustedType',
      header: 'Ajuste',
      sortable: true
    },
    {
      field: 'estado',
      header: 'Estado',
      sortable: true,
      body: (rowData: any) => (
        <Tag
          value={getEstadoLabel(rowData.estado)}
          severity={getEstadoSeverity(rowData.estado)}
        />
      )
    },
    {
      field: 'actions',
      header: 'Acciones',
      body: (rowData: any) => actionBodyTemplate(rowData.actions),
      exportable: false,
      width: "120px"
    }
  ];

  const handleSearchChange = (searchValue: string) => {
    setGlobalFilter(searchValue);
  };

  const handleRefresh = async () => {
    limpiarFiltros();
    await aplicarFiltros(1, rows);
  };

  useEffect(() => {
    aplicarFiltros(1, rows);
  }, []);

  return (
    <main className="main w-100" id="top">
      <Toast ref={toast} />

      {loading ? (
        <div
          className="flex justify-content-center align-items-center"
          style={{
            height: "50vh",
            marginLeft: "900px",
            marginTop: "300px",
          }}
        >
          <ProgressSpinner />
        </div>
      ) : (
        <div className="w-100">
          <div className=" h-100 w-100 d-flex flex-column" style={{ marginTop: "-30px" }}>
            <div className="text-end pt-3 mb-2">
              <Button
                className="p-button-primary"
                onClick={() => (window.location.href = "Facturacion_Ventas")}
              >
                <i className="fas fa-file-edit me-2"></i>
                Nueva Facturación Venta
              </Button>
            </div>

            <Accordion>
              <AccordionTab header="Filtros de Búsqueda">
                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">
                      Número de factura
                    </label>
                    <InputText
                      value={filtros.numeroFactura}
                      onChange={(e) =>
                        handleFilterChange("numeroFactura", e.target.value)
                      }
                      placeholder="B01-001-0000001"
                      className="w-100"
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Cliente</label>
                    <Dropdown
                      value={filtros.cliente}
                      onChange={(e) =>
                        handleFilterChange("cliente", e.target.value)
                      }
                      options={thirdParties}
                      optionLabel="name"
                      optionValue="id"
                      placeholder="Seleccione un proveedor"
                      className="w-100"
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">
                      Rango de fechas
                    </label>
                    <Calendar
                      value={filtros.fechaRango}
                      onChange={(e) =>
                        handleFilterChange("fechaRango", e.value)
                      }
                      selectionMode="range"
                      readOnlyInput
                      dateFormat="dd/mm/yy"
                      placeholder="Seleccione un rango"
                      className="w-100"
                      showIcon
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Estado</label>
                    <Dropdown
                      value={filtros.estado}
                      options={estadosFactura}
                      onChange={(e) =>
                        handleFilterChange("estado", e.value)
                      }
                      optionLabel="label"
                      placeholder="Seleccione estado"
                      className="w-100"
                    />
                  </div>

                  <div className="col-12 d-flex justify-content-end gap-2">
                    <Button
                      label="Limpiar"
                      icon="pi pi-trash"
                      className="p-button-secondary"
                      onClick={limpiarFiltros}
                    />
                    <Button
                      label="Aplicar Filtros"
                      icon="pi pi-filter"
                      className="p-button-primary"
                      onClick={() => aplicarFiltros()}
                      loading={tableLoading}
                    />
                  </div>
                </div>
              </AccordionTab>
            </Accordion>

            <CustomPRTable
              columns={columns}
              data={tableItems}
              loading={tableLoading}
              onSearch={handleSearchChange}
              onReload={handleRefresh}
              paginator
              rows={rows}
              first={first}
              onPage={onPageChange}
              totalRecords={totalRecords}
              rowsPerPageOptions={[5, 10, 25, 50]}
              currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} facturas"
              emptyMessage="No se encontraron facturas"
            />
          </div>
        </div>
      )
      }

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

      <Dialog
        style={{ width: "85vw" }}
        header="Generar Factura"
        visible={showModal}
        onHide={() => setShowModal(false)}
      >
        <FormDebitCreditNotes
          initialData={invoiceToNote}
          onSuccess={handleNoteSuccess}
        />
      </Dialog>
    </main >
  );
};