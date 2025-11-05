import React, { useEffect, useState } from "react";
import {
  productService,
  userService,
  comissionConfig,
  entityService,
} from "../../services/api/index.js";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { exportToExcel } from "../accounting/utils/ExportToExcelOptions";
import { generatePDFFromHTML } from "../../funciones/funcionesJS/exportPDF";
import { useCompany } from "../hooks/useCompany";
import { formatDate } from "../../services/utilidades.js";
import { useServicesFormat } from "../documents-generation/hooks/reports-medical/commissions/useServicesFormat";
import { useOrdersFormat } from "../documents-generation/hooks/reports-medical/commissions/useOrdersFormat";

export const Commissions = () => {
  const today = new Date();
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(today.getDate() - 5);
  const [selectedEntities, setSelectedEntities] = useState([]);
  const [selectedProcedures, setSelectedProcedures] = useState([]);
  const [selectedEspecialistas, setSelectedEspecialistas] = useState([]);
  const [dateRange, setDateRange] = useState<any>([fiveDaysAgo, today]);
  const [comissionData, setComissionData] = useState([]);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [especialistasOptions, setEspecialistasOptions] = useState([]);
  const [proceduresOptions, setProceduresOptions] = useState([]);
  const [entitiesOptions, setEntitiesOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("services");
  const [globalFilter, setGlobalFilter] = useState("");
  const { company, setCompany, fetchCompany } = useCompany();
  const { generateFormatServices } = useServicesFormat();
  const { generateFormatOrders } = useOrdersFormat();

  // Pagination state
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await cargarServicios();
        await cargarEspecialistas();
        await createSelectEntities();
        const filterParams = await obtenerFiltros();
        await handleTabChange("services", filterParams);
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const handleTabChange = async (tabId: string, filterParams: any) => {
    setActiveTab(tabId);
    setTableLoading(true);

    try {
      switch (tabId) {
        case "services":
          if (servicesData.length === 0) {
            const data = await comissionConfig.comissionReportServices(filterParams);
            setComissionData(data);
            const formattedData = formatDataToTable(data, "admissions_by_doctor");
            setServicesData(formattedData);
          }
          break;
        case "orders":
          if (ordersData.length === 0) {
            const dataToOrders = await comissionConfig.comissionReportByOrders(filterParams);
            const formattedData = formatDataToTable(dataToOrders, "admissions_prescriber_doctor");
            setOrdersData(formattedData);
          }
          break;
        default:
          console.warn(`Tab no reconocido: ${tabId}`);
      }
    } catch (error) {
      console.error(`Error cargando datos para ${tabId}:`, error);
    } finally {
      setTableLoading(false);
    }
  };

  const cargarServicios = async () => {
    try {
      const procedimientos = await productService.getAllProducts();
      setProceduresOptions(
        procedimientos.data.map((procedure) => ({
          value: procedure.id,
          label: procedure.attributes.name,
        }))
      );
    } catch (error) {
      console.error("Error loading services:", error);
    }
  };

  const createSelectEntities = async () => {
    try {
      const entities = await entityService.getAll();
      setEntitiesOptions(
        entities.data.map((entity) => ({
          value: entity.id,
          label: entity.name,
        }))
      );
    } catch (error) {
      console.error("Error loading entities:", error);
    }
  };

  const cargarEspecialistas = async () => {
    try {
      const especialistas = await userService.getAllUsers();
      setEspecialistasOptions(
        especialistas.map((especialista) => ({
          value: especialista.id,
          label: `${especialista.first_name} ${especialista.last_name} - ${especialista.specialty?.name || "Sin especialidad"
            }`,
        }))
      );
    } catch (error) {
      console.error("Error loading specialists:", error);
    }
  };

  const obtenerDatos = async (filterParams = {}) => {
    await handleTabChange(activeTab, filterParams);
  };

  const formatDataToTable = (users: any[], nodeKey: string) => {
    const flatData: any[] = [];

    users.forEach((user, userIndex) => {
      const nombre = `${user.first_name || ""} ${user.last_name || ""}`.trim();

      // Calcular totales para el profesional
      let totalMonto = 0;
      let totalBase = 0;
      let totalComision = 0;
      let totalRetencion = 0;
      let totalNetAmount = 0;

      // Procesar cada admisión del profesional
      user[nodeKey]?.forEach((admission, admissionIndex) => {
        const baseCalculation = calculateBase(admission);
        const commissionCalculation = calculateCommission(baseCalculation, admission);
        const retention = calculatedRetention(commissionCalculation, admission);
        const netAmountCalculated = commissionCalculation - retention;

        // Acumular totales
        totalMonto += admission?.invoice?.sub_type == "entity"
          ? parseFloat(admission.entity_authorized_amount || 0)
          : parseFloat(admission?.invoice?.total_amount || 0);
        totalBase += baseCalculation;
        totalComision += commissionCalculation;
        totalRetencion += retention;
        totalNetAmount += netAmountCalculated;

        // Agregar fila de admisión
        flatData.push({
          id: `admission_${userIndex}_${admissionIndex}`,
          profesional: nombre,
          monto: parseFloat(admission?.invoice?.sub_type == "entity"
            ? admission.entity_authorized_amount
            : admission?.invoice?.total_amount || 0),
          base: parseFloat(baseCalculation.toFixed(2)),
          comision: parseFloat(commissionCalculation.toFixed(2)),
          retencion: parseFloat(retention.toFixed(2)),
          netAmount: parseFloat(netAmountCalculated.toFixed(2)),
          invoiceCode: admission?.invoice?.invoice_code || "",
          invoiceId: admission?.invoice?.id || "",
          isProfessional: false,
          rawData: [admission]
        });
      });

      // Agregar fila de total del profesional (solo si tiene admisiones)
      if (user[nodeKey]?.length > 0) {
        flatData.push({
          id: `professional_${userIndex}`,
          profesional: nombre,
          monto: parseFloat(totalMonto.toFixed(2)),
          base: parseFloat(totalBase.toFixed(2)),
          comision: parseFloat(totalComision.toFixed(2)),
          retencion: parseFloat(totalRetencion.toFixed(2)),
          netAmount: parseFloat(totalNetAmount.toFixed(2)),
          invoiceCode: "TOTAL",
          invoiceId: "",
          isProfessional: true,
          rawData: user[nodeKey]
        });
      }
    });

    return flatData;
  };

  function calculateBase(admission) {
    let resultBase = 0;
    const comissionsInDetails = admission?.invoice?.details.filter(
      (detail) => detail.commission
    ).length;
    if (admission?.invoice?.sub_type == "entity") {
      resultBase =
        (Number(admission.entity_authorized_amount) /
          admission?.invoice?.details.length) *
        comissionsInDetails;
      return resultBase;
    } else {
      resultBase =
        (admission?.invoice?.total_amount /
          admission?.invoice?.details.length) *
        comissionsInDetails;
      return resultBase;
    }
  }

  function calculateCommission(baseCalculation, admission) {
    const comissionsInDetails = admission?.invoice?.details.map((detail) => {
      return detail.commission !== null;
    }).length;
    if (admission?.invoice?.commission?.commission_type == "percentage") {
      return (
        (baseCalculation *
          Math.floor(
            parseFloat(admission?.invoice?.commission?.commission_value)
          )) /
        100
      );
    } else {
      return (
        comissionsInDetails * admission?.invoice?.commission?.commission_value
      );
    }
  }

  function calculatedRetention(commissionCalculation, admission) {
    if (admission?.invoice?.commission?.retention_type == "percentage") {
      return (
        (commissionCalculation *
          Math.floor(
            parseFloat(admission?.invoice?.commission?.value_retention)
          )) /
        100
      );
    } else {
      if (admission?.invoice?.commission !== null) {
        return (
          Math.floor(
            parseFloat(admission?.invoice?.commission?.value_retention)
          ) || 0
        );
      }
    }
  }

  function exportToPDF(data: any[], mainNode: any) {
    switch (activeTab) {
      case "services":
        return generateFormatServices(data, mainNode, dateRange, "Impresion");
      case "orders":
        return generateFormatOrders(data, mainNode, dateRange, "Impresion");
    }
  }

  const exportButtonTemplate = (rowData: any) => {
    if (rowData.isProfessional) {
      return (
        <div className="d-flex gap-2">
          <Button
            tooltip="Exportar a Excel"
            tooltipOptions={{ position: "top" }}
            className="p-button-success p-button-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDescargarExcel(rowData.rawData);
            }}
          >
            <i className="fa-solid fa-file-excel"></i>
          </Button>
          <Button
            tooltip="Exportar a PDF"
            tooltipOptions={{ position: "top" }}
            className="p-button-secondary p-button-sm"
            onClick={(e) => {
              e.stopPropagation();
              exportToPDF(rowData.rawData, rowData);
            }}
          >
            <i className="fa-solid fa-file-pdf"></i>
          </Button>
        </div>
      );
    }
    return null;
  };

  const obtenerFiltros = () => {
    const paramsFilter = {
      end_date: dateRange?.[1]?.toISOString().split("T")[0] || "",
      start_date: dateRange?.[0]?.toISOString().split("T")[0] || "",
      service_ids: selectedProcedures.map((item: any) => item),
      user_ids: selectedEspecialistas.map((item: any) => item),
      entity_ids: selectedEntities.map((item: any) => item),
    };

    return paramsFilter;
  };

  const handleFilterClick = async () => {
    // Limpiar datos para forzar recarga
    setServicesData([]);
    setOrdersData([]);
    const paramsFilter = await obtenerFiltros();
    await obtenerDatos(paramsFilter);
    setFirst(0); // Reset to first page when filtering
  };

  const formatCurrency = (value: number) => {
    if (isNaN(value)) value = 0;
    return value.toLocaleString("es-CO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      style: "currency",
      currency: "COP",
    });
  };

  const handleDescargarExcel = (commission: any) => {
    const commissionDataExport = handleDataExport(commission);

    exportToExcel({
      data: commissionDataExport,
      fileName: `Comisiones`,
    });
  };

  function handleDataExport(commission) {
    const data = commission.map((item: any) => {
      return {
        paciente: `${item.patient.first_name ?? " "} ${item.patient.middle_name ?? " "
          }${item.patient.last_name ?? " "}${item.patient.second_last_name ?? " "
          }`,
        numero_documento: item.patient.document_number,
        fecha: formatDate(item.created_at, true),
        producto: item.appointment.product.attributes.name,
        monto_entidad: item.entity_authorized_amount,
        monto_paciente: item?.invoice?.total_amount ?? 0,
        invoice_code: item?.invoice?.invoice_code ?? "",
        id: item?.invoice?.id ?? "",
      };
    });

    return data;
  }

  const amountTemplate = (rowData: any) => formatCurrency(rowData.monto);
  const invoiceCodeTemplate = (rowData: any) => rowData.invoiceCode;
  const idTemplate = (rowData: any) => rowData.invoiceId;
  const baseTemplate = (rowData: any) => formatCurrency(rowData.base);
  const commissionTemplate = (rowData: any) => formatCurrency(rowData.comision);
  const retentionTemplate = (rowData: any) => formatCurrency(rowData.retencion);
  const netAmountTemplate = (rowData: any) => formatCurrency(rowData.netAmount);
  const profesionalTemplate = (rowData: any) =>
    rowData.isProfessional ? (
      <strong>{rowData.profesional}</strong>
    ) : (
      <span style={{ paddingLeft: "20px" }}>{rowData.profesional}</span>
    );

  const onPageChange = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const rowClassName = (data: any) => {
    return data.isProfessional ? 'font-bold bg-blue-50' : '';
  };

  const getCurrentData = () => {
    return activeTab === "services" ? servicesData : ordersData;
  };

  const getProfessionalCount = () => {
    const data = getCurrentData();
    return data.filter(item => item.isProfessional).length;
  };

  return (
    <main className="main" id="top">
      <div className="pb-9">
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
          <>
            <div className="row g-3 justify-content-between align-items-start mb-4">
              <div className="col-12">
                <div
                  className="card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto"
                  style={{ minHeight: "400px" }}
                >
                  <div className="card-body h-100 w-100 d-flex flex-column" style={{ marginTop: "-40px" }}>
                    <div className="tabs-professional-container mt-4">
                      <Accordion>
                        <AccordionTab header="Filtros">
                          <div className="row">
                            <div className="col-12 col-md-6 mb-3">
                              <label
                                className="form-label"
                                htmlFor="dateRange"
                              >
                                Fecha inicio - fin Procedimiento
                              </label>
                              <Calendar
                                id="dateRange"
                                value={dateRange}
                                onChange={(e: any) => setDateRange(e.value)}
                                selectionMode="range"
                                readOnlyInput
                                dateFormat="dd/mm/yy"
                                placeholder="Seleccione un rango de fechas"
                                className="w-100"
                              />
                            </div>
                            <div className="col-12 col-md-6 mb-3">
                              <label className="form-label">
                                Profesional
                              </label>
                              <MultiSelect
                                value={selectedEspecialistas}
                                options={especialistasOptions}
                                onChange={(e) =>
                                  setSelectedEspecialistas(e.value)
                                }
                                optionLabel="label"
                                placeholder="Seleccione profesionales"
                                className="w-100"
                                filter
                                display="chip"
                              />
                            </div>
                            <div className="col-12 col-md-6 mb-3">
                              <label className="form-label">
                                Servicios
                              </label>
                              <MultiSelect
                                value={selectedProcedures}
                                options={proceduresOptions}
                                onChange={(e) =>
                                  setSelectedProcedures(e.value)
                                }
                                optionLabel="label"
                                placeholder="Seleccione procedimientos"
                                className="w-100"
                                display="chip"
                              />
                            </div>
                            <div className="col-12 col-md-6 mb-3">
                              <label className="form-label">
                                Entidades
                              </label>
                              <MultiSelect
                                value={selectedEntities}
                                options={entitiesOptions}
                                onChange={(e) =>
                                  setSelectedEntities(e.value)
                                }
                                optionLabel="label"
                                placeholder="Seleccione entidades"
                                className="w-100"
                                display="chip"
                              />
                            </div>
                            <div className="col-12">
                              <div className="d-flex justify-content-end m-2">
                                <Button
                                  label="Filtrar"
                                  icon="pi pi-filter"
                                  onClick={handleFilterClick}
                                  className="p-button-primary"
                                  loading={loading}
                                />
                              </div>
                            </div>
                          </div>
                        </AccordionTab>
                      </Accordion>
                      <div className="tabs-header">
                        <button
                          className={`tab-item ${activeTab === "services" ? "active" : ""}`}
                          onClick={() => handleTabChange("services", obtenerFiltros())}
                        >
                          <i className="fas fa-stethoscope"></i>
                          Servicios
                        </button>
                        <button
                          className={`tab-item ${activeTab === "orders" ? "active" : ""}`}
                          onClick={() => handleTabChange("orders", obtenerFiltros())}
                        >
                          <i className="fas fa-prescription"></i>
                          Órdenes
                        </button>
                      </div>

                      <div className="tabs-content">
                        <div className={`tab-panel ${activeTab === "services" ? "active" : ""}`}>
                          <div className="d-flex justify-content-between align-items-center mb-4">
                            <span className="text-xl font-semibold">Comisiones por Servicios</span>
                          </div>

                          <div className="card">
                            {tableLoading ? (
                              <div className="text-center p-5">
                                <ProgressSpinner />
                                <p className="mt-2">Cargando datos...</p>
                              </div>
                            ) : (
                              <DataTable
                                value={servicesData}
                                loading={tableLoading}
                                scrollable
                                scrollHeight="600px"
                                showGridlines
                                stripedRows
                                size="small"
                                tableStyle={{ minWidth: "100%" }}
                                className="p-datatable-sm"
                                paginator
                                rows={rows}
                                first={first}
                                onPage={onPageChange}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                                globalFilter={globalFilter}
                                rowClassName={rowClassName}
                                sortMode="multiple"
                              >
                                <Column
                                  field="profesional"
                                  header="Profesional"
                                  body={profesionalTemplate}
                                  sortable
                                  style={{ minWidth: "250px" }}
                                />
                                <Column
                                  field="invoiceId"
                                  header="Id Factura"
                                  body={idTemplate}
                                  style={{ minWidth: "120px" }}
                                />
                                <Column
                                  field="invoiceCode"
                                  header="Código Factura"
                                  body={invoiceCodeTemplate}
                                  style={{ minWidth: "150px" }}
                                />
                                <Column
                                  field="monto"
                                  header="Monto"
                                  body={amountTemplate}
                                  sortable
                                  style={{ minWidth: "150px" }}
                                />
                                <Column
                                  field="base"
                                  header="Base Cálculo"
                                  body={baseTemplate}
                                  sortable
                                  style={{ minWidth: "150px" }}
                                />
                                <Column
                                  field="comision"
                                  header="Comisión"
                                  body={commissionTemplate}
                                  sortable
                                  style={{ minWidth: "150px" }}
                                />
                                <Column
                                  field="retencion"
                                  header="Retención"
                                  body={retentionTemplate}
                                  sortable
                                  style={{ minWidth: "150px" }}
                                />
                                <Column
                                  field="netAmount"
                                  header="Neto a pagar"
                                  body={netAmountTemplate}
                                  sortable
                                  style={{ minWidth: "150px" }}
                                />
                                <Column
                                  body={exportButtonTemplate}
                                  header="Exportar"
                                  style={{ width: "120px" }}
                                />
                              </DataTable>
                            )}
                            <div className="p-3 border-top">
                              <p className="mb-0 fw-semibold text-body">
                                Mostrando {getProfessionalCount()} profesionales
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Panel de Órdenes */}
                        <div className={`tab-panel ${activeTab === "orders" ? "active" : ""}`}>
                          <div className="d-flex justify-content-between align-items-center mb-4">
                            <span className="text-xl font-semibold">Comisiones por Órdenes</span>
                          </div>

                          <div className="card">
                            {tableLoading ? (
                              <div className="text-center p-5">
                                <ProgressSpinner />
                                <p className="mt-2">Cargando datos...</p>
                              </div>
                            ) : (
                              <DataTable
                                value={ordersData}
                                loading={tableLoading}
                                scrollable
                                scrollHeight="600px"
                                showGridlines
                                stripedRows
                                size="small"
                                tableStyle={{ minWidth: "100%" }}
                                className="p-datatable-sm"
                                paginator
                                rows={rows}
                                first={first}
                                onPage={onPageChange}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                                globalFilter={globalFilter}
                                rowClassName={rowClassName}
                                sortMode="multiple"
                              >
                                <Column
                                  field="profesional"
                                  header="Profesional"
                                  body={profesionalTemplate}
                                  sortable
                                  style={{ minWidth: "250px" }}
                                />
                                <Column
                                  field="invoiceId"
                                  header="Id Factura"
                                  body={idTemplate}
                                  style={{ minWidth: "120px" }}
                                />
                                <Column
                                  field="invoiceCode"
                                  header="Código Factura"
                                  body={invoiceCodeTemplate}
                                  style={{ minWidth: "150px" }}
                                />
                                <Column
                                  field="monto"
                                  header="Monto"
                                  body={amountTemplate}
                                  sortable
                                  style={{ minWidth: "150px" }}
                                />
                                <Column
                                  field="base"
                                  header="Base Cálculo"
                                  body={baseTemplate}
                                  sortable
                                  style={{ minWidth: "150px" }}
                                />
                                <Column
                                  field="comision"
                                  header="Comisión"
                                  body={commissionTemplate}
                                  sortable
                                  style={{ minWidth: "150px" }}
                                />
                                <Column
                                  field="retencion"
                                  header="Retención"
                                  body={retentionTemplate}
                                  sortable
                                  style={{ minWidth: "150px" }}
                                />
                                <Column
                                  field="netAmount"
                                  header="Neto a pagar"
                                  body={netAmountTemplate}
                                  sortable
                                  style={{ minWidth: "150px" }}
                                />
                                <Column
                                  body={exportButtonTemplate}
                                  header="Exportar"
                                  style={{ width: "120px" }}
                                />
                              </DataTable>
                            )}
                            <div className="p-3 border-top">
                              <p className="mb-0 fw-semibold text-body">
                                Mostrando {getProfessionalCount()} profesionales
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};