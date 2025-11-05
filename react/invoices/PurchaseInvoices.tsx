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
import { useInvoicePurchase } from "./hooks/usePurcharseInvoice";
import { NewReceiptBoxModal } from "../accounting/paymentReceipt/modals/NewReceiptBoxModal";
import { FormDebitCreditNotes } from "../invoices/form/FormDebitCreditNotes";
import { usePurchaseInvoicesFormat } from "../documents-generation/hooks/billing/invoices/usePurchaseInvoices";

interface Factura {
  id: number;
  numeroFactura: string;
  fecha: Date;
  proveedor: string;
  identificacion: string;
  monto: number;
  remainingAmount: number;
  paid: number;
  tipoFactura: string;
  estado: string;
  formaPago?: string;
  detalles: null;
  third_party: {
    id: number;
    name: string;
  } | null;
  centre_cost: any;
  notes: any[];
  adjustedType: string;
}

export const PurchaseInvoices = () => {
  const { thirdParties } = useThirdParties();
  const { fetchAllInvoice } = useInvoicePurchase();
  const { generateFormatPurchaseInvoices } = usePurchaseInvoicesFormat();

  // Estado para los datos de la tabla
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showReciboModal, setShowReciboModal] = useState<boolean>(false);
  const [facturaParaRecibo, setFacturaParaRecibo] = useState<Factura | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [invoiceToNote, setInvoiceToNote] = useState<any>(null);
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
    estado: null,
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
          filteredData = filteredData.filter((factura) =>
            factura.numeroFactura
              ?.toLowerCase()
              .includes(filtros.numeroFactura.toLowerCase())
          );
        }

        if (filtros.identificacion) {
          filteredData = filteredData.filter((factura) =>
            factura.identificacion
              ?.toString()
              .toLowerCase()
              .includes(filtros.identificacion.toLowerCase())
          );
        }

        if (filtros.fechaRango && filtros.fechaRango[0] && filtros.fechaRango[1]) {
          const startDate = new Date(filtros.fechaRango[0]);
          const endDate = new Date(filtros.fechaRango[1]);
          endDate.setHours(23, 59, 59, 999);

          filteredData = filteredData.filter((factura) => {
            if (!factura.fecha) return false;
            const facturaDate = new Date(factura.fecha);
            return facturaDate >= startDate && facturaDate <= endDate;
          });
        }

        if (filtros.estado) {
          filteredData = filteredData.filter(
            (factura) =>
              factura.estado?.toLowerCase() === filtros.estado?.toLowerCase()
          );
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
      estado: null,
    });
    loadFacturas(1, rows);
  };

  // Formatear número para montos en pesos dominicanos (DOP)
  const formatCurrency = (value: number) => {
    return value?.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Formatear fecha
  const formatDate = (value: Date) => {
    return value?.toLocaleDateString("es-DO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Funciones para las acciones
  const generateReceipt = (invoice: Factura) => {
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

  const downloadExcel = (invoice: Factura) => {
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
    [generateFormatPurchaseInvoices]
  );

  const downloadPdf = useCallback(
    async (invoice: any) => {
      generateInvoiceRef.current(invoice, "Descargar");
    },
    [generateFormatPurchaseInvoices]
  );

  function generateDebitNote(invoice: any) {
    invoice.noteType = { id: "DEBIT", name: "Débito" };
    setInvoiceToNote(invoice);
    setShowNoteModal(true);
  }

  function generateCreditNote(invoice: any) {
    invoice.noteType = { id: "CREDIT", name: "Crédito" };
    setInvoiceToNote(invoice);
    setShowNoteModal(true);
  }

  function handleNoteSuccess() {
    toast.current?.show({
      severity: "success",
      summary: "Éxito",
      detail: "Nota guardada",
      life: 2000,
    });
    setTimeout(() => {
      setShowNoteModal(false);
      aplicarFiltros(Math.floor(first / rows) + 1, rows);
    }, 1000);
  }

  const TableMenu: React.FC<{
    rowData: Factura;
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

  const actionBodyTemplate = (rowData: Factura) => {
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

  // Estilo para los tags de estado - RESPETANDO TODOS LOS ESTADOS ORIGINALES
  const getEstadoSeverity = (estado: string) => {
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
    paid: factura.paid || (factura.monto - factura.remainingAmount),
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
      field: 'identificacion',
      header: 'Identificación',
      sortable: true
    },
    {
      field: 'proveedor',
      header: 'Proveedor',
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
      header: 'Valor',
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
    await loadFacturas(1, rows);
  };

  useEffect(() => {
    loadFacturas(1, rows);
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
                onClick={() => (window.location.href = "Facturacion_Compras")}
              >
                <i className="fas fa-file-edit me-2"></i>
                Nueva Facturación Compra
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
                      placeholder="FAC-001-0000001"
                      className="w-100"
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Identificación</label>
                    <InputText
                      value={filtros.identificacion}
                      onChange={(e) =>
                        handleFilterChange("identificacion", e.target.value)
                      }
                      placeholder="RNC/Cédula"
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
                      placeholder="Seleccione rango"
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
                      showClear
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
      )}

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
          valorPagado: facturaParaRecibo?.remainingAmount || 0,
          centreCost: facturaParaRecibo?.centre_cost || null,
          invoiceType: "purchase-invoice",
        }}
      />

      <Dialog
        style={{ width: "85vw" }}
        header="Generar Nota"
        visible={showNoteModal}
        onHide={() => setShowNoteModal(false)}
      >
        <FormDebitCreditNotes
          initialData={invoiceToNote}
          onSuccess={handleNoteSuccess}
        />
      </Dialog>
    </main>
  );
};