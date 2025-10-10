import React, { useState, useEffect } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { exportToExcel } from "../../accounting/utils/ExportToExcelOptions";
import { formatDate as formatDateUtils } from "../../../services/utilidades";
import { generatePDFFromHTML } from "../../../funciones/funcionesJS/exportPDF";
import { useCompany } from "../../hooks/useCompany";

// Import your services
import {
  productService,
  userService,
  patientService,
  billingService,
  entityService,
} from "../../../services/api/index";
import { Card } from "primereact/card";
import { useDataPagination } from "../../hooks/useDataPagination";
import {
  CustomPRTable,
  CustomPRTableColumnProps,
} from "../../components/CustomPRTable";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { Column } from "primereact/column";

export const ControlCashFlow = () => {
  // Set default date range (last 5 days)
  const today = new Date();
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(today.getDate() - 5);

  // State for filters
  const [procedures, setProcedures] = useState<any[]>([]);
  const [selectedProcedures, setSelectedProcedures] = useState([]);
  const [specialists, setSpecialists] = useState<any[]>([]);
  const [selectedSpecialists, setSelectedSpecialists] = useState([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [entities, setEntities] = useState<any[]>([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [dateRange, setDateRange] = useState([fiveDaysAgo, today]);
  const { company, setCompany, fetchCompany } = useCompany();

  // Export loading state
  const [exporting, setExporting] = useState({
    excel: false,
    pdf: false,
  });

  // Función para obtener datos del flujo de caja
  const fetchCashFlowData = async (params: any) => {
    try {
      // Combinar parámetros de paginación con filtros actuales
      const filterParams = {
        ...params,
        end_date: dateRange[1] ? formatDate(dateRange[1]) : "",
        start_date: dateRange[0] ? formatDate(dateRange[0]) : "",
        patient_ids: selectedPatients,
        product_ids: selectedProcedures,
        user_ids: selectedSpecialists,
        entity_id: selectedEntity,
      };

      // Usar el servicio de flujo de caja
      const data = await billingService.getCashFlowReport(filterParams);

      // Ajustar según la estructura de tu API
      return {
        data: data.data || data || [], // Ajusta según la estructura de tu API
        total:
          data.total || data.count || (Array.isArray(data) ? data.length : 0),
      };
    } catch (error) {
      console.error("Error fetching cash flow data:", error);
      return {
        data: [],
        total: 0,
      };
    }
  };

  // Hook de paginación
  const {
    data: reportData,
    loading: tableLoading,
    first,
    perPage,
    totalRecords,
    handlePageChange,
    handleSearchChange,
    refresh,
  } = useDataPagination({
    fetchFunction: fetchCashFlowData,
    defaultPerPage: 10,
  });

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load initial data
        await loadProcedures();
        await loadSpecialists();
        await loadPatients();
        await loadEntities();
        // Los datos se cargarán automáticamente mediante el hook useDataPagination
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };

    initializeData();
  }, []);

  const formatCurrency = (value: number) => {
    const formatted = new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
    }).format(value);
    return formatted;
  };

  const loadProcedures = async () => {
    try {
      const response = await productService.getAllProducts();
      setProcedures(
        response.data.map((item) => ({
          label: item.attributes.name,
          value: item.id,
        }))
      );
    } catch (error) {
      console.error("Error loading procedures:", error);
    }
  };

  const loadSpecialists = async () => {
    try {
      const response = await userService.getAllUsers();
      setSpecialists(
        response.map((user) => ({
          label: `${user.first_name} ${user.last_name} - ${
            user.specialty?.name || ""
          }`,
          value: user.id,
        }))
      );
    } catch (error) {
      console.error("Error loading specialists:", error);
    }
  };

  const loadPatients = async () => {
    try {
      const response = await patientService.getAll();
      setPatients(
        response.map((patient) => ({
          label: `${patient.first_name} ${patient.last_name}`,
          value: patient.id,
        }))
      );
    } catch (error) {
      console.error("Error loading patients:", error);
    }
  };

  const loadEntities = async () => {
    try {
      const response = await entityService.getAll();
      setEntities([
        { label: "Seleccione", value: null },
        ...response.data.map((entity) => ({
          label: entity.name,
          value: entity.id,
        })),
      ]);
    } catch (error) {
      console.error("Error loading entities:", error);
    }
  };

  const handleFilter = async () => {
    try {
      // Al llamar a refresh, el hook useDataPagination volverá a ejecutar fetchCashFlowData
      // con los filtros actualizados automáticamente
      refresh();
    } catch (error) {
      console.error("Error filtering data:", error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDataExport = (dataExport) => {
    const dataFilter = dataExport.map((item: any) => {
      return {
        procedimiento: item?.invoice.details
          .map((detail) => detail.product.name)
          .join(","),
        codigo_entidad: item?.authorization_number,
        copago:
          item?.invoice?.type === "entity"
            ? formatCurrency(item?.invoice?.total_amount)
            : formatCurrency(0),
        particular:
          item?.invoice?.type === "public"
            ? formatCurrency(item?.invoice?.total_amount)
            : formatCurrency(0),
        monto_autorizado: item?.entity_authorized_amount,
        fecha: formatDateUtils(item?.created_at),
        ingresos: formatCurrency(
          parseInt(item?.invoice?.total_amount) +
            (parseInt(item?.entity_authorized_amount) || 0) || 0
        ),
        salidas:
          item?.invoice?.status === "cancelled"
            ? formatCurrency(
                item?.invoice.notes.reduce(
                  (acc: number, note: any) => acc + parseInt(note.amount) || 0,
                  0
                )
              )
            : formatCurrency(0),
      };
    });

    return dataFilter;
  };

  const exportCashControlToExcel = async () => {
    try {
      setExporting({ ...exporting, excel: true });
      const dataExport = handleDataExport(reportData);
      exportToExcel({
        data: dataExport,
        fileName: `Control_caja_${formatDateUtils(new Date())}`,
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    } finally {
      setExporting({ ...exporting, excel: false });
    }
  };

  const exportCashFlowToPDF = () => {
    try {
      setExporting({ ...exporting, pdf: true });
      const dataExport = reportData;
      const fullIncome = reportData.reduce(
        (acc: number, item: any) =>
          acc +
          (parseInt(item?.invoice?.total_amount) +
            (parseInt(item?.entity_authorized_amount) || 0) || 0),
        0
      );
      const fullOutflows = reportData.reduce(
        (acc: number, item: any) =>
          acc +
          (item?.invoice?.status === "cancelled"
            ? item?.invoice.notes.reduce(
                (acc: number, note: any) => acc + parseInt(note.amount) || 0,
                0
              )
            : 0),
        0
      );

      // Generar las cabeceras de la tabla
      const headers = `
          <tr>
              <th>Procedimiento</th>
              <th>Codigo Entidad</th>
              <th>Copago</th>
              <th>Particular</th>
              <th>Monto autorizado</th>
              <th>Fecha</th>
              <th>Ingresos</th>
              <th>Salidas</th>
          </tr>
      `;

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
          .right { text-align: right; }
          .total-row {
            background-color: #f8f9fa;
            font-weight: bold;
            border-top: 2px solid #ddd;
          }
          .total-label {
            text-align: right;
            padding-right: 20px;
          }
          </style>
      
          <table>
            <thead>
              ${headers}
            </thead>
            <tbody>
              ${dataExport.reduce(
                (acc: string, rowData: any) =>
                  acc +
                  `
                <tr>
                  <td>${
                    rowData?.invoice?.details.length <= 1
                      ? rowData?.invoice?.details[0]?.product?.name || ""
                      : "Laboratorio"
                  }</td>
                  <td>${rowData?.authorization_number || ""}</td>
                  <td>${
                    rowData?.invoice?.type === "entity"
                      ? formatCurrency(rowData?.invoice?.total_amount || 0)
                      : formatCurrency(0)
                  }</td>
                  <td>${
                    rowData?.invoice?.type === "public"
                      ? formatCurrency(rowData?.invoice?.total_amount || 0)
                      : formatCurrency(0)
                  }</td>
                  <td>${formatCurrency(
                    rowData?.entity_authorized_amount || 0
                  )}</td>
                  <td>${formatDateUtils(rowData.created_at)}</td>
                  <td class="right">${formatCurrency(
                    (parseInt(rowData?.invoice?.total_amount) || 0) +
                      (parseInt(rowData?.entity_authorized_amount) || 0)
                  )}</td>
                  <td class="right">${
                    rowData?.invoice?.status === "cancelled"
                      ? formatCurrency(
                          rowData?.invoice.notes.reduce(
                            (acc: number, note: any) =>
                              acc + parseInt(note.amount) || 0,
                            0
                          )
                        )
                      : formatCurrency(0)
                  }</td>
                </tr>
              `,
                ""
              )}
              <!-- Fila de totales -->
              <tr class="total-row">
                <td colspan="6" class="total-label">TOTALES:</td>
                <td class="right">${formatCurrency(fullIncome)}</td>
                <td class="right">${formatCurrency(fullOutflows)}</td>
              </tr>
            </tbody>
          </table>`;
      const configPDF = {
        name: "Control_de_caja",
      };
      generatePDFFromHTML(table, company, configPDF);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
    } finally {
      setExporting({ ...exporting, pdf: false });
    }
  };

  // Definición de columnas para CustomPRTable
  const columns: CustomPRTableColumnProps[] = [
    {
      field: "invoice.id",
      header: "# Factura",
      body: (rowData: any) => rowData?.invoice?.id,
    },
    {
      field: "invoice.invoice_code",
      header: "Código de Factura",
      body: (rowData: any) => rowData?.invoice?.invoice_code,
    },
    {
      field: "procedure",
      header: "Procedimiento",
      body: (rowData: any) =>
        rowData?.invoice?.details.length <= 1
          ? rowData?.invoice?.details[0].product.name
          : "Laboratorio",
    },
    {
      field: "authorization_number",
      header: "Codigo Entidad",
      body: (rowData: any) => rowData?.authorization_number,
    },
    {
      field: "copayment",
      header: "Copago",
      body: (rowData: any) =>
        rowData?.invoice?.type === "entity"
          ? formatCurrency(rowData?.invoice?.total_amount)
          : formatCurrency(0),
    },
    {
      field: "authorized_amount_user",
      header: "Particular",
      body: (rowData: any) =>
        rowData?.invoice?.type === "public"
          ? formatCurrency(rowData?.invoice?.total_amount)
          : formatCurrency(0),
    },
    {
      field: "entity_authorized_amount",
      header: "Monto autorizado",
      body: (rowData: any) =>
        formatCurrency(rowData?.entity_authorized_amount || 0),
    },
    {
      field: "created_at",
      header: "Fecha",
      body: (rowData: any) => formatDateUtils(rowData.created_at),
    },
    {
      field: "income",
      header: "Ingresos",
      body: (rowData: any) =>
        formatCurrency(
          parseInt(rowData?.invoice?.total_amount) +
            (parseInt(rowData?.entity_authorized_amount) || 0) || 0
        ),
    },
    {
      field: "outflows",
      header: "Salidas",
      body: (rowData: any) =>
        rowData?.invoice?.status === "cancelled"
          ? formatCurrency(
              rowData?.invoice.notes.reduce(
                (acc: number, note: any) => acc + parseInt(note.amount) || 0,
                0
              )
            )
          : formatCurrency(0),
    },
  ];

  const footerGroup = (reportData: any) => {
    const fullIncome = reportData.reduce(
      (acc: number, item: any) =>
        acc +
        (parseInt(item?.invoice?.total_amount) +
          (parseInt(item?.entity_authorized_amount) || 0) || 0),
      0
    );
    const fullOutflows = reportData.reduce(
      (acc: number, item: any) =>
        acc +
        (item?.invoice?.status === "cancelled"
          ? item?.invoice.notes.reduce(
              (acc: number, note: any) => acc + parseInt(note.amount) || 0,
              0
            )
          : 0),
      0
    );
    return (
      <ColumnGroup>
        <Row>
          <Column
            footer="Totals:"
            colSpan={8}
            footerStyle={{ textAlign: "right" }}
          />
          <Column footer={formatCurrency(fullIncome)} />
          <Column footer={formatCurrency(fullOutflows)} />
        </Row>
      </ColumnGroup>
    );
  };

  return (
    <main className="main" id="top">
      <div className="pb-9">
        {tableLoading && (
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
        )}

        <div className="row g-3 justify-content-between align-items-start mb-4">
          <div className="col-12">
            <Card title="Filtros de Búsqueda" className="mb-3">
              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label" htmlFor="procedure">
                    Procedimientos
                  </label>
                  <MultiSelect
                    id="procedure"
                    value={selectedProcedures}
                    options={procedures}
                    onChange={(e) => setSelectedProcedures(e.value)}
                    placeholder="Seleccione procedimientos"
                    display="chip"
                    filter
                    className="w-100"
                  />
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label" htmlFor="especialistas">
                    Especialistas
                  </label>
                  <MultiSelect
                    id="especialistas"
                    value={selectedSpecialists}
                    options={specialists}
                    onChange={(e) => setSelectedSpecialists(e.value)}
                    placeholder="Seleccione especialistas"
                    display="chip"
                    filter
                    className="w-100"
                  />
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label" htmlFor="patients">
                    Pacientes
                  </label>
                  <MultiSelect
                    id="patients"
                    value={selectedPatients}
                    options={patients}
                    onChange={(e) => setSelectedPatients(e.value)}
                    placeholder="Seleccione pacientes"
                    display="chip"
                    filter
                    className="w-100"
                  />
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label" htmlFor="fechasProcedimiento">
                    Fecha inicio - fin Procedimiento
                  </label>
                  <Calendar
                    id="fechasProcedimiento"
                    value={dateRange}
                    onChange={(e: any) => setDateRange(e.value)}
                    selectionMode="range"
                    readOnlyInput
                    dateFormat="dd/mm/yy"
                    placeholder="dd/mm/yyyy - dd/mm/yyyy"
                    className="w-100"
                  />
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label" htmlFor="entity">
                    Entidad
                  </label>
                  <Dropdown
                    id="entity"
                    value={selectedEntity}
                    options={entities}
                    onChange={(e) => setSelectedEntity(e.value)}
                    placeholder="Seleccione entidad"
                    filter
                    className="w-100"
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end m-2">
                <Button
                  label="Filtrar"
                  icon="pi pi-filter"
                  onClick={handleFilter}
                  className="p-button-primary"
                />
              </div>
            </Card>
          </div>
        </div>

        <div className="row gy-5">
          <div className="col-12 col-xxl-12">
            <Card title="Control de Flujo de Caja" className="shadow-2">
              <div className="d-flex justify-content-end gap-2 mb-3">
                <Button
                  tooltip="Exportar a excel"
                  tooltipOptions={{ position: "top" }}
                  onClick={exportCashControlToExcel}
                  className="p-button-success"
                  disabled={
                    !reportData || reportData.length === 0 || exporting.excel
                  }
                  loading={exporting.excel}
                >
                  <i className="fa-solid fa-file-excel"></i>
                </Button>
                <Button
                  tooltip="Exportar a PDF"
                  tooltipOptions={{ position: "top" }}
                  onClick={exportCashFlowToPDF}
                  className="p-button-secondary"
                  disabled={
                    !reportData || reportData.length === 0 || exporting.pdf
                  }
                  loading={exporting.pdf}
                >
                  <i className="fa-solid fa-file-pdf"></i>
                </Button>
              </div>

              <CustomPRTable
                columns={columns}
                data={reportData}
                lazy
                first={first}
                rows={perPage}
                totalRecords={totalRecords}
                loading={tableLoading}
                onPage={handlePageChange}
                onSearch={handleSearchChange}
                onReload={refresh}
                footerGroup={footerGroup(reportData)}
              />
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};
