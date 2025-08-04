import React, { useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useAccountsCollectPay } from "../accountsCollectPay/hooks/useAccountsCollectPay";
import {
  InvoiceData,
  InvoiceDetail,
} from "../accountsCollectPay/interfaces/accountColletcPayInterface";
import { Paginator } from "primereact/paginator";
import { NewReceiptBoxModal } from "../../accounting/paymentReceipt/modals/NewReceiptBoxModal";
import { generatePDFFromHTML } from "../../../funciones/funcionesJS/exportPDF";
import { useCompany } from "../../hooks/useCompany";
import { exportToExcel } from "../../accounting/utils/ExportToExcelOptions";

export const AccountsCollectPay = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedSupplierIds, setSelectedSupplierIds] = useState<string[]>([]);
  const [selectedDateRange, setSelectedDateRange] =
    useState<Nullable<(Date | null)[]>>(null);
  const [selectedDueDateRange, setSelectedDueDateRange] =
    useState<Nullable<(Date | null)[]>>(null);
  const [selectedDaysToPay, setSelectedDaysToPay] = useState<string | null>(
    null
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [invoiceToReceipt, setInvoiceToReceipt] = useState<any>(null);
  const [invoiceType, setInvoiceType] = useState<any>("");
  const { company, setCompany, fetchCompany } = useCompany();

  const formatDateRange = (range: Nullable<(Date | null)[]>) => {
    if (!range || !range[0] || !range[1]) return undefined;
    const from = range[0].toISOString().slice(0, 10);
    const to = range[1].toISOString().slice(0, 10);
    return `${from},${to}`;
  };

  const commonFilters = {
    page: Math.floor(first / rows) + 1, // Calcula el número de página
    per_page: rows, // Items por página
    suppliers: selectedSupplierIds.length ? selectedSupplierIds : undefined,
    createdAt: formatDateRange(selectedDateRange),
    dueDate: formatDateRange(selectedDueDateRange),
    days_to_pay: selectedDaysToPay ?? undefined,
  };

  const {
    invoices: accountsReceivable,
    loading: loadingReceivable,
    totalRecords: totalReceivable, // Asegúrate que tu hook devuelva este valor
  } = useAccountsCollectPay({
    ...commonFilters,
    type: "sale,entity",
    status: "pending",
  });

  const {
    invoices: accountsPayable,
    loading: loadingPayable,
    totalRecords: totalPayable,
  } = useAccountsCollectPay({
    ...commonFilters,
    type: "purchase",
    status: "pending",
  });

  const daysToPayOptions = [
    { label: "Todos", value: null },
    { label: "Próximos a vencer (1-5 días)", value: "1-5" },
    { label: "6-10 días", value: "6-10" },
    { label: "11-15 días", value: "11-15" },
    { label: "16-25 días", value: "16-25" },
    { label: "26-35 días", value: "26-35" },
    { label: "36-45 días", value: "36-45" },
    { label: "Más de 60 días", value: "60+" },
  ];

  const onPageChange = (event: { first: number; rows: number }) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const formatoDinero = (cantidad: number | string) => {
    const amount =
      typeof cantidad === "string" ? parseFloat(cantidad) : cantidad;
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const obtenerFechaFormateada = (fechaStr?: string) => {
    if (!fechaStr) return "—";
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string, days: number) => {
    if (status === "paid")
      return <span className="badge bg-success">Pagado</span>;
    if (status === "overdue")
      return <span className="badge bg-danger">Vencido</span>;
    if (days <= 5)
      return (
        <span className="badge bg-warning text-dark">Por vencer ({days}d)</span>
      );
    return <span className="badge bg-primary">Pendiente ({days}d)</span>;
  };

  const getStatusBadgeBasic = (status: string, days: number) => {
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
      selectedDaysToPay,
    });
  };

  function generateReceipt(rowData: any) {
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

  function downloadPdf(item: any) {
    const today = new Date();
    const dueDate = new Date(item.due_date);
    const daysToPay = Math.ceil(
      (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    const status = daysToPay < 0 ? "overdue" : "pending";
    const dataExport = {
      Factura: item.invoice_code,
      Cliente: item?.third_party?.nombre || "Sin cliente",
      Fecha: obtenerFechaFormateada(item.created_at),
      "Fecha vencimiento": obtenerFechaFormateada(item.due_date),
      "Días para pagar": daysToPay,
      Total: `$${Number(item.total_amount).toFixed(2)}`,
      Pendiende: `$${Number(item.remaining_amount).toFixed(2)}`,
      Estado: getStatusBadgeBasic(status, daysToPay),
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
          ${Object.keys(dataExport)
            .map((key) => `<th>${key}</th>`)
            .join("")}
        </tr>
      </thead>
      <tbody>
        <tr>
          ${Object.values(dataExport)
            .map((value) => `<td>${value}</td>`)
            .join("")}
        </tr>
      </tbody>
    </table>`;
    const configPDF = {
      name: "Factura_" + item.invoice_code,
    };
    generatePDFFromHTML(table, company, configPDF);
  }

  function downloadExcelGeneral(items: any, name) {
    const dataExport = items.map((item) => {
      const today = new Date();
      const dueDate = new Date(item.due_date);
      const daysToPay = Math.ceil(
        (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      const status = daysToPay < 0 ? "overdue" : "pending";
      return {
        Factura: item.invoice_code,
        Cliente: item?.third_party?.nombre || "Sin cliente",
        Fecha: obtenerFechaFormateada(item.created_at),
        "Fecha vencimiento": obtenerFechaFormateada(item.due_date),
        "Días para pagar": daysToPay,
        Total: `$${Number(item.total_amount).toFixed(2)}`,
        Pendiende: `$${Number(item.remaining_amount).toFixed(2)}`,
        Estado: getStatusBadgeBasic(status, daysToPay),
      };
    });
    exportToExcel({
      data: dataExport,
      fileName: name,
    });
  }

  function downloadPdfGeneral(items: any, name) {
    const dataExport = items.map((item) => {
      const today = new Date();
      const dueDate = new Date(item.due_date);
      const daysToPay = Math.ceil(
        (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      const status = daysToPay < 0 ? "overdue" : "pending";
      return {
        Factura: item.invoice_code,
        Cliente: item?.third_party?.nombre || "Sin cliente",
        Fecha: obtenerFechaFormateada(item.created_at),
        "Fecha vencimiento": obtenerFechaFormateada(item.due_date),
        "Días para pagar": daysToPay,
        Total: `$${Number(item.total_amount).toFixed(2)}`,
        Pendiende: `$${Number(item.remaining_amount).toFixed(2)}`,
        Estado: getStatusBadgeBasic(status, daysToPay),
      };
    });
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
          ${Object.keys(dataExport[0])
            .map((key) => `<th>${key}</th>`)
            .join("")}
        </tr>
      </thead>
      <tbody>
        ${dataExport
          .map(
            (row) => `
          <tr>
            ${Object.values(row)
              .map((value) => `<td>${value}</td>`)
              .join("")}
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>`;
    const configPDF = {
      name: name,
    };
    generatePDFFromHTML(table, company, configPDF);
  }

  const renderItemDetails = (details: InvoiceDetail[]) => (
    <div className="mt-3 d-flex align-items-center gap-3">
      <h5>Detalle de Factura</h5>
      <div className="d-flex gap-2">
        <Button
          className="btn btn-phoenix-secondary mr-2 fas fa-file-pdf"
          onClick={limpiarFiltros}
        ></Button>
        <Button
          className="btn btn-phoenix-success fas fa-file-excel"
          onClick={limpiarFiltros}
        ></Button>
      </div>
    </div>
  );

  const renderAccountItem = (item: InvoiceData) => {
    const today = new Date();
    const dueDate = new Date(item.due_date);
    const daysToPay = Math.ceil(
      (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    const status = daysToPay < 0 ? "overdue" : "pending";

    return (
      <div className="p-3 border-bottom">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="d-flex align-items-center gap-3 mb-2 mb-md-0">
            <span className="fw-bold">FAC-{item.invoice_code}</span>
            <span className="badge bg-secondary">
              {item?.third_party?.name ?? "Sin cliente"}
            </span>
          </div>

          <div className="d-flex gap-4">
            <div className="text-end">
              <small className="text-muted d-block">Fecha Factura</small>
              <span>{obtenerFechaFormateada(item.created_at)}</span>
            </div>

            <div className="text-end">
              <small className="text-muted d-block">Fecha Vencimiento</small>
              <span
                className={status === "overdue" ? "text-danger fw-bold" : ""}
              >
                {obtenerFechaFormateada(item.due_date)}
              </span>
            </div>

            <div className="text-end">
              <small className="text-muted d-block">Total</small>
              <span className="fw-bold">
                {formatoDinero(item.total_amount)}
              </span>
            </div>

            <div className="text-center">
              <small className="text-muted d-block">Estado</small>
              {getStatusBadge(status, daysToPay)}
            </div>
          </div>
        </div>

        {renderItemDetails(item.details)}

        <div className="mt-3 row g-3">
          <div className="col-md-4">
            <div className="p-2 bg-light rounded">
              <small className="text-muted d-block">Monto Total</small>
              <span>{formatoDinero(item.total_amount)}</span>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-2 bg-light rounded">
              <small className="text-muted d-block">Monto Pendiente</small>
              <span>{formatoDinero(item.remaining_amount)}</span>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-2 bg-light rounded">
              <small className="text-muted d-block">Días para pagar</small>
              <span className={daysToPay <= 5 ? "text-danger fw-bold" : ""}>
                {daysToPay} días
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAccordionItems = (items: InvoiceData[], loading: boolean) => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      );
    }

    if (!items || items.length === 0) {
      return (
        <div className="d-flex justify-content-center align-items-center py-5">
          <p className="text-muted">
            No se encontraron registros con los filtros aplicados
          </p>
        </div>
      );
    }

    return (
      <div className="accordion custom-accordion">
        {items.map((item) => {
          const isExpanded = expandedId === item.id.toString();
          const dueDate = new Date(item.due_date);
          const today = new Date();
          const daysToPay = Math.ceil(
            (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );
          const status = daysToPay < 0 ? "overdue" : "pending";

          return (
            <div key={item.id} className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${
                    isExpanded ? "" : "collapsed"
                  }`}
                  type="button"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : item.id.toString())
                  }
                >
                  <div className="d-flex justify-content-between align-items-center w-100 pe-3">
                    <span className="fw-bold">FAC-{item.invoice_code}</span>
                    <div className="d-flex gap-4">
                      <span>{obtenerFechaFormateada(item.due_date)}</span>
                      <span className="fw-bold">
                        {formatoDinero(item.total_amount)}
                      </span>
                      {getStatusBadge(status, daysToPay)}
                    </div>
                  </div>
                </button>
              </h2>
              <div
                className={`accordion-collapse collapse ${
                  isExpanded ? "show" : ""
                }`}
              >
                <div className="accordion-body p-0">
                  {renderAccountItem(item)}
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mr-3">
                <Button
                  type="button"
                  raised
                  className="mr-2"
                  icon={<i className="fas fa-receipt"></i>}
                  onClick={() => {
                    generateReceipt(item);
                  }}
                ></Button>
                <Button
                  type="button"
                  icon={<i className="fas fa-file-pdf"></i>}
                  onClick={() => downloadPdf(item)}
                ></Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container-fluid py-3">
      <div className="card shadow-sm">
        <div className="card-header bg-light">
          <h2 className="h5 mb-0">Gestión de Cuentas</h2>
        </div>

        <div className="card-body p-0">
          <div className="accordion mb-3">
            <div className="accordion-item border-0">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#filtersCollapse"
                >
                  <i className="fas fa-filter me-2"></i> Filtros
                </button>
              </h2>
              <div
                id="filtersCollapse"
                className="accordion-collapse collapse p-3"
              >
                <div className="row g-3">
                  <div className="col-lg-3 col-md-6">
                    <label className="form-label">Cliente/Proveedor</label>
                    <MultiSelect
                      options={[]} // ← Aquí debes cargar proveedores/clientes reales
                      optionLabel="name"
                      optionValue="id"
                      filter
                      placeholder="Seleccione clientes/proveedores"
                      className="w-100"
                      value={selectedSupplierIds}
                      onChange={(e) => setSelectedSupplierIds(e.value)}
                      showClear
                    />
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <label className="form-label">Fecha de Factura</label>
                    <Calendar
                      selectionMode="range"
                      dateFormat="dd/mm/yy"
                      value={selectedDateRange}
                      onChange={(e) => setSelectedDateRange(e.value)}
                      className="w-100"
                      placeholder="Seleccione un rango"
                    />
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <label className="form-label">Fecha de Vencimiento</label>
                    <Calendar
                      selectionMode="range"
                      dateFormat="dd/mm/yy"
                      value={selectedDueDateRange}
                      onChange={(e) => setSelectedDueDateRange(e.value)}
                      className="w-100"
                      placeholder="Seleccione un rango"
                    />
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <label className="form-label">Días para pagar</label>
                    <Dropdown
                      options={daysToPayOptions}
                      optionLabel="label"
                      optionValue="value"
                      value={selectedDaysToPay}
                      onChange={(e) => setSelectedDaysToPay(e.value)}
                      className="w-100"
                      placeholder="Seleccione días"
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-end gap-2 mt-3">
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
                  />
                </div>
              </div>
            </div>
          </div>

          <TabView
            activeIndex={activeTab}
            onTabChange={(e) => setActiveTab(e.index)}
          >
            <TabPanel header="Cuentas por Cobrar" className="p-0">
              <div className="d-flex justify-content-end gap-2 me-3">
                <Button
                  tooltip="Exportar a excel - general"
                  tooltipOptions={{ position: "top" }}
                  type="button"
                  icon={<i className="fas fa-file-excel"></i>}
                  onClick={() => {
                    downloadExcelGeneral(
                      accountsReceivable,
                      "Cuentas_por_Cobrar"
                    );
                  }}
                ></Button>
                <Button
                  tooltip="Exportar a pdf - general"
                  tooltipOptions={{ position: "top" }}
                  type="button"
                  icon={<i className="fas fa-file-pdf"></i>}
                  onClick={() =>
                    downloadPdfGeneral(accountsReceivable, "Cuentas_por_Cobrar")
                  }
                ></Button>
              </div>
              <hr className="m-2" />
              {renderAccordionItems(accountsReceivable, loadingReceivable)}
              <Paginator
                first={first}
                rows={rows}
                totalRecords={totalReceivable}
                rowsPerPageOptions={[10, 20, 30, 50]}
                onPageChange={onPageChange}
              />
            </TabPanel>
            <TabPanel header="Cuentas por Pagar" className="p-0">
              <div className="d-flex justify-content-end gap-2 me-3">
                <Button
                  tooltip="Exportar a excel - general"
                  tooltipOptions={{ position: "top" }}
                  type="button"
                  icon={<i className="fas fa-file-excel"></i>}
                  onClick={() => {
                    downloadExcelGeneral(accountsPayable, "Cuentas_por_Pagar");
                  }}
                ></Button>
                <Button
                  tooltip="Exportar a pdf - general"
                  tooltipOptions={{ position: "top" }}
                  type="button"
                  icon={<i className="fas fa-file-pdf"></i>}
                  onClick={() =>
                    downloadPdfGeneral(accountsPayable, "Cuentas_por_Pagar")
                  }
                ></Button>
              </div>
              <hr className="m-2" />
              {renderAccordionItems(accountsPayable, loadingPayable)}
              <Paginator
                first={first}
                rows={rows}
                totalRecords={totalPayable}
                rowsPerPageOptions={[10, 20, 30, 50]}
                onPageChange={onPageChange}
              />
            </TabPanel>
          </TabView>
        </div>
      </div>
      <NewReceiptBoxModal
        visible={showReceiptModal}
        onHide={() => {
          setShowReceiptModal(false);
          setInvoiceToReceipt(null);
        }}
        onSubmit={handleGenerarRecibo}
        onSaveAndDownload={handleGenerarRecibo}
        initialData={{
          cliente: invoiceToReceipt?.third_party?.id?.toString() || "",
          idFactura: invoiceToReceipt?.id || 0,
          numeroFactura: invoiceToReceipt?.invoice_code || "",
          fechaElaboracion: invoiceToReceipt?.created_at || new Date(),
          valorPagado: invoiceToReceipt?.remaining_amount || 0,
          centreCost: invoiceToReceipt?.centre_cost || null,
          invoiceType: invoiceType || "",
        }}
      />
    </div>
  );
};
