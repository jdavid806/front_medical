import React, { useEffect, useRef, useState, useCallback } from "react";
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
import { formatDate } from "../../services/utilidades";
import { PurchaseBilling } from "../billing/purchase_billing/PurchaseBilling";
import { SalesBilling } from "../billing/sales_billing/SalesBilling";
import { FormPurchaseOrders } from "./form/FormPurchaseOrdersV2";
import { NewReceiptBoxModal } from "../accounting/paymentReceipt/modals/NewReceiptBoxModal";
import { generarFormatoContable } from "../../funciones/funcionesJS/generarPDFContable";
import { PurchaseOrderPayments } from "./PurchaseOrderPayments";
import { useThirdParties } from "../billing/third-parties/hooks/useThirdParties";
import { usePurchaseOrders } from "./hooks/usePurchaseOrders";

interface FiltrosOrdenes {
  orderNumber: string;
  type: string | null;
  thirdId: string | null;
  createdAt: Date[] | null;
  status: string | null;
}

interface PurchaseOrderTableItem {
  orderNumber: number;
  type: string;
  thirdPartyName: string;
  createdAt: Date;
  dueDate: string;
  total: number;
  status: string;
  cliente?: string;
  centre_cost?: any;
  subtotal?: number;
  discount?: number;
  iva?: number;
  total_amount?: number;
  due_date?: Date;
  quantity_total?: number;
  third_party_id?: number;
  user_id?: number;
  thirdParty?: any;
  details?: any[];
}

const purchaseOrderStates = {
  pending: "Pendiente",
  approved: "Aprobada",
  completed: "Completada",
  cancelled: "Anulada",
};

const purchaseOrderStateColors = {
  pending: "warning",
  approved: "info",
  completed: "success",
  cancelled: "danger",
};

const purchaseOrderTypes = {
  purchase: "Orden de compra",
  quote_of: "Cotizacion",
};

interface PurchaseOrdersProps {
  initialFilters?: FiltrosOrdenes;
  filterConfigs?: Record<keyof FiltrosOrdenes, {
    disabled?: boolean;
  }>;
  componentConfigs: {
    newPurchaseOrderBtn: {
      label: string;
      redirect: string;
    };
  }
}

export const PurchaseOrders: React.FC<PurchaseOrdersProps> = ({
  initialFilters,
  filterConfigs,
  componentConfigs = {
    newPurchaseOrderBtn: {
      label: "Nueva Orden de Compra",
      redirect: "OrdenesCompra"
    }
  }
}) => {
  // Estado para los filtros
  const [filtros, setFiltros] = useState<FiltrosOrdenes>({
    orderNumber: "",
    type: "",
    thirdId: "",
    createdAt: null,
    status: "",
  });

  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);
  const [showGenerateInvoiceModal, setShowGenerateInvoiceModal] = useState(false);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<PurchaseOrderTableItem | null>(null);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isModalToPayment, setIsModalToPayment] = useState(false);
  const [tableItems, setTableItems] = useState<PurchaseOrderTableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");

  const types = [
    { label: "Orden de compra", value: "purchase" },
    { label: "Cotizacion", value: "quote_of" },
  ];

  const states = [
    { label: "Pendiente", value: "pending" },
    { label: "Completada", value: "completed" },
    { label: "Rechazada", value: "cancelled" },
  ];
  const getInitialDataPurchaseOrder = (selectedPurchaseOrder) => {
    if (!selectedPurchaseOrder) return {};

    return {
      cliente: selectedPurchaseOrder?.cliente?.toString() || "",
      idFactura: selectedPurchaseOrder?.orderNumber || 0,
      numeroFactura: "",
      fechaElaboracion: selectedPurchaseOrder?.createdAt || new Date(),
      valorPagado: selectedPurchaseOrder?.total || 0,
      centreCost: selectedPurchaseOrder?.centre_cost || null,
      invoiceType: selectedPurchaseOrder?.type === "purchase"
        ? "purchase-order"
        : "sale-order",
      discount: selectedPurchaseOrder?.discount || 0,
      iva: selectedPurchaseOrder?.iva || 0,
      total_amount: selectedPurchaseOrder?.total_amount || 0,
      due_date: selectedPurchaseOrder?.due_date,
      quantity_total: selectedPurchaseOrder?.quantity_total || 0,
      third_party_id: selectedPurchaseOrder?.third_party_id || 0,
      user_id: Number(selectedPurchaseOrder?.user_id) || 0,
    };
  }

  const getCustomFilters = (): Record<keyof FiltrosOrdenes, any> => {
    const filters: any = {};

    if (filtros.thirdId) filters.thirdId = filtros.thirdId;
    if (filtros.orderNumber) filters.order_number = filtros.orderNumber;
    if (filtros.status) filters.status = filtros.status;
    if (filtros.type) filters.type = filtros.type;

    if (filtros.createdAt && filtros.createdAt.length > 0) {
      const validDates = filtros.createdAt.filter(date => !!date);
      if (validDates.length > 0) {
        filters.start_date = validDates[0].toISOString().split('T')[0];
        if (validDates.length > 1) {
          filters.end_date = validDates[1].toISOString().split('T')[0];
        }
      }
    }

    return filters;
  };

  const {
    purchaseOrders,
    handlePageChange,
    handleSortChange,
    handleSearchChange,
    refresh,
    totalRecords: purchaseOrdersTotal,
    first: purchaseOrdersFirst,
    loadingPurchaseOrders,
    perPage,
    sortField,
    sortOrder,
  } = usePurchaseOrders(getCustomFilters);

  const { thirdParties } = useThirdParties();
  const toast = useRef<Toast>(null);

  // Manejadores de cambio de filtros
  const handleFilterChange = (field: keyof FiltrosOrdenes, value: any) => {
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

  const aplicarFiltros = async (page = 1, per_page = 10) => {
    setTableLoading(true);
    try {
      // Simular aplicación de filtros
      await refresh();
    } catch (error) {
      console.error("Error aplicando filtros:", error);
      showToast("error", "Error", "No se pudieron aplicar los filtros");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    if (initialFilters) {
      setFiltros(initialFilters);
    }
  }, [initialFilters]);

  useEffect(() => {
    const mappedItems: PurchaseOrderTableItem[] = purchaseOrders.map((item) => {
      return {
        orderNumber: item.id,
        type: item.type,
        thirdPartyName: item.third_party?.name || "",
        createdAt: new Date(item.created_at),
        dueDate: formatDate(item.due_date),
        total: item.total_amount,
        status: item.status,
        cliente: item.third_id?.toString(),
        centre_cost: item.centre_cost || null,
        discount: item.total_discount || 0,
        iva: item.total_taxes || 0,
        total_amount: item.total_amount || 0,
        due_date: new Date(item.due_date),
        quantity_total: item.total_products || 0,
        third_party_id: item.third_id || 0,
        user_id: Number(item.buyer_id) || 0,
        thirdParty: item.third_party || null,
        details: item.details || [],
      };
    });
    setTableItems(mappedItems);
    setTotalRecords(purchaseOrdersTotal);
  }, [purchaseOrders]);

  // CORREGIDO: Función renombrada para evitar recursión
  const handleGenerateInvoiceClick = useCallback((rowData: PurchaseOrderTableItem) => {
    const orderDetails = purchaseOrders.find(
      (order) => order.id === rowData.orderNumber
    );

    if (orderDetails) {
      setSelectedPurchaseOrder({
        ...rowData,
        orderNumber: orderDetails.id,
        createdAt: new Date(orderDetails.created_at),
        dueDate: formatDate(orderDetails.due_date),
        total: orderDetails.total_amount,
        thirdPartyName: orderDetails.third_party?.name || "",
        cliente: orderDetails.third_id?.toString(),
        centre_cost: orderDetails.centre_cost || null,
      });
      setShowGenerateInvoiceModal(true);
      setIsModalEdit(false);
      setIsModalToPayment(false);
    }
  }, [purchaseOrders]);

  function handleToEdit(orderData: PurchaseOrderTableItem) {
    setSelectedPurchaseOrder(orderData);
    setIsModalEdit(true);
    setShowGenerateInvoiceModal(false);
    setIsModalToPayment(false);
  }

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      orderNumber: "",
      type: "",
      thirdId: "",
      createdAt: null,
      status: null,
    });
    refresh();
  };

  // Formatear número para montos en pesos dominicanos (DOP)
  const formatCurrency = (value: number) => {
    return value?.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) || "$0.00";
  };

  function handleToPayment(data: PurchaseOrderTableItem) {
    setSelectedPurchaseOrder(data);
    setIsModalToPayment(true);
    setShowGenerateInvoiceModal(false);
    setIsModalEdit(false);
  }

  function handleInvoiceSuccess(type: string) {
    setShowGenerateInvoiceModal(false);
    refresh();
    showToast("success", "Éxito", `Factura de ${type} generada correctamente`);
  }

  function handleSaveToPayment() { }

  function handleSaveAndDownloadToPayment() { }

  const handleDownloadPDF = useCallback((rowData: PurchaseOrderTableItem) => {
    generarFormatoContable("OrdenCompra", rowData, "Impresion");
    showToast("success", "Éxito", "PDF generado correctamente");
  }, []);

  const handleDownloadExcel = useCallback((rowData: PurchaseOrderTableItem) => {
    // Implementar lógica de descarga Excel
    showToast("success", "Éxito", "Excel descargado correctamente");
  }, []);

  function handleToAfterEdit() {
    setIsModalEdit(false);
    refresh();
    showToast("success", "Éxito", "Orden de compra editada correctamente");
  }

  function handleViewPaymentHistory(data: PurchaseOrderTableItem) {
    setSelectedPurchaseOrder(data);
    setShowPaymentHistoryModal(true);
  }

  const TableMenu: React.FC<{
    rowData: PurchaseOrderTableItem;
  }> = ({ rowData }) => {
    const menu = useRef<Menu>(null);

    const handleEdit = () => {
      handleToEdit(rowData);
    };

    const handleGenerateInvoice = () => {
      handleGenerateInvoiceClick(rowData); // Usar la función corregida
    };

    const handlePayment = () => {
      handleToPayment(rowData);
    };

    const handlePaymentHistory = () => {
      handleViewPaymentHistory(rowData);
    };

    const handlePDF = () => {
      handleDownloadPDF(rowData);
    };

    const handleExcel = () => {
      handleDownloadExcel(rowData);
    };

    const menuItems = [
      ...(rowData.status !== "approved" ? [
        {
          label: "Editar",
          icon: <i className="fa-solid fa-pencil me-2"></i>,
          command: handleEdit,
        },
        {
          label: "Generar factura",
          icon: <i className="fa-solid far fa-file me-2"></i>,
          command: handleGenerateInvoice,
        },
        {
          label: "Realizar abono",
          icon: <i className="fa-solid fa-money-bills me-2"></i>,
          command: handlePayment,
        },
        {
          label: "Historial de Abonos",
          icon: <i className="fa-solid fa-history me-2"></i>,
          command: handlePaymentHistory,
        }
      ] : []),
      {
        label: "Descargar PDF",
        icon: <i className="fa-solid fa-file-pdf me-2"></i>,
        command: handlePDF,
      },
      {
        label: "Descargar Excel",
        icon: <i className="fa-solid fa-file-excel me-2"></i>,
        command: handleExcel,
      }
    ];

    return (
      <div style={{ position: "relative" }}>
        <Button
          className="p-button-primary flex items-center gap-2"
          onClick={(e) => menu.current?.toggle(e)}
          aria-controls={`popup_menu_${rowData.orderNumber}`}
          aria-haspopup
        >
          Acciones
          <i className="fas fa-cog ml-2"></i>
        </Button>
        <Menu
          model={menuItems}
          popup
          ref={menu}
          id={`popup_menu_${rowData.orderNumber}`}
          appendTo={document.body}
          style={{ zIndex: 9999 }}
        />
      </div>
    );
  };

  const actionBodyTemplate = (rowData: PurchaseOrderTableItem) => {
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

  const handleSearchChangeCustom = (searchValue: string) => {
    setGlobalFilter(searchValue);
    handleSearchChange(searchValue);
  };

  const handleRefresh = async () => {
    limpiarFiltros();
    await refresh();
  };

  const columns: CustomPRTableColumnProps[] = [
    {
      field: "orderNumber",
      header: "No. Orden",
      sortable: true
    },
    {
      field: "type",
      header: "Tipo",
      sortable: true,
      body: (rowData: any) => purchaseOrderTypes[rowData.type] || rowData.type
    },
    {
      field: "thirdPartyName",
      header: "Proveedor",
      sortable: true
    },
    {
      field: "createdAt",
      header: "Fecha de elaboración",
      sortable: true,
      body: (rowData: any) => formatDate(rowData.createdAt)
    },
    {
      field: "dueDate",
      header: "Fecha de vencimiento",
      sortable: true,
      body: (rowData: any) => rowData.dueDate
    },
    {
      field: "total",
      header: "Valor Total",
      sortable: true,
      body: (rowData: any) => formatCurrency(rowData.total)
    },
    {
      field: "status",
      header: "Estado",
      sortable: true,
      body: (rowData: any) => (
        <Tag
          value={purchaseOrderStates[rowData.status] || rowData.status}
          severity={purchaseOrderStateColors[rowData.status] || "secondary"}
        />
      )
    },
    {
      field: "actions",
      header: "Acciones",
      body: actionBodyTemplate,
      exportable: false,
      width: "120px"
    }
  ];

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
                onClick={() => (window.location.href = componentConfigs.newPurchaseOrderBtn.redirect)}
              >
                <i className="fas fa-file-edit me-2"></i>
                {componentConfigs.newPurchaseOrderBtn.label}
              </Button>
            </div>

            <Accordion>
              <AccordionTab header="Filtros de Búsqueda">
                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">No. Orden</label>
                    <InputText
                      value={filtros.orderNumber}
                      onChange={(e) => handleFilterChange("orderNumber", e.target.value)}
                      placeholder="OC-001-0000001"
                      className="w-100"
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Tipo</label>
                    <Dropdown
                      value={filtros.type}
                      options={types}
                      onChange={(e) => handleFilterChange("type", e.value)}
                      optionLabel="label"
                      placeholder="Seleccionar tipo"
                      className="w-100"
                      disabled={filterConfigs?.type?.disabled || false}
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Proveedor</label>
                    <Dropdown
                      value={filtros.thirdId}
                      options={thirdParties}
                      onChange={(e) => handleFilterChange("thirdId", e.value)}
                      optionLabel="name"
                      optionValue="id"
                      placeholder="Seleccionar proveedor"
                      className="w-100"
                      disabled={filterConfigs?.thirdId?.disabled || false}
                      filter
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Fecha de elaboración</label>
                    <Calendar
                      value={filtros.createdAt}
                      onChange={(e) => handleFilterChange("createdAt", e.value)}
                      selectionMode="range"
                      readOnlyInput
                      dateFormat="dd/mm/yy"
                      placeholder="Seleccionar rango de fechas"
                      className="w-100"
                      showIcon
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Estado</label>
                    <Dropdown
                      value={filtros.status}
                      options={states}
                      onChange={(e) => handleFilterChange("status", e.value)}
                      optionLabel="label"
                      placeholder="Seleccionar estado"
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
              loading={tableLoading || loadingPurchaseOrders}
              onSearch={handleSearchChangeCustom}
              onReload={handleRefresh}
              paginator
              rows={rows}
              first={first}
              onPage={onPageChange}
              totalRecords={totalRecords}
              rowsPerPageOptions={[5, 10, 25, 50]}
              currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} órdenes"
              emptyMessage="No se encontraron órdenes de compra"
            />
          </div>
        </div>
      )}

      <Dialog
        header="Historial de Abonos"
        visible={showPaymentHistoryModal}
        onHide={() => setShowPaymentHistoryModal(false)}
        maximizable
        modal
        style={{ width: '90vw', height: '80vh', overflow: 'auto' }}
      >
        <PurchaseOrderPayments purchaseOrderId={selectedPurchaseOrder?.orderNumber?.toString() || "0"} />
      </Dialog>

      <Dialog
        contentClassName="overflow-hidden"
        maskClassName="overlay-invoices"
        header="Generar Factura"
        style={{ width: "90vw", maxHeight: "100%" }}
        visible={showGenerateInvoiceModal}
        onHide={() => setShowGenerateInvoiceModal(false)}
        modal={true}
        dismissableMask={true}
        resizable
      >
        {selectedPurchaseOrder?.type === "purchase" ? (
          <PurchaseBilling
            purchaseOrder={selectedPurchaseOrder}
            onClose={() => handleInvoiceSuccess("Compra")}
          />
        ) : selectedPurchaseOrder?.type === "quote_of" ? (
          <SalesBilling
            selectedInvoice={selectedPurchaseOrder}
            successSale={() => handleInvoiceSuccess("Venta")}
          />
        ) : (
          <div>No se pudo determinar el tipo de facturación</div>
        )}
      </Dialog>

      <NewReceiptBoxModal
        visible={isModalToPayment}
        onHide={() => {
          setIsModalToPayment(false);
        }}
        onSubmit={handleSaveToPayment}
        onSaveAndDownload={handleSaveAndDownloadToPayment}
        initialData={getInitialDataPurchaseOrder(selectedPurchaseOrder)}
      />

      <Dialog
        style={{ width: "90vw" }}
        header="Editar Orden de Compra"
        visible={isModalEdit}
        onHide={() => setIsModalEdit(false)}
      >
        <FormPurchaseOrders
          dataToEdit={selectedPurchaseOrder}
          onSuccessEdit={handleToAfterEdit}
        />
      </Dialog>
    </main>
  );
};