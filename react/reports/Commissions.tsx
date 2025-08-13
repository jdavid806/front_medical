import React, { useEffect, useState } from "react";
import {
  productService,
  userService,
  comissionConfig,
  entityService,
} from "../../services/api/index.js";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { exportToExcel } from "../accounting/utils/ExportToExcelOptions";
import { generatePDFFromHTML } from "../../funciones/funcionesJS/exportPDF";
import { useCompany } from "../hooks/useCompany";
import { Button } from "primereact/button";
import { formatDate } from "../../services/utilidades.js";

export const Commissions = () => {
  const today = new Date();
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(today.getDate() - 5);
  const [selectedEntities, setSelectedEntities] = useState([]);
  const [selectedProcedures, setSelectedProcedures] = useState([]);
  const [selectedEspecialistas, setSelectedEspecialistas] = useState([]);
  const [dateRange, setDateRange] = useState<any>([fiveDaysAgo, today]);
  const [comissionData, setComissionData] = useState([]);
  const [treeNodes, setTreeNodes] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState({});
  const [especialistasOptions, setEspecialistasOptions] = useState([]);
  const [proceduresOptions, setProceduresOptions] = useState([]);
  const [entitiesOptions, setEntitiesOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("tab-commissions");
  const { company, setCompany, fetchCompany } = useCompany();

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await cargarServicios();
        await cargarEspecialistas();
        await createSelectEntities();
        const filterParams = await obtenerFiltros();
        await handleTabChange("tab-commissions", filterParams);
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
    setLoading(true);

    try {
      switch (tabId) {
        case "tab-commissions":
          const data = await comissionConfig.comissionReportServices(
            filterParams
          );
          setComissionData(data);
          formatDataToTreeNodes(data, "admissions_by_doctor");
          break;
        case "tab-orders":
          const dataToOrders = await comissionConfig.comissionReportByOrders(
            filterParams
          );
          formatDataToTreeNodes(dataToOrders, "admissions_prescriber_doctor");
        default:
          console.warn(`Tab no reconocido: ${tabId}`);
      }
    } catch (error) {
      console.error(`Error cargando datos para ${tabId}:`, error);
    } finally {
      setLoading(false);
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
          label: `${especialista.first_name} ${especialista.last_name} - ${
            especialista.specialty?.name || "Sin especialidad"
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

  const formatDataToTreeNodes = (users: any[], nodeKey: string) => {
    const nodes: any = users.map((user, userIndex) => {
      const nombre = `${user.first_name || ""} ${user.last_name || ""}`.trim();
      const sumAmountTotal = user[nodeKey].reduce((total, admission) => {
        if (admission.invoice.sub_type === "entity") {
          const amount = parseFloat(admission.entity_authorized_amount) || 0;
          return total + amount;
        } else {
          const details = admission.invoice.details || [];
          const amountByPublic = details.reduce((totalDetail, detail) => {
            return totalDetail + (parseFloat(detail.amount) || 0);
          }, 0);
          return total + amountByPublic;
        }
      }, 0);

      let baseCalculationUser = 0;
      let commissionCalculatedUser = 0;
      let retentionCalculatedUser = 0;
      let netAmount = 0;

      const children =
        user[nodeKey]?.flatMap((admission, admissionIndex) => {
          admission.dataChild = null;
          const baseCalculation =
            (calculateBase(admission) *
              admission?.invoice?.commission?.percentage_value) /
            100;
          baseCalculationUser += baseCalculation;
          const commissionCalculation = calculateCommission(
            baseCalculation,
            admission
          );
          commissionCalculatedUser += commissionCalculation;
          const retention = calculatedRetention(
            commissionCalculation,
            admission
          );
          retentionCalculatedUser += retention;
          const netAmountCalculated = commissionCalculation - retention;
          netAmount += netAmountCalculated;

          admission.dataChild = {
            monto:
              admission.invoice.sub_type == "entity"
                ? parseInt(admission.entity_authorized_amount)
                : parseInt(admission.invoice.total_amount),
            base: baseCalculation,
            comision: commissionCalculation,
            retencion: retention,
            netAmount: netAmountCalculated,
          };

          return {
            key: `${userIndex}-${admissionIndex}`,
            data: {
              totalServices: "",
              monto:
                admission.invoice.sub_type == "entity"
                  ? admission.entity_authorized_amount
                  : admission.invoice.total_amount,
              base: baseCalculation,
              comision: commissionCalculation,
              retencion: retention,
              netAmount: netAmountCalculated,
              isLeaf: true,
            },
          };
        }) || [];

      return {
        key: userIndex.toString(),
        data: {
          profesional: nombre,
          monto: parseFloat(sumAmountTotal.toFixed(2)),
          base: parseFloat(baseCalculationUser.toFixed(2)),
          comision: parseFloat(commissionCalculatedUser.toFixed(2)),
          retencion: parseFloat(retentionCalculatedUser.toFixed(2)),
          netAmount: parseFloat(netAmount.toFixed(2)),
          isLeaf: false,
          rawData: user[nodeKey],
        },
        children: children,
      };
    });

    setTreeNodes(nodes);
    const keys = nodes.reduce((acc, node) => {
      acc[node.key] = true;
      return acc;
    }, {});
    setExpandedKeys(keys);
  };

  function calculateBase(admission) {
    let resultBase = 0;
    const comissionsInDetails = admission.invoice.details.filter((detail) => detail.commission ).length;
    if (admission.invoice.sub_type == "entity") {
      resultBase =
        (Number(admission.entity_authorized_amount) /
          admission.invoice.details.length) *
        comissionsInDetails;
      return resultBase;
    } else {
      resultBase =
        (admission.invoice.total_amount / admission.invoice.details.length) *
        comissionsInDetails;
      return resultBase;
    }
  }

  function calculateCommission(baseCalculation, admission) {
    const comissionsInDetails = admission.invoice.details.map((detail) => {
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
      return admission?.invoice?.commission?.value_retention;
    }
  }

  function exportToPDF(data: any[]) {
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
              <th>Paciente</th>
              <th>Número de documento</th>
              <th>Fecha</th>
              <th>Producto</th>
              <th>Monto entidad</th>
              <th>Monto paciente</th>
              <th>Monto</th>
              <th>Base calculo</th>
              <th>Comisión</th>
              <th>Retención</th>
              <th>Neto a pagar</th>
            </tr>
          </thead>
          <tbody>
            ${data.reduce(
              (acc: string, item: any) =>
                acc +
                `
              <tr>
                <td>${item.patient.first_name ?? ""} ${item.patient.middle_name ?? ""} ${item.patient.last_name ?? ""} ${item.patient.second_last_name ?? ""}</td>
                <td>${item.patient.document_number ?? ""}</td>
                <td>${ formatDate(item.created_at) ?? ""}</td>
                <td>${item.appointment?.product?.attributes?.name ?? ""}</td>
                <td>$${item.entity_authorized_amount ?? ""}</td>
                <td>$${item.invoice?.total_amount ?? ""}</td>
                <td>$${item.dataChild?.monto ?? ""}</td>
                <td>$${item.dataChild?.base ?? ""}</td>
                <td>$${item.dataChild?.comision ?? ""}</td>
                <td>$${item.dataChild?.retencion ?? ""}</td>
                <td>$${item.dataChild?.netAmount ?? ""}</td>
              </tr>
            `,
              ""
            )}
          </tbody>
        </table>`;
    const configPDF = {
      name: "Comisiones",
    };
    generatePDFFromHTML(table, company, configPDF);
}

  const exportButtonTemplate = (node: any) => {
    if (!node.data.isLeaf) {
      return (
        <div className="d-flex gap-2">
          <Button
            tooltip="Exportar a Excel"
            tooltipOptions={{ position: "top" }}
            className="p-button-success d-flex justify-content-center"
            onClick={(e) => {
              e.stopPropagation();
              handleDescargarExcel(node.data.rawData);
            }}
          >
            <i className="fa-solid fa-file-excel"></i>
          </Button>
          <Button
            tooltip="Exportar a PDF"
            tooltipOptions={{ position: "top" }}
            className="p-button-secondary d-flex justify-content-center"
            onClick={(e) => {
              e.stopPropagation();
              exportToPDF(node.data.rawData);
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
    const paramsFilter = await obtenerFiltros();
    await obtenerDatos(paramsFilter);
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
        paciente: `${item.patient.first_name ?? " "} ${
          item.patient.middle_name ?? " "
        }${item.patient.last_name ?? " "}${
          item.patient.second_last_name ?? " "
        }`,
        numero_documento: item.patient.document_number,
        fecha: item.created_at,
        producto: item.appointment.product.attributes.name,
        monto_entidad: item.entity_authorized_amount,
        monto_paciente: item.invoice.total_amount,
      };
    });

    return data;
  }

  const amountTemplate = (node: any) => formatCurrency(node.data.monto);
  const baseTemplate = (node: any) => formatCurrency(node.data.base);
  const commissionTemplate = (node: any) => formatCurrency(node.data.comision);
  const retentionTemplate = (node: any) => formatCurrency(node.data.retencion);
  const netAmountTemplate = (node: any) => formatCurrency(node.data.netAmount);
  const profesionalTemplate = (node: any) =>
    node.data.isLeaf ? (
      <span style={{ paddingLeft: "30px" }}>{node.data.profesional}</span>
    ) : (
      <strong>{node.data.profesional}</strong>
    );

  return (
    <main className="main" id="top">
      <div className="content">
        <div className="pb-9">
          <h2 className="mb-4">Comisiones por Profesional</h2>
          <div className="row g-3 justify-content-between align-items-start mb-4">
            <div className="col-12">
              <ul className="nav nav-underline fs-9" id="myTab" role="tablist">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    id="range-dates-tab"
                    data-bs-toggle="tab"
                    href="#tab-range-dates"
                    role="tab"
                    aria-controls="tab-range-dates"
                    aria-selected="true"
                  >
                    Filtros
                  </a>
                </li>
              </ul>
              <div className="tab-content mt-3" id="myTabContent">
                <div
                  className="tab-pane fade show active"
                  id="tab-range-dates"
                  role="tabpanel"
                  aria-labelledby="range-dates-tab"
                >
                  <div className="d-flex">
                    <div style={{ width: "100%" }}>
                      <div className="row">
                        <div className="col-12 mb-3">
                          <div className="card border border-light">
                            <div className="card-body">
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
                              </div>
                              <div className="d-flex justify-content-end m-2">
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={handleFilterClick}
                                  disabled={loading}
                                >
                                  {loading ? (
                                    <>
                                      <i className="pi pi-spinner pi-spin me-2"></i>
                                      Procesando...
                                    </>
                                  ) : (
                                    "Filtrar"
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row gy-5">
            <div className="col-12 col-xxl-12">
              <ul className="nav nav-underline fs-9" id="myTab" role="tablist">
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      activeTab === "tab-commissions" ? "active" : ""
                    }`}
                    id="commissions-tab"
                    data-bs-toggle="tab"
                    href="#tab-commissions"
                    role="tab"
                    aria-controls="tab-commissions"
                    aria-selected={activeTab === "tab-commissions"}
                    onClick={() =>
                      handleTabChange("tab-commissions", obtenerFiltros())
                    }
                  >
                    Entidad
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      activeTab === "tab-orders" ? "active" : ""
                    }`}
                    id="orders-tab"
                    data-bs-toggle="tab"
                    href="#tab-orders"
                    role="tab"
                    aria-controls="tab-orders"
                    aria-selected={activeTab === "tab-orders"}
                    onClick={() =>
                      handleTabChange("tab-orders", obtenerFiltros())
                    }
                  >
                    Órdenes
                  </a>
                </li>
              </ul>

              <div className="col-12 tab-content mt-3" id="myTabContent">
                <div
                  className={`tab-pane fade ${
                    activeTab === "tab-commissions" ? "show active" : ""
                  }`}
                  id="tab-commissions"
                  role="tabpanel"
                  aria-labelledby="commissions-tab"
                >
                  <div className="border-top border-translucent">
                    {loading ? (
                      <div className="text-center p-5">
                        <i
                          className="pi pi-spinner pi-spin"
                          style={{ fontSize: "2rem" }}
                        ></i>
                        <p>Cargando datos...</p>
                      </div>
                    ) : (
                      <div id="purchasersSellersTable">
                        <div className="card">
                          <TreeTable
                            value={treeNodes}
                            expandedKeys={expandedKeys}
                            onToggle={(e) => setExpandedKeys(e.value)}
                            scrollable
                            scrollHeight="600px"
                          >
                            <Column
                              field="profesional"
                              header="Profesional"
                              body={profesionalTemplate}
                              expander
                            />
                            <Column
                              field="monto"
                              header="Monto"
                              body={amountTemplate}
                            />
                            <Column
                              field="base"
                              header="Base Cálculo"
                              body={baseTemplate}
                            />
                            <Column
                              field="comision"
                              header="Comisión"
                              body={commissionTemplate}
                            />
                            <Column
                              field="retencion"
                              header="Retención"
                              body={retentionTemplate}
                            />
                            <Column
                              field="netAmount"
                              header="Neto a pagar"
                              body={netAmountTemplate}
                            />
                            <Column
                              field="entidad"
                              header="Factura a Entidad"
                            />
                            <Column
                              field="exportar"
                              header="Exportar"
                              body={exportButtonTemplate}
                              style={{ width: "120px" }}
                            />
                          </TreeTable>
                        </div>
                        <div className="row align-items-center justify-content-between pe-0 fs-9 mt-3">
                          <div className="col-auto d-flex">
                            <p className="mb-0 d-none d-sm-block me-3 fw-semibold text-body">
                              Mostrando {treeNodes.length} profesionales
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className={`tab-pane fade ${
                    activeTab === "tab-orders" ? "show active" : ""
                  }`}
                  id="tab-orders"
                  role="tabpanel"
                  aria-labelledby="orders-tab"
                >
                  <div className="border-top border-translucent">
                    {loading ? (
                      <div className="text-center p-5">
                        <i
                          className="pi pi-spinner pi-spin"
                          style={{ fontSize: "2rem" }}
                        ></i>
                        <p>Cargando datos...</p>
                      </div>
                    ) : (
                      <div id="purchasersSellersTable">
                        <div className="card">
                          <TreeTable
                            value={treeNodes}
                            expandedKeys={expandedKeys}
                            onToggle={(e) => setExpandedKeys(e.value)}
                            scrollable
                            scrollHeight="600px"
                          >
                            <Column
                              field="profesional"
                              header="Profesional"
                              body={profesionalTemplate}
                              expander
                            />
                            <Column
                              field="monto"
                              header="Monto"
                              body={amountTemplate}
                            />
                            <Column
                              field="base"
                              header="Base Cálculo"
                              body={baseTemplate}
                            />
                            <Column
                              field="comision"
                              header="Comisión"
                              body={commissionTemplate}
                            />
                            <Column
                              field="retencion"
                              header="Retención"
                              body={retentionTemplate}
                            />
                            <Column
                              field="netAmount"
                              header="Neto a pagar"
                              body={netAmountTemplate}
                            />
                            <Column
                              field="entidad"
                              header="Factura a Entidad"
                            />
                            <Column
                              field="exportar"
                              header="Exportar"
                              body={exportButtonTemplate}
                              style={{ width: "120px" }}
                            />
                          </TreeTable>
                        </div>
                        <div className="row align-items-center justify-content-between pe-0 fs-9 mt-3">
                          <div className="col-auto d-flex">
                            <p className="mb-0 d-none d-sm-block me-3 fw-semibold text-body">
                              Mostrando {treeNodes.length} profesionales
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
