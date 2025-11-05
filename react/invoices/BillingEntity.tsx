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
import { NewReceiptBoxModal } from "../accounting/paymentReceipt/modals/NewReceiptBoxModal";
import {
  exportToExcel,
  exportToPDF,
} from "../accounting/utils/ExportToExcelOptions";
import { billingService } from "../../services/api/index.js";
import { InvoiceEntityDto } from "../models/models.js";
import { generarFormatoContable } from "../../funciones/funcionesJS/generarPDFContable";
import { useByEntityFormat } from "../documents-generation/hooks/billing/by-entity/useByEntityFormat.js";

interface Filtros {
  facturador: string;
  numeroFactura: string;
  entidad: string | null;
  fechaRango: Date[] | null;
  montoMinimo: number | null;
  montoMaximo: number | null;
  tipoFecha: "elaboracion" | "vencimiento";
}

interface OpcionDropdown {
  label: string;
  value: string;
}

export const BillingEntity: React.FC = () => {
  // Estado para los datos de la tabla
  const [facturas, setFacturas] = useState<InvoiceEntityDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  // Estados para el modal de pago
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<InvoiceEntityDto | null>(null);
  const [montoPago, setMontoPago] = useState<number>(0);

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Estado para el modal de recibo de caja
  const [showReciboModal, setShowReciboModal] = useState<boolean>(false);
  const [facturaParaRecibo, setFacturaParaRecibo] = useState<InvoiceEntityDto | null>(null);

  // Pagination state
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");

  // Estado para los filtros
  const [filtros, setFiltros] = useState<Filtros>({
    facturador: "",
    numeroFactura: "",
    entidad: null,
    fechaRango: null,
    montoMinimo: null,
    montoMaximo: null,
    tipoFecha: "elaboracion",
  });

  const tipoFechaOpciones = [
    { label: "Fecha de Elaboración", value: "elaboracion" },
    { label: "Fecha de Vencimiento", value: "vencimiento" },
  ];

  const { generateFormatByEntity } = useByEntityFormat();
  const generateInvoiceRef = useRef(generateFormatByEntity);

  useEffect(() => {
    generateInvoiceRef.current = generateFormatByEntity;
  }, [generateFormatByEntity]);

  const toast = useRef<Toast>(null);

  // Simular carga de datos
  useEffect(() => {
    loadBillingReportData(1, rows);
  }, []);

  const loadBillingReportData = async (page = 1, per_page = 10) => {
    setTableLoading(true);
    try {
      const response = await billingService.getBillingReportByEntityDetailed();
      const dataMapped = handleLoadData(response);
      const startIndex = (page - 1) * per_page;
      const endIndex = startIndex + per_page;
      const paginatedData = dataMapped.slice(startIndex, endIndex);

      setFacturas(paginatedData);
      setTotalRecords(dataMapped.length);
    } catch (error) {
      console.error("Error cargando facturas:", error);
      showToast("error", "Error", "No se pudieron cargar las facturas");
      setFacturas([]);
      setTotalRecords(0);
    } finally {
      setTableLoading(false);
    }
  };

  function handleLoadData(data: InvoiceEntityDto[]) {
    const dataMapped = data.map((item: any) => {
      const totalAmountFormatted = parseInt(item.main.total_amount, 10);
      const remainingAmountFormatted = parseInt(item.main.remaining_amount, 10);
      const ivaFormatted = parseInt(item.main.iva, 10);
      const subtotalFormatted = parseInt(item.main.subtotal, 10);
      const discountFormatted = parseInt(item.main.discount, 10);

      return {
        id: item.main.id,
        biller: `${item.main.user?.first_name ?? ""} ${item.main.user?.middle_name ?? ""} ${item.main.user?.last_name ?? ""} ${item.main.user?.second_last_name ?? ""}`,
        invoice_code: item.main.invoice_code,
        paid_amount: totalAmountFormatted - remainingAmountFormatted,
        total_amount: totalAmountFormatted,
        elaboration_date: item.main.created_at,
        due_date: item.main.due_date,
        status: item.main.status,
        entity: item.main.entity,
        observations: item.main.observations,
        resolution: item.main.resolution_number,
        iva: ivaFormatted,
        subtotal: subtotalFormatted,
        discount: discountFormatted,
        invoice_linked: item.linked.map((linked: any) => {
          const price = Number(linked.admission_data.entity_authorized_amount || 0);
          const amount = linked.linked_invoice.details.reduce(
            (sum: number, procedure: any) =>
              sum + Number(procedure.product.copayment || 0),
            0
          );
          const total = price;

          return {
            id: linked.linked_invoice.id,
            patient_full_name: `${linked.admission_data.patient?.first_name ?? ""
              } ${linked.admission_data.patient?.middle_name ?? ""} ${linked.admission_data.patient?.last_name ?? ""
              } ${linked.admission_data.patient?.second_last_name ?? ""}`,
            invoice_code: linked.linked_invoice.invoice_code,
            due_date: linked.linked_invoice.due_date,
            status: linked.linked_invoice.status,
            subtotal: price + amount,
            discount: amount,
            total_amount: total,
            remaining_amount: Number(linked.linked_invoice.remaining_amount || 0).toFixed(2),
            products: linked.linked_invoice.details
              .map((detail: any) => detail.product.name)
              .join(","),
            entity: linked.admission_data.entity || "",
            created_at: linked.admission_data.created_at,
          };
        }),
      };
    });

    return dataMapped;
  }

  // Manejadores de cambio de filtros
  const handleFilterChange = (field: keyof Filtros, value: any) => {
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
    try {
      const response = await billingService.getBillingReportByEntityDetailed();
      let filteredData = handleLoadData(response);

      // Aplicar filtros
      if (filtros.facturador) {
        filteredData = filteredData.filter((factura) =>
          factura.biller.toLowerCase().includes(filtros.facturador.toLowerCase())
        );
      }

      if (filtros.numeroFactura) {
        filteredData = filteredData.filter((factura) =>
          factura.invoice_code
            .toLowerCase()
            .includes(filtros.numeroFactura.toLowerCase())
        );
      }

      if (filtros.entidad) {
        filteredData = filteredData.filter(
          (factura) => factura.entity?.name === filtros.entidad
        );
      }

      if (filtros.fechaRango && filtros.fechaRango[0] && filtros.fechaRango[1]) {
        const fechaInicio = new Date(filtros.fechaRango[0]);
        const fechaFin = new Date(filtros.fechaRango[1]);
        fechaFin.setHours(23, 59, 59, 999);

        filteredData = filteredData.filter((factura) => {
          const fechaFacturaStr =
            filtros.tipoFecha === "elaboracion"
              ? factura.elaboration_date
              : factura.due_date;

          const fechaFactura = new Date(fechaFacturaStr);
          if (isNaN(fechaFactura.getTime())) return false;

          return fechaFactura >= fechaInicio && fechaFactura <= fechaFin;
        });
      }

      if (filtros.montoMinimo !== null) {
        filteredData = filteredData.filter(
          (factura) => factura.total_amount >= filtros.montoMinimo!
        );
      }

      if (filtros.montoMaximo !== null) {
        filteredData = filteredData.filter(
          (factura) => factura.total_amount <= filtros.montoMaximo!
        );
      }

      // Paginación
      const startIndex = (page - 1) * per_page;
      const endIndex = startIndex + per_page;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setFacturas(paginatedData);
      setTotalRecords(filteredData.length);
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
      facturador: "",
      numeroFactura: "",
      entidad: null,
      fechaRango: null,
      montoMinimo: null,
      montoMaximo: null,
      tipoFecha: "elaboracion",
    });
    loadBillingReportData(1, rows);
  };

  // Formatear número para montos en pesos dominicanos (DOP)
  const formatCurrency = (value: number): string => {
    return value.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Formatear fecha
  function formatearFecha(fechaString: string) {
    let fechaNormalizada = fechaString;

    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaString)) {
      fechaNormalizada += "T00:00:00";
    }

    try {
      const fecha = new Date(fechaNormalizada);
      if (isNaN(fecha.getTime())) throw new Error("Fecha inválida");

      return new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
        .format(fecha)
        .replace(/(\d+)/, "$1 de")
        .replace(" de ", " de ");
    } catch {
      return "Fecha inválida";
    }
  }

  function formatearFechaISO(fechaISO: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaISO)) {
      return "Formato de fecha no válido";
    }

    const [año, mes, dia] = fechaISO.split("-").map(Number);
    const fecha = new Date(año, mes - 1, dia);

    if (
      fecha.getFullYear() !== año ||
      fecha.getMonth() + 1 !== mes ||
      fecha.getDate() !== dia
    ) {
      return "Fecha no válida";
    }

    const formateador = new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return formateador
      .format(fecha)
      .replace(/(\d+)/, "$1 de")
      .replace(" de ", " de ");
  }

  // Estilo para los tags de estado
  const getEstadoSeverity = (
    status: string
  ): "success" | "warning" | "info" | "danger" | null => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "partially_pending":
        return "info";
      case "En proceso":
        return "info";
      case "Rechazada":
      case "Vencida":
        return "danger";
      case "canceled":
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
      case "En proceso":
        return "En proceso";
      case "Rechazada":
        return "Rechazada";
      case "Vencida":
        return "Vencida";
      case "canceled":
        return "Anulada";
      default:
        return estado || "";
    }
  };

  // Funciones para las acciones
  const abrirModalRecibo = (factura: InvoiceEntityDto) => {
    setFacturaParaRecibo({ ...factura });
    setShowReciboModal(true);
  };

  const cerrarModalRecibo = () => {
    setShowReciboModal(false);
    setFacturaParaRecibo(null);
  };

  const handleGenerarRecibo = (formData: any) => {
    showToast(
      "success",
      "Éxito",
      `Recibo generado para factura ${facturaParaRecibo?.invoice_code}`
    );
    cerrarModalRecibo();
  };

  const handleDescargarExcel = (invoice: InvoiceEntityDto) => {
    exportToExcel({
      data: invoice.invoice_linked,
      fileName: `Factura_${invoice.invoice_code}`,
      excludeColumns: ["id"],
    });
    showToast("success", "Éxito", `Excel descargado para ${invoice.invoice_code}`);
  };

  const handleDescargarPDF = useCallback(
    async (invoice: InvoiceEntityDto) => {
      generateInvoiceRef.current(invoice, [], "Descargar");
    },
    [generateFormatByEntity]
  );

  const printInvoice = useCallback(
    async (invoice: InvoiceEntityDto) => {
      generarFormatoContable("FacturaEntidad", invoice, "Impresion");
    },
    []
  );

  const TableMenu: React.FC<{
    rowData: InvoiceEntityDto;
  }> = ({ rowData }) => {
    const menu = useRef<Menu>(null);

    const handleGenerateReceipt = () => {
      abrirModalRecibo(rowData);
    };

    const handleDownloadExcel = () => {
      handleDescargarExcel(rowData);
    };

    const handleDownloadPdf = () => {
      handleDescargarPDF(rowData);
    };

    const handlePrintInvoice = () => {
      printInvoice(rowData);
    };

    const menuItems = [
      {
        label: "Generar Recibo",
        icon: <i className="fas fa-receipt me-2"></i>,
        command: handleGenerateReceipt,
      },
      {
        label: "Descargar Excel",
        icon: <i className="fas fa-file-excel me-2"></i>,
        command: handleDownloadExcel,
      },
      {
        label: "Descargar PDF",
        icon: <i className="fas fa-file-pdf me-2"></i>,
        command: handleDownloadPdf,
      },
      {
        label: "Imprimir",
        icon: <i className="fas fa-print me-2"></i>,
        command: handlePrintInvoice,
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

  const actionBodyTemplate = (rowData: InvoiceEntityDto) => {
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

  // Mapear los datos para la tabla
  const tableItems = facturas.map(factura => ({
    id: factura.id,
    biller: factura.biller,
    invoice_code: factura.invoice_code,
    entity: factura.entity?.name || "",
    total_amount: factura.total_amount,
    paid_amount: factura.paid_amount,
    elaboration_date: factura.elaboration_date,
    due_date: factura.due_date,
    status: factura.status,
    actions: factura
  }));

  const columns: CustomPRTableColumnProps[] = [
    {
      field: 'biller',
      header: 'Facturador',
      sortable: true
    },
    {
      field: 'invoice_code',
      header: 'N° Factura',
      sortable: true
    },
    {
      field: 'entity',
      header: 'Entidad',
      sortable: true
    },
    {
      field: 'total_amount',
      header: 'Monto Total',
      sortable: true,
      body: (rowData: any) => formatCurrency(rowData.total_amount)
    },
    {
      field: 'paid_amount',
      header: 'Monto Pagado',
      sortable: true,
      body: (rowData: any) => formatCurrency(rowData.paid_amount)
    },
    {
      field: 'elaboration_date',
      header: 'Fecha Elaboración',
      sortable: true,
      body: (rowData: any) => formatearFecha(rowData.elaboration_date)
    },
    {
      field: 'due_date',
      header: 'Fecha Vencimiento',
      sortable: true,
      body: (rowData: any) => formatearFecha(rowData.due_date)
    },
    {
      field: 'status',
      header: 'Estado',
      sortable: true,
      body: (rowData: any) => (
        <Tag
          value={getEstadoLabel(rowData.status)}
          severity={getEstadoSeverity(rowData.status)}
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
    await loadBillingReportData(1, rows);
  };

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
          <div className="h-100 w-100 d-flex flex-column" style={{ marginTop: "-30px" }}>
            <div className="text-end pt-3 mb-2">
              <Button
                className="p-button-primary"
                onClick={() => (window.location.href = "Facturacion_Entidad")}
              >
                <i className="fas fa-file-edit me-2"></i>
                Nueva Facturación Entidad
              </Button>
            </div>

            <Accordion>
              <AccordionTab header="Filtros de Búsqueda">
                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Facturador</label>
                    <InputText
                      value={filtros.facturador}
                      onChange={(e) => handleFilterChange("facturador", e.target.value)}
                      placeholder="Nombre del facturador"
                      className="w-100"
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Número Factura</label>
                    <InputText
                      value={filtros.numeroFactura}
                      onChange={(e) => handleFilterChange("numeroFactura", e.target.value)}
                      placeholder="B0100010001"
                      className="w-100"
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Tipo de fecha</label>
                    <Dropdown
                      value={filtros.tipoFecha}
                      options={tipoFechaOpciones}
                      onChange={(e) => handleFilterChange("tipoFecha", e.value)}
                      optionLabel="label"
                      className="w-100"
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Rango de fechas</label>
                    <Calendar
                      value={filtros.fechaRango}
                      onChange={(e) => {
                        const value = Array.isArray(e.value) ? e.value : null;
                        handleFilterChange("fechaRango", value);
                      }}
                      selectionMode="range"
                      dateFormat="dd/mm/yy"
                      placeholder="Seleccione rango"
                      className="w-100"
                      showIcon
                      readOnlyInput
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
        onHide={cerrarModalRecibo}
        onSubmit={handleGenerarRecibo}
        initialData={{
          cliente: facturaParaRecibo?.entity?.id?.toString() || "",
          idFactura: facturaParaRecibo?.id || 0,
          numeroFactura: facturaParaRecibo?.invoice_code || "",
          fechaElaboracion: new Date(facturaParaRecibo?.elaboration_date || new Date()),
          valorPagado: facturaParaRecibo?.total_amount || 0,
          invoiceType: "entity",
          third_party_id: facturaParaRecibo?.entity?.id || 0,
        }}
      />
    </main>
  );
};