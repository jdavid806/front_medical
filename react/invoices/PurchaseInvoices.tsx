import React, { useState, useEffect, useRef, use } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { classNames } from "primereact/utils";
import { useThirdParties } from "../billing/third-parties/hooks/useThirdParties";
import { useInvoicePurchase } from "./hooks/usePurcharseInvoice";
import { SplitButton } from "primereact/splitbutton";
import { Toast } from "primereact/toast";
import { MenuItem } from "primereact/menuitem";
import { NewReceiptBoxModal } from "../accounting/paymentReceipt/modals/NewReceiptBoxModal";
import { generatePDFFromHTML } from "../../funciones/funcionesJS/exportPDF";
import { useCompany } from "../hooks/useCompany";
import { generarFormatoContable } from "../../funciones/funcionesJS/generarPDFContable";
import { NewNoteModal } from "./NewNoteModal";
import { useApplyNote } from "./hooks/useApplyNote";
import { usePurchaseInvoicesFormat } from "../documents-generation/hooks/billing/invoices/usePurchaseInvoices";

interface Factura {
  id: number;
  numeroFactura: string;
  fecha: Date;
  proveedor: string;
  identificacion: string;
  monto: number;
  remainingAmount: number;
  tipoFactura: string;
  estado: string;
  formaPago?: string;
  detalles: null;
  third_party: {
    id: number;
    name: string;
  } | null;
  centre_cost: any;
}

interface Filtros {
  numeroFactura: string;
  identificacion: string;
  fechaRango: Date[] | null;
  estado: string | null;
}
export const PurchaseInvoices = () => {
  const { thirdParties } = useThirdParties();

  // Estado para la tabla
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [filteredFacturas, setFilteredFacturas] = useState<Factura[]>([]);
  const [showReciboModal, setShowReciboModal] = useState<boolean>(false);
  const [facturaParaRecibo, setFacturaParaRecibo] = useState<Factura | null>(
    null
  );
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [tipoNota, setTipoNota] = useState<"debito" | "credito">("debito");
  const { fetchAllInvoice, loading } = useInvoicePurchase();

  const { company, setCompany, fetchCompany } = useCompany();
  const { applyNote, loading: loadingNote, error: errorNote } = useApplyNote();

  const { generateFormatPurchaseInvoices } = usePurchaseInvoicesFormat();

  // Estado para filtros
  const [filtros, setFiltros] = useState<Filtros>({
    numeroFactura: "",
    identificacion: "",
    fechaRango: null,
    estado: null,
  });

  const toast = useRef<Toast>(null);

  const tiposFactura = [
    { label: "Contado", value: "Contado" },
    { label: "Crédito", value: "Crédito" },
  ];

  const estadosFactura = [
    { label: "Pendiente", value: "pending" },
    { label: "Pagada", value: "paid" },
    { label: "Anulada", value: "cancelled" },
    { label: "Vencida", value: "expired" },
  ];
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
    setFiltros((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const aplicarFiltros = () => {
    if (!facturas || facturas.length === 0) {
      setFilteredFacturas([]);
      return;
    }

    let result = [...facturas];

    if (filtros.numeroFactura) {
      result = result.filter((factura) =>
        factura.numeroFactura
          ?.toLowerCase()
          .includes(filtros.numeroFactura.toLowerCase())
      );
    }

    if (filtros.identificacion) {
      result = result.filter((factura) =>
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

      result = result.filter((factura) => {
        if (!factura.fecha) return false;
        const facturaDate = new Date(factura.fecha);
        return facturaDate >= startDate && facturaDate <= endDate;
      });
    }

    if (filtros.estado) {
      result = result.filter(
        (factura) =>
          factura.estado?.toLowerCase() === filtros.estado?.toLowerCase()
      );
    }
  };

  const limpiarFiltros = () => {
    setFiltros({
      numeroFactura: "",
      identificacion: "",
      fechaRango: null,
      estado: null,
    });
    setFilteredFacturas(facturas); // Mostrar todos los datos nuevamente
  };

  // Utilidades
  const formatCurrency = (value) => {
    return value?.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (value) => {
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

  const printInvoice = (invoice: Factura) => {
    generateFormatPurchaseInvoices(invoice, "Impresion");
  };

  const downloadPdf = (invoice: Factura) => {
    generateFormatPurchaseInvoices(invoice, "Descargar");
  };

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

  // Acciones para cada fila
  const actionBodyTemplate = (rowData: Factura) => {
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
        label: "Generar Nota Débito",
        template: createActionTemplate(
          "money-bill-transfer",
          "Generar Nota Débito",
          "text-green-500"
        ),
        command: () => {
          setFacturaParaRecibo(rowData);
          setTipoNota("debito");
          setShowNoteModal(true);
        },
      },
      {
        label: "Generar Nota Crédito",
        template: createActionTemplate(
          "money-bill-transfer",
          "Generar Nota Crédito",
          "text-green-500"
        ),
        command: () => {
          setFacturaParaRecibo(rowData);
          setTipoNota("credito");
          setShowNoteModal(true);
        },
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

  const getEstadoSeverity = (estado) => {
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

  const getEstadoLabel = (estado) => {
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
          label="Nueva Facturación Compra"
          icon="pi pi-file-edit"
          className="btn btn-primary"
          onClick={() => (window.location.href = "Facturacion_Compras")}
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
              placeholder="FAC-001-0000001"
              className={classNames("w-100")}
            />
          </div>

          <div className="col-md-6 col-lg-3">
            <label style={styles.formLabel}>Identificación</label>
            <InputText
              value={filtros.identificacion}
              onChange={(e) =>
                handleFilterChange("identificacion", e.target.value)
              }
              placeholder="RNC/Cédula"
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
              placeholder="Seleccione rango"
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
              className={classNames("w-100")}
              showClear
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
              onClick={aplicarFiltros}
              loading={loading}
            />
          </div>
        </div>
      </Card>

      {/* Tabla de resultados */}
      <Card title="Facturas de Compra" style={styles.card}>
        <DataTable
          value={filteredFacturas}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          loading={loading}
          className="p-datatable-striped p-datatable-gridlines"
          emptyMessage="No se encontraron facturas"
          responsiveLayout="scroll"
          tableStyle={{ minWidth: "50rem" }}
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
            field="identificacion"
            header="Identificación"
            sortable
            style={styles.tableCell}
          />
          <Column
            field="proveedor"
            header="Proveedor"
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
            header="Valor"
            sortable
            body={(rowData) => formatCurrency(rowData.monto)}
            style={styles.tableCell}
          />
          {/* <Column
            field="tipoFactura"
            header="Tipo"
            sortable
            style={styles.tableCell}
          /> */}
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
            style={styles.tableCell}
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
          loadFacturas();
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
      <NewNoteModal
        visible={showNoteModal}
        onHide={() => setShowNoteModal(false)}
        factura={facturaParaRecibo}
        tipo={tipoNota}
        onSubmit={async (data) => {
          try {
            console.log(data);
            await applyNote(data);

            showToast(
              "success",
              "Éxito",
              `Nota ${
                data.type === "credit" ? "Crédito" : "Débito"
              } aplicada correctamente`
            );

            await loadFacturas();
          } catch (err) {
            showToast(
              "error",
              "Error",
              errorNote || "No se pudo aplicar la nota"
            );
          }
        }}
      />
    </div>
  );
};
