import React, { useState, useEffect, useMemo, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { NewReceiptBoxModal } from "../accounting/paymentReceipt/modals/NewReceiptBoxModal";
import {
  exportToExcel,
  exportToPDF,
} from "../accounting/utils/ExportToExcelOptions";
import { billingService } from "../../services/api/index.js";
import { InvoiceEntityDto } from "../models/models.js";
import { Menu } from "primereact/menu";
import { SplitButton } from "primereact/splitbutton";
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

  // Estados para el modal de pago
  const [facturaSeleccionada, setFacturaSeleccionada] =
    useState<InvoiceEntityDto | null>(null);

  const [facturasFiltradas, setFacturasFiltradas] = useState<
    InvoiceEntityDto[]
  >([]);

  const [montoPago, setMontoPago] = useState<number>(0);

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Estado para el modal de recibo de caja
  const [showReciboModal, setShowReciboModal] = useState<boolean>(false);
  const [facturaParaRecibo, setFacturaParaRecibo] =
    useState<InvoiceEntityDto | null>(null);

  // Estado para los filtros
  const [filtros, setFiltros] = useState<Filtros>({
    facturador: "",
    numeroFactura: "",
    entidad: null,
    fechaRango: null,
    montoMinimo: null,
    montoMaximo: null,
    tipoFecha: "elaboracion", // Por defecto filtramos por fecha de elaboración
  });

  const tipoFechaOpciones = [
    { label: "Fecha de Elaboración", value: "elaboracion" },
    { label: "Fecha de Vencimiento", value: "vencimiento" },
  ];

    const { generateFormatByEntity } = useByEntityFormat();

  // Simular carga de datos
  useEffect(() => {
    setLoading(true);
    loadBillingReportData();
  }, []);

  const loadBillingReportData = async () => {
    const response = await billingService.getBillingReportByEntityDetailed();
    const dataMapped = handleLoadData(response);
    setFacturas(dataMapped);
    setFacturasFiltradas(dataMapped);
    setLoading(false);
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

  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;

    // Si es solo fecha (YYYY-MM-DD), agregamos tiempo para evitar problemas de zona horaria
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return new Date(`${dateString}T12:00:00`);
    }

    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  // Función para aplicar filtros
  const aplicarFiltros = () => {
    let resultadosFiltrados = [...facturas];

    // Filtro por facturador
    if (filtros.facturador) {
      resultadosFiltrados = resultadosFiltrados.filter((factura) =>
        factura.biller.toLowerCase().includes(filtros.facturador.toLowerCase())
      );
    }

    // Filtro por número de factura
    if (filtros.numeroFactura) {
      resultadosFiltrados = resultadosFiltrados.filter((factura) =>
        factura.invoice_code
          .toLowerCase()
          .includes(filtros.numeroFactura.toLowerCase())
      );
    }

    // Filtro por entidad
    if (filtros.entidad) {
      resultadosFiltrados = resultadosFiltrados.filter(
        (factura) => factura.entity?.name === filtros.entidad
      );
    }

    // Filtro por rango de fechas (corregido)
    if (filtros.fechaRango && filtros.fechaRango[0] && filtros.fechaRango[1]) {
      const fechaInicio = new Date(filtros.fechaRango[0]);
      const fechaFin = new Date(filtros.fechaRango[1]);

      // Ajustar la fecha fin para incluir todo el día
      fechaFin.setHours(23, 59, 59, 999);

      resultadosFiltrados = resultadosFiltrados.filter((factura) => {
        // Obtener la fecha relevante según el tipo seleccionado
        const fechaFacturaStr =
          filtros.tipoFecha === "elaboracion"
            ? factura.elaboration_date
            : factura.due_date;

        // Convertir a objeto Date
        const fechaFactura = new Date(fechaFacturaStr);

        // Validar que la fecha sea válida
        if (isNaN(fechaFactura.getTime())) return false;

        return fechaFactura >= fechaInicio && fechaFactura <= fechaFin;
      });
    }

    // Filtro por monto mínimo
    if (filtros.montoMinimo !== null) {
      resultadosFiltrados = resultadosFiltrados.filter(
        (factura) => factura.total_amount >= filtros.montoMinimo!
      );
    }

    // Filtro por monto máximo
    if (filtros.montoMaximo !== null) {
      resultadosFiltrados = resultadosFiltrados.filter(
        (factura) => factura.total_amount <= filtros.montoMaximo!
      );
    }

    setFacturasFiltradas(resultadosFiltrados);
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
    setFacturasFiltradas(facturas);
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

  function formatearFecha(fechaString) {
    // Primero normalizamos la fecha para asegurar que sea válida
    let fechaNormalizada = fechaString;

    // Si es formato "YYYY-MM-DD" sin tiempo, agregamos 'T00:00' para compatibilidad
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

  function formatearFechaISO(fechaISO) {
    // Verificar el formato esperado (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaISO)) {
      return "Formato de fecha no válido";
    }

    // Dividir la fecha en componentes
    const [año, mes, dia] = fechaISO.split("-").map(Number);

    // Crear objeto Date (mes es 0-indexed en JavaScript)
    const fecha = new Date(año, mes - 1, dia);

    // Validar que la fecha sea válida (por si viene "2025-02-30" por ejemplo)
    if (
      fecha.getFullYear() !== año ||
      fecha.getMonth() + 1 !== mes ||
      fecha.getDate() !== dia
    ) {
      return "Fecha no válida";
    }

    // Formatear usando Intl.DateTimeFormat
    const formateador = new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Ajustar el formato para que quede "día de mes, año"
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
  //   Acciones para la tabla
  const actionBodyTemplate = (rowData: InvoiceEntityDto) => {
    const items = [
      {
        label: "Generar Recibo",
        template: createActionTemplate(
          "receipt",
          "Generar Recibo",
          "text-green-500"
        ),
        command: () => abrirModalRecibo(rowData),
      },
      {
        label: "Descargar Excel",
        template: createActionTemplate(
          "file-excel",
          "Descargar Excel",
          "text-green-600"
        ),
        command: () => handleDescargarExcel(rowData),
      },
      {
        label: "Descargar PDF",
        template: createActionTemplate(
          "file-pdf",
          "Descargar PDF",
          "text-red-500"
        ),
        command: () => handleDescargarPDF(rowData),
      },
      {
        label: "Imprimir",
        template: createActionTemplate("print", "Imprimir", "text-blue-500"),

        command: () => generarFormatoContable("FacturaEntidad", rowData, "Impresion"),
      },
    ];

    return (
      <div className="flex gap-2">
        <SplitButton
          label="Acciones"
          model={items}
          severity="contrast"
          className="p-button-sm point"
          buttonClassName="p-button-sm"
          onClick={() => abrirModalRecibo(rowData)}
          disabled={isGeneratingPDF}
        />
      </div>
    );
  };

  const handleDescargarExcel = (invoice: InvoiceEntityDto) => {
    exportToExcel({
      data: invoice.invoice_linked, // Pasamos la factura como un array de un elemento
      fileName: `Factura_${invoice.invoice_code}`,
      excludeColumns: ["id"], // Excluimos campos que no queremos mostrar
    });
  };
  const handleDescargarPDF = async (invoice: InvoiceEntityDto) => {
    generateFormatByEntity(invoice, [], "Impresion");
  };

  const abrirModalRecibo = (factura: InvoiceEntityDto) => {
    setFacturaParaRecibo({...factura});
    setShowReciboModal(true);
  };

  const cerrarModalRecibo = () => {
    setShowReciboModal(false);
    setFacturaParaRecibo(null);
  };

  const handleGenerarRecibo = (formData: any) => {
    // Aquí puedes manejar la generación del recibo con los datos del formulario

    // Simular generación de recibo
    alert(
      `Recibo generado para factura ${facturaParaRecibo?.invoice_code
      }\nMonto: ${formatCurrency(facturaParaRecibo?.paid_amount || 0)}`
    );

    cerrarModalRecibo();
  };

  // Estilos integrados
  const styles: Record<string, React.CSSProperties> = {
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
      <Card title="Filtros de Búsqueda" style={styles.card}>
        <div className="row g-3">
          {/* Filtro: Facturador */}
          <div className="col-md-6 col-lg-3">
            <label style={styles.formLabel}>Facturador</label>
            <InputText
              value={filtros.facturador}
              onChange={(e) => handleFilterChange("facturador", e.target.value)}
              placeholder="Nombre del facturador"
              className="w-100"
            />
          </div>

          {/* Filtro: Número Factura */}
          <div className="col-md-6 col-lg-3">
            <label style={styles.formLabel}>Número Factura</label>
            <InputText
              value={filtros.numeroFactura}
              onChange={(e) =>
                handleFilterChange("numeroFactura", e.target.value)
              }
              placeholder="B0100010001"
              className="w-100"
            />
          </div>

          {/* Filtro: Selector de tipo de fecha*/}
          <div className="col-md-6 col-lg-3">
            <label style={styles.formLabel}>Rango de fechas</label>
            <Dropdown
              value={filtros.tipoFecha}
              options={tipoFechaOpciones}
              onChange={(e) => handleFilterChange("tipoFecha", e.value)}
              optionLabel="label"
              className="w-100"
            />
          </div>

          {/* Filtro: Rango de fechas */}
          <div className="col-md-6 col-lg-3">
            <label style={styles.formLabel}>Rango de fechas</label>
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
      <Card title="Facturación por Entidad" style={styles.card}>
        <DataTable
          value={facturasFiltradas}
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
            field="biller"
            header="Facturador"
            sortable
            style={styles.tableCell}
          />
          <Column
            field="invoice_code"
            header="N° Factura"
            sortable
            style={styles.tableCell}
          />

          <Column
            field="entity.name"
            header="Entidad"
            sortable
            style={styles.tableCell}
          />

          <Column
            field="total_amount"
            header="Monto Total"
            sortable
            body={(rowData) => formatCurrency(rowData.total_amount)}
            style={styles.tableCell}
          />

          <Column
            field="paid_amount"
            header="Monto Pagado"
            sortable
            body={(rowData) => formatCurrency(rowData.paid_amount)}
            style={styles.tableCell}
          />

          <Column
            field="elaboration_date"
            header="Fecha Elaboración"
            sortable
            body={(rowData) => formatearFecha(rowData.elaboration_date)}
            style={styles.tableCell}
          />

          <Column
            field="due_date"
            header="Fecha Vencimiento"
            sortable
            style={styles.tableCell}
          />

          <Column
            field="status"
            header="Estado"
            sortable
            body={(rowData) => (
              <Tag
                value={rowData.status}
                severity={getEstadoSeverity(rowData.status)}
              />
            )}
            style={styles.tableCell}
          />

          <Column
            header="Acciones"
            body={actionBodyTemplate}
            style={{ ...styles.tableCell, width: "120px" }}
          />
        </DataTable>
      </Card>

      <NewReceiptBoxModal
        visible={showReciboModal}
        onHide={cerrarModalRecibo}
        onSubmit={handleGenerarRecibo}
        initialData={{
          cliente: facturaParaRecibo?.third_party?.id?.toString() || "", // <-- ✅ Aquí
          idFactura: facturaParaRecibo?.id || 0,
          numeroFactura: facturaParaRecibo?.invoice_code || "",
          fechaElaboracion: facturaParaRecibo?.fecha || new Date(),
          valorPagado: facturaParaRecibo?.monto || 0,
          invoiceType: "entity",
          third_party_id: facturaParaRecibo?.entity?.id || 0,
        }}
      />
    </div>
  );
};
