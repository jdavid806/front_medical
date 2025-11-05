import React, { useState, useEffect } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { Accordion, AccordionTab } from "primereact/accordion";
import { generatePDFFromHTML } from "../../funciones/funcionesJS/exportPDF";
import { useCompany } from "../hooks/useCompany";
import { useProceduresCashFormat } from "../documents-generation/hooks/reports-medical/invoices/useProceduresCashFormat";
import { useProceduresCountFormat } from "../documents-generation/hooks/reports-medical/invoices/useProceduresCountFormat";
import { useEntitiesFormat } from "../documents-generation/hooks/reports-medical/invoices/useEntitiesFormat";
import { usePaymentsFormat } from "../documents-generation/hooks/reports-medical/invoices/usePaymentsFormat";

// Import your services
import {
  productService,
  userService,
  patientService,
  billingService,
  entityService,
} from "../../services/api/index";

import {
  ExportButtonProps,
  exportProceduresToExcel,
  exportEntitiesToExcel,
  exportPaymentsToExcel,
  BillingReportData,
} from "./excel/ExcelInvoices";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

type TextAlign =
  | "left"
  | "right"
  | "center"
  | "justify"
  | "initial"
  | "inherit";

interface ColumnStyle extends React.CSSProperties {
  minWidth?: string;
  textAlign?: TextAlign;
}

interface TableColumn {
  field: string;
  header: string;
  body?: (rowData: any) => React.ReactNode;
  style?: ColumnStyle;
  headerStyle?: ColumnStyle;
}

export const InvoicesReport = () => {
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

  // State for report data
  const [reportData, setReportData] = useState<BillingReportData[]>([]);
  const [activeTab, setActiveTab] = useState("procedures");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const { company, setCompany, fetchCompany } = useCompany();
  const { generateFormatProceduresCash } = useProceduresCashFormat();
  const { generateFormatProceduresCount } = useProceduresCountFormat();
  const { generateFormatEntities } = useEntitiesFormat();
  const { generateFormatPayments } = usePaymentsFormat();

  // Pagination state
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  const [exporting, setExporting] = useState({
    procedures: false,
    entities: false,
    payments: false,
  });

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        // Load initial data
        await loadData();
        await loadProcedures();
        await loadSpecialists();
        await loadPatients();
        await loadEntities();
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const loadData = async (filterParams = {}) => {
    try {
      setTableLoading(true);
      const data = await billingService.getBillingReport(filterParams);
      setReportData(data);
    } catch (error) {
      console.error("Error loading report data:", error);
    } finally {
      setTableLoading(false);
    }
  };

  const onPageChange = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const formatCurrency = (value: number) => {
    const formatted = new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
    }).format(value);

    // Reemplazar "RD$" por "$"
    return formatted.replace("RD$", "$");
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
          label: `${user.first_name} ${user.last_name} - ${user.specialty?.name || ""
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

  const createColumnStyle = (
    textAlign: TextAlign = "left",
    minWidth: string = "150px"
  ): ColumnStyle => ({
    textAlign,
    minWidth,
  });

  const handleFilter = async () => {
    try {
      const filterParams = {
        end_date: dateRange[1] ? formatDate(dateRange[1]) : "",
        start_date: dateRange[0] ? formatDate(dateRange[0]) : "",
        patient_ids: selectedPatients,
        product_ids: selectedProcedures,
        user_ids: selectedSpecialists,
        entity_id: selectedEntity,
      };

      await loadData(filterParams);
      setFirst(0); // Reset to first page when filtering
    } catch (error) {
      console.error("Error filtering data:", error);
    }
  };

  const handleExportProcedures = async () => {
    try {
      setExporting({ ...exporting, procedures: true });
      await exportProceduresToExcel(reportData);
    } catch (error) {
      console.error("Error exporting procedures:", error);
      alert(error.message);
    } finally {
      setExporting({ ...exporting, procedures: false });
    }
  };

  function exportToProceduresPDF(tab = "") {
    let dataExport: any = [];

    switch (tab) {
      case "procedures":
        dataExport = generateProceduresTable(true);
        return generateFormatProceduresCash(dataExport, dateRange, "Impresion");
      case "procedures-count":
        dataExport = generateProceduresCountTable(true);
        return generateFormatProceduresCount(
          dataExport,
          dateRange,
          "Impresion"
        );
      case "entities":
        dataExport = generateEntitiesTable(true);
        return generateFormatEntities(dataExport, dateRange, "Impresion");
      case "payments":
        dataExport = generatePaymentsTable(true);
        return generateFormatPayments(dataExport, dateRange, "Impresion");
    }
  }

  const handleExportEntities = async () => {
    try {
      setExporting({ ...exporting, entities: true });
      await exportEntitiesToExcel(reportData);
    } catch (error) {
      console.error("Error exporting entities:", error);
      alert(error.message);
    } finally {
      setExporting({ ...exporting, entities: false });
    }
  };

  const handleExportPayments = async () => {
    try {
      setExporting({ ...exporting, payments: true });
      await exportPaymentsToExcel(reportData);
    } catch (error) {
      console.error("Error exporting payments:", error);
      alert(error.message);
    } finally {
      setExporting({ ...exporting, payments: false });
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const generateProceduresTable = (returnData = false) => {
    if (!reportData || reportData.length === 0) {
      return (
        <div
          className="flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <span>No hay datos disponibles</span>
        </div>
      );
    }

    const users = [
      ...new Set(reportData.map((item: any) => item.billing_user)),
    ];
    const procedures = [
      ...new Set(
        reportData.flatMap(
          (item: any) => item.billed_procedure?.map((p) => p.product.name) || []
        )
      ),
    ];

    // Procesar datos para tener 3 métricas por usuario
    const tableRows = procedures.map((proc: any) => {
      const row = { procedimiento: proc };
      let rowTotal = 0;

      users.forEach((user) => {
        // Primera métrica: Cantidad
        const count = reportData
          .filter((item: any) => item.billing_user === user)
          .flatMap((item: any) => item)
          .filter(
            (item) =>
              item.sub_type == "entity" &&
              item.billed_procedure.some((p: any) => p.product.name === proc)
          )
          .reduce(
            (sum, i) =>
              sum +
              parseFloat(
                i.billed_procedure.filter((p) => p.product.name === proc)[0]
                  ?.amount ?? 0
              ),
            0
          );

        // Segunda métrica: Monto total
        const amount = reportData
          .filter((item: any) => item.billing_user === user)
          .flatMap((item: any) => item)
          .filter(
            (item) =>
              item.sub_type == "public" &&
              item.billed_procedure.some((p: any) => p.product.name === proc)
          )
          .reduce(
            (sum, i) =>
              sum +
              parseFloat(
                i.billed_procedure.filter((p) => p.product.name === proc)[0]
                  ?.amount ?? 0
              ),
            0
          );

        // Tercera métrica: Promedio
        const average = reportData
          .filter((item: any) => item.billing_user === user)
          .flatMap((item: any) => item)
          .filter((item) =>
            item.billed_procedure.some((p: any) => p.product.name === proc)
          )
          .reduce((sum, p) => sum + parseFloat(p.entity_authorized_amount), 0);

        row[`${user}_count`] = count;
        row[`${user}_amount`] = amount;
        row[`${user}_avg`] = average;

        rowTotal += amount;
      });

      row["total"] = rowTotal;
      return row;
    });

    // Calcular totales para el footer
    const footerData = {
      procedimiento: "TOTALES",
      isFooter: true,
      style: { fontWeight: "bold", backgroundColor: "#f8f9fa" },
    };

    users.forEach((user) => {
      footerData[`${user}_count`] = tableRows.reduce(
        (sum, row) => sum + (row[`${user}_count`] || 0),
        0
      );
      footerData[`${user}_amount`] = tableRows.reduce(
        (sum, row) => sum + (row[`${user}_amount`] || 0),
        0
      );
      footerData[`${user}_avg`] = tableRows.reduce(
        (sum, row) => sum + (row[`${user}_avg`] || 0),
        0
      );
    });

    footerData["total"] = tableRows.reduce(
      (sum, row) => sum + (row.total || 0),
      0
    );

    if (returnData) {
      return reportData;
    }

    // Crear columnas para la tabla
    const procedureColumns: TableColumn[] = [
      {
        field: "procedimiento",
        header: "Procedimiento",
        style: createColumnStyle("left", "200px"),
        body: (rowData: any) => (
          <span
            style={{
              fontWeight:
                rowData.isTotal || rowData.isFooter ? "bold" : "normal",
              fontSize:
                rowData.isTotal || rowData.isFooter ? "1.1em" : "inherit",
            }}
          >
            {rowData.procedimiento}
          </span>
        ),
        footer: "TOTALES",
        footerStyle: { fontWeight: "bold", textAlign: "left" },
      },
      ...users.flatMap((user) => [
        {
          field: `${user}_count`,
          header: "Copago",
          body: (rowData: any) => (
            <span
              style={{
                fontWeight:
                  rowData.isTotal || rowData.isFooter ? "bold" : "normal",
                fontSize:
                  rowData.isTotal || rowData.isFooter ? "1.1em" : "inherit",
              }}
            >
              {rowData[`${user}_count`]
                ? formatCurrency(rowData[`${user}_count`])
                : "-"}
            </span>
          ),
          footer: () => (
            <span style={{ fontWeight: "bold" }}>
              {formatCurrency(footerData[`${user}_count`])}
            </span>
          ),
          style: createColumnStyle("right"),
          headerStyle: createColumnStyle("right"),
          footerStyle: { fontWeight: "bold", textAlign: "right" },
        },
        {
          field: `${user}_amount`,
          header: "Particular",
          body: (rowData: any) => (
            <span
              style={{
                fontWeight:
                  rowData.isTotal || rowData.isFooter ? "bold" : "normal",
                fontSize:
                  rowData.isTotal || rowData.isFooter ? "1.1em" : "inherit",
              }}
            >
              {rowData[`${user}_amount`]
                ? formatCurrency(rowData[`${user}_amount`])
                : "-"}
            </span>
          ),
          footer: () => (
            <span style={{ fontWeight: "bold" }}>
              {formatCurrency(footerData[`${user}_amount`])}
            </span>
          ),
          style: createColumnStyle("right"),
          headerStyle: createColumnStyle("right"),
          footerStyle: { fontWeight: "bold", textAlign: "right" },
        },
        {
          field: `${user}_avg`,
          header: "Monto autorizado",
          body: (rowData: any) => (
            <span
              style={{
                fontWeight:
                  rowData.isTotal || rowData.isFooter ? "bold" : "normal",
                fontSize:
                  rowData.isTotal || rowData.isFooter ? "1.1em" : "inherit",
              }}
            >
              {rowData[`${user}_avg`]
                ? formatCurrency(rowData[`${user}_avg`])
                : "-"}
            </span>
          ),
          footer: () => (
            <span style={{ fontWeight: "bold" }}>
              {formatCurrency(footerData[`${user}_avg`])}
            </span>
          ),
          style: createColumnStyle("right"),
          headerStyle: createColumnStyle("right"),
          footerStyle: { fontWeight: "bold", textAlign: "right" },
        },
      ]),
      {
        field: "total",
        header: "Total General",
        body: (rowData: any) => (
          <span
            style={{
              fontWeight:
                rowData.isTotal || rowData.isFooter ? "bold" : "normal",
              fontSize:
                rowData.isTotal || rowData.isFooter ? "1.1em" : "inherit",
            }}
          >
            {formatCurrency(rowData.total)}
          </span>
        ),
        footer: () => (
          <span style={{ fontWeight: "bold" }}>
            {formatCurrency(footerData.total)}
          </span>
        ),
        style: createColumnStyle("right"),
        headerStyle: createColumnStyle("right"),
        footerStyle: { fontWeight: "bold", textAlign: "right" },
      },
    ];

    // Crear grupo de encabezados
    const headerGroup = (
      <ColumnGroup>
        <Row>
          <Column header="Procedimiento" rowSpan={2} />
          {users.map((user) => (
            <Column key={user} header={user} colSpan={3} />
          ))}
          <Column header="Total General" rowSpan={2} />
        </Row>
        <Row>
          {users.flatMap((user) => [
            <Column key={`${user}_count`} header="Copago" />,
            <Column key={`${user}_amount`} header="Particular" />,
            <Column key={`${user}_avg`} header="Monto autorizado" />,
          ])}
        </Row>
      </ColumnGroup>
    );

    return (
      <div className="card">
        {tableLoading ? (
          <div
            className="flex justify-content-center align-items-center"
            style={{ height: "200px", marginLeft: "800px" }}
          >
            <ProgressSpinner />
          </div>
        ) : (
          <DataTable
            headerColumnGroup={headerGroup}
            value={tableRows}
            loading={tableLoading}
            scrollable
            scrollHeight="flex"
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
            footerColumnGroup={
              <ColumnGroup>
                <Row>
                  {procedureColumns.map((col, index) => (
                    <Column
                      key={`footer-${index}`}
                      footer={col.footer}
                      footerStyle={col.footerStyle}
                    />
                  ))}
                </Row>
              </ColumnGroup>
            }
          >
            {procedureColumns.map((col, i) => {
              return (
                <Column
                  key={i}
                  field={col.field}
                  header={col.header}
                  body={col.body}
                  style={col.style}
                  headerStyle={col.headerStyle}
                  footer={col.footer}
                  footerStyle={col.footerStyle}
                />
              );
            })}
          </DataTable>
        )}
      </div>
    );
  };

  const generateProceduresCountTable = (returnData = false) => {
    if (!reportData || reportData.length === 0) {
      return (
        <div
          className="flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <span>No hay datos disponibles</span>
        </div>
      );
    }

    const users = [
      ...new Set(reportData.map((item: any) => item.billing_user)),
    ];
    const procedures = [
      ...new Set(
        reportData.flatMap(
          (item: any) => item.billed_procedure?.map((p) => p.product.name) || []
        )
      ),
    ];

    // Procesar datos para conteos
    const tableRows = procedures.map((proc: any) => {
      const row = { procedimiento: proc };
      let rowTotal = 0;

      users.forEach((user) => {
        // Conteo para Particular
        const countParticular = reportData
          .filter((item: any) => item.billing_user === user)
          .flatMap((item: any) => item)
          .filter(
            (item) =>
              item.sub_type == "public" &&
              item.billed_procedure.some((p: any) => p.product.name === proc)
          ).length;

        // Conteo para Monto Autorizado
        const countAutorizado = reportData
          .filter((item: any) => item.billing_user === user)
          .flatMap((item: any) => item)
          .filter((item) =>
            item.billed_procedure.some((p: any) => p.product.name === proc)
          ).length;

        row[`${user}_particular`] = countParticular;
        row[`${user}_autorizado`] = countAutorizado;

        rowTotal += countParticular + countAutorizado;
      });

      row["total"] = rowTotal;
      return row;
    });

    // Calcular totales para el footer
    const footerData = {
      procedimiento: "TOTALES",
      isFooter: true,
      style: { fontWeight: "bold", backgroundColor: "#f8f9fa" },
    };

    users.forEach((user) => {
      footerData[`${user}_particular`] = tableRows.reduce(
        (sum, row) => sum + (row[`${user}_particular`] || 0),
        0
      );
      footerData[`${user}_autorizado`] = tableRows.reduce(
        (sum, row) => sum + (row[`${user}_autorizado`] || 0),
        0
      );
    });

    footerData["total"] = tableRows.reduce(
      (sum, row) => sum + (row.total || 0),
      0
    );

    if (returnData) {
      return reportData;
    }

    // Crear columnas para la tabla
    const procedureColumns: TableColumn[] = [
      {
        field: "procedimiento",
        header: "Procedimiento",
        style: createColumnStyle("left", "200px"),
        body: (rowData: any) => (
          <span
            style={{
              fontWeight:
                rowData.isTotal || rowData.isFooter ? "bold" : "normal",
              fontSize:
                rowData.isTotal || rowData.isFooter ? "1.1em" : "inherit",
            }}
          >
            {rowData.procedimiento}
          </span>
        ),
        footer: "TOTALES",
        footerStyle: { fontWeight: "bold", textAlign: "left" },
      },
      ...users.flatMap((user) => [
        {
          field: `${user}_particular`,
          header: "Particular",
          body: (rowData: any) => (
            <span
              style={{
                fontWeight:
                  rowData.isTotal || rowData.isFooter ? "bold" : "normal",
                fontSize:
                  rowData.isTotal || rowData.isFooter ? "1.1em" : "inherit",
              }}
            >
              {rowData[`${user}_particular`] || "-"}
            </span>
          ),
          footer: () => (
            <span style={{ fontWeight: "bold" }}>
              {footerData[`${user}_particular`]}
            </span>
          ),
          style: createColumnStyle("right"),
          headerStyle: createColumnStyle("right"),
          footerStyle: { fontWeight: "bold", textAlign: "right" },
        },
        {
          field: `${user}_autorizado`,
          header: "Monto autorizado",
          body: (rowData: any) => (
            <span
              style={{
                fontWeight:
                  rowData.isTotal || rowData.isFooter ? "bold" : "normal",
                fontSize:
                  rowData.isTotal || rowData.isFooter ? "1.1em" : "inherit",
              }}
            >
              {rowData[`${user}_autorizado`] || "-"}
            </span>
          ),
          footer: () => (
            <span style={{ fontWeight: "bold" }}>
              {footerData[`${user}_autorizado`]}
            </span>
          ),
          style: createColumnStyle("right"),
          headerStyle: createColumnStyle("right"),
          footerStyle: { fontWeight: "bold", textAlign: "right" },
        },
      ]),
      {
        field: "total",
        header: "Total General",
        body: (rowData: any) => (
          <span
            style={{
              fontWeight:
                rowData.isTotal || rowData.isFooter ? "bold" : "normal",
              fontSize:
                rowData.isTotal || rowData.isFooter ? "1.1em" : "inherit",
            }}
          >
            {rowData.total}
          </span>
        ),
        footer: () => (
          <span style={{ fontWeight: "bold" }}>{footerData.total}</span>
        ),
        style: createColumnStyle("right"),
        headerStyle: createColumnStyle("right"),
        footerStyle: { fontWeight: "bold", textAlign: "right" },
      },
    ];

    // Crear grupo de encabezados
    const headerGroup = (
      <ColumnGroup>
        <Row>
          <Column header="Procedimiento" rowSpan={2} />
          {users.map((user) => (
            <Column key={user} header={user} colSpan={2} />
          ))}
          <Column header="Total General" rowSpan={2} />
        </Row>
        <Row>
          {users.flatMap((user) => [
            <Column key={`${user}_particular`} header="Particular" />,
            <Column key={`${user}_autorizado`} header="Monto autorizado" />,
          ])}
        </Row>
      </ColumnGroup>
    );

    return (
      <div className="card">
        {tableLoading ? (
          <div
            className="flex justify-content-center align-items-center"
            style={{ height: "200px", marginLeft: "800px" }}
          >
            <ProgressSpinner />
          </div>
        ) : (
          <DataTable
            headerColumnGroup={headerGroup}
            value={tableRows}
            loading={tableLoading}
            scrollable
            scrollHeight="flex"
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
            footerColumnGroup={
              <ColumnGroup>
                <Row>
                  {procedureColumns.map((col, index) => (
                    <Column
                      key={`footer-${index}`}
                      footer={col.footer}
                      footerStyle={col.footerStyle}
                    />
                  ))}
                </Row>
              </ColumnGroup>
            }
          >
            {procedureColumns.map((col, i) => {
              return (
                <Column
                  key={i}
                  field={col.field}
                  header={col.header}
                  body={col.body}
                  style={col.style}
                  headerStyle={col.headerStyle}
                  footer={col.footer}
                  footerStyle={col.footerStyle}
                />
              );
            })}
          </DataTable>
        )}
      </div>
    );
  };

  const generateEntitiesTable = (isReturnData = false) => {
    if (
      !reportData ||
      reportData.length === 0 ||
      !reportData.some((item) => item.insurance)
    ) {
      return (
        <div
          className="flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <span>No hay datos disponibles</span>
        </div>
      );
    }

    if (isReturnData) {
      return reportData;
    }

    const filteredData = reportData.filter((item: any) => item.insurance);
    const entities = new Set();
    const billingUsers = new Set();

    // Objeto para agrupar por tipo (copago o autorizado)
    const groupedData: Record<
      string,
      Record<string, { copago: number; autorizado: number }>
    > = {};
    const totals: Record<string, { copago: number; autorizado: number }> = {};

    filteredData.forEach((entry) => {
      const { billing_user, insurance, billed_procedure, sub_type }: any =
        entry;
      const insuranceName = insurance?.name;

      entities.add(insuranceName);
      billingUsers.add(billing_user);

      if (!groupedData[insuranceName]) {
        groupedData[insuranceName] = {};
      }

      if (!groupedData[insuranceName][billing_user]) {
        groupedData[insuranceName][billing_user] = { copago: 0, autorizado: 0 };
      }

      if (!totals[billing_user]) {
        totals[billing_user] = { copago: 0, autorizado: 0 };
      }

      billed_procedure?.forEach((proc: any) => {
        const amount = parseFloat(proc.amount);

        if (sub_type === "entity") {
          groupedData[insuranceName][billing_user].copago += amount;
          totals[billing_user].copago += amount;
        } else {
          groupedData[insuranceName][billing_user].autorizado += amount;
          totals[billing_user].autorizado += amount;
        }
      });
    });

    const tableData = Array.from(entities).map((entity: any) => {
      const row: Record<string, any> = { entity };
      let rowTotalCopago = 0;
      let rowTotalAutorizado = 0;

      Array.from(billingUsers).forEach((user: any) => {
        row[`${user}_copago`] = groupedData[entity][user]?.copago || 0;
        row[`${user}_autorizado`] = groupedData[entity][user]?.autorizado || 0;

        rowTotalCopago += row[`${user}_copago`];
        rowTotalAutorizado += row[`${user}_autorizado`];
      });

      row["total_copago"] = rowTotalCopago;
      row["total_autorizado"] = rowTotalAutorizado;
      row["total_general"] = rowTotalCopago + rowTotalAutorizado;
      return row;
    });

    // Crear columnas para la tabla
    const entityColumns: TableColumn[] = [
      {
        field: "entity",
        header: "Entidad",
        style: createColumnStyle("left", "200px"),
        body: (rowData: any) => (
          <span
            style={{
              fontWeight: rowData.isTotal ? "bold" : "normal",
              fontSize: rowData.isTotal ? "1.1em" : "inherit",
            }}
          >
            {rowData.entity}
          </span>
        ),
        footer: "TOTALES",
        footerStyle: { fontWeight: "bold", textAlign: "left" },
      },
      ...Array.from(billingUsers).flatMap((user: any) => [
        {
          field: `${user}_copago`,
          header: "Copago",
          body: (rowData: any) => (
            <span style={{ fontWeight: rowData.isTotal ? "bold" : "normal" }}>
              {formatCurrency(rowData[`${user}_copago`])}
            </span>
          ),
          footer: () => (
            <span style={{ fontWeight: "bold" }}>
              {formatCurrency(totals[user]?.copago || 0)}
            </span>
          ),
          style: createColumnStyle("right"),
          headerStyle: createColumnStyle("right"),
          footerStyle: { fontWeight: "bold", textAlign: "right" },
        },
        {
          field: `${user}_autorizado`,
          header: "Monto autorizado",
          body: (rowData: any) => (
            <span style={{ fontWeight: rowData.isTotal ? "bold" : "normal" }}>
              {formatCurrency(rowData[`${user}_autorizado`])}
            </span>
          ),
          footer: () => (
            <span style={{ fontWeight: "bold" }}>
              {formatCurrency(totals[user].autorizado)}
            </span>
          ),
          style: createColumnStyle("right"),
          headerStyle: createColumnStyle("right"),
          footerStyle: { fontWeight: "bold", textAlign: "right" },
        },
      ]),
      {
        field: "total_general",
        header: "Total General",
        body: (rowData: any) => (
          <span style={{ fontWeight: rowData.isTotal ? "bold" : "normal" }}>
            {formatCurrency(rowData.total_general)}
          </span>
        ),
        footer: () => {
          const grandTotal = Object.values(totals).reduce(
            (acc, { copago, autorizado }) => acc + copago + autorizado,
            0
          );
          return (
            <span style={{ fontWeight: "bold" }}>
              {formatCurrency(grandTotal)}
            </span>
          );
        },
        style: createColumnStyle("right"),
        headerStyle: createColumnStyle("right"),
        footerStyle: { fontWeight: "bold", textAlign: "right" },
      },
    ];

    // Crear grupo de encabezados
    const headerGroup = (
      <ColumnGroup>
        <Row>
          <Column header="Entidad" rowSpan={2} />
          {Array.from(billingUsers).map((user) => (
            <Column key={user} header={user} colSpan={2} />
          ))}
          <Column header="Total General" rowSpan={2} />
        </Row>
        <Row>
          {Array.from(billingUsers).flatMap((user) => [
            <Column key={`${user}_copago`} header="Copago" />,
            <Column key={`${user}_autorizado`} header="Monto autorizado" />,
          ])}
        </Row>
      </ColumnGroup>
    );

    return (
      <div className="card">
        {tableLoading ? (
          <div
            className="flex justify-content-center align-items-center"
            style={{ height: "200px" }}
          >
            <ProgressSpinner />
          </div>
        ) : (
          <DataTable
            headerColumnGroup={headerGroup}
            value={tableData}
            loading={tableLoading}
            scrollable
            scrollHeight="flex"
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
            footerColumnGroup={
              <ColumnGroup>
                <Row>
                  {entityColumns.map((col, index) => (
                    <Column
                      key={`footer-${index}`}
                      footer={col.footer}
                      footerStyle={col.footerStyle}
                    />
                  ))}
                </Row>
              </ColumnGroup>
            }
          >
            {entityColumns.map((col, i) => (
              <Column
                key={i}
                field={col.field}
                header={col.header}
                body={col.body}
                style={col.style}
                headerStyle={col.headerStyle}
                footer={col.footer}
                footerStyle={col.footerStyle}
              />
            ))}
          </DataTable>
        )}
      </div>
    );
  };

  const generatePaymentsTable = (isReturnData = false) => {
    if (
      !reportData ||
      reportData.length === 0 ||
      !reportData.some(
        (item) => item.payment_methods && item.payment_methods.length > 0
      )
    ) {
      return (
        <div
          className="flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <span>No hay datos disponibles</span>
        </div>
      );
    }

    const paymentMethods = new Set();
    const billingUsers = new Set();

    // Objeto para agrupar por tipo (copago, particular o autorizado)
    const groupedData: Record<
      string,
      Record<string, { copago: number; particular: number; autorizado: number }>
    > = {};
    const totals: Record<
      string,
      { copago: number; particular: number; autorizado: number }
    > = {};

    reportData.forEach((entry) => {
      const { billing_user, payment_methods, sub_type }: any = entry;
      billingUsers.add(billing_user);

      payment_methods?.forEach((pm: any) => {
        const method = pm.payment_method.method;
        const amount = parseFloat(pm.amount);

        paymentMethods.add(method);

        if (!groupedData[method]) {
          groupedData[method] = {};
        }

        if (!groupedData[method][billing_user]) {
          groupedData[method][billing_user] = {
            copago: 0,
            particular: 0,
            autorizado: 0,
          };
        }

        if (!totals[billing_user]) {
          totals[billing_user] = { copago: 0, particular: 0, autorizado: 0 };
        }

        // Clasificar por tipo de pago
        if (sub_type === "entity") {
          groupedData[method][billing_user].copago += amount;
          totals[billing_user].copago += amount;
        } else if (sub_type === "public") {
          groupedData[method][billing_user].particular += amount;
          totals[billing_user].particular += amount;
        } else {
          groupedData[method][billing_user].autorizado += amount;
          totals[billing_user].autorizado += amount;
        }
      });
    });

    const tableData = Array.from(paymentMethods).map((method: any) => {
      const row: Record<string, any> = { method };
      let rowTotal = 0;

      Array.from(billingUsers).forEach((user: any) => {
        row[`${user}_copago`] = groupedData[method][user]?.copago || 0;
        row[`${user}_particular`] = groupedData[method][user]?.particular || 0;
        row[`${user}_autorizado`] = groupedData[method][user]?.autorizado || 0;

        rowTotal +=
          row[`${user}_copago`] +
          row[`${user}_particular`] +
          row[`${user}_autorizado`];
      });

      row["total"] = rowTotal;
      return row;
    });

    // Calcular total general
    const grandTotal = tableData.reduce(
      (sum, row) => sum + (row.total || 0),
      0
    );

    if (isReturnData) {
      return reportData;
    }

    // Crear columnas para la tabla
    const paymentColumns: TableColumn[] = [
      {
        field: "method",
        header: "Método de Pago",
        style: createColumnStyle("left", "200px"),
        body: (rowData: any) => (
          <span style={{ fontWeight: "normal" }}>{rowData.method}</span>
        ),
        footer: "TOTALES",
        footerStyle: { fontWeight: "bold", textAlign: "left" },
      },
      ...Array.from(billingUsers).flatMap((user: any) => [
        {
          field: `${user}_copago`,
          header: "Copago",
          body: (rowData: any) => (
            <span style={{ fontWeight: "normal" }}>
              {formatCurrency(rowData[`${user}_copago`])}
            </span>
          ),
          footer: () => (
            <span style={{ fontWeight: "bold" }}>
              {formatCurrency(totals[user]?.copago || 0)}
            </span>
          ),
          style: createColumnStyle("right"),
          headerStyle: createColumnStyle("right"),
          footerStyle: { fontWeight: "bold", textAlign: "right" },
        },
        {
          field: `${user}_particular`,
          header: "Particular",
          body: (rowData: any) => (
            <span style={{ fontWeight: "normal" }}>
              {formatCurrency(rowData[`${user}_particular`])}
            </span>
          ),
          footer: () => (
            <span style={{ fontWeight: "bold" }}>
              {formatCurrency(totals[user].particular)}
            </span>
          ),
          style: createColumnStyle("right"),
          headerStyle: createColumnStyle("right"),
          footerStyle: { fontWeight: "bold", textAlign: "right" },
        },
        {
          field: `${user}_autorizado`,
          header: "Monto autorizado",
          body: (rowData: any) => (
            <span style={{ fontWeight: "normal" }}>
              {formatCurrency(rowData[`${user}_autorizado`])}
            </span>
          ),
          footer: () => (
            <span style={{ fontWeight: "bold" }}>
              {formatCurrency(totals[user].autorizado)}
            </span>
          ),
          style: createColumnStyle("right"),
          headerStyle: createColumnStyle("right"),
          footerStyle: { fontWeight: "bold", textAlign: "right" },
        },
      ]),
      {
        field: "total",
        header: "Total General",
        body: (rowData: any) => (
          <span style={{ fontWeight: "normal" }}>
            {formatCurrency(rowData.total)}
          </span>
        ),
        footer: () => (
          <span style={{ fontWeight: "bold" }}>
            {formatCurrency(grandTotal)}
          </span>
        ),
        style: createColumnStyle("right"),
        headerStyle: createColumnStyle("right"),
        footerStyle: { fontWeight: "bold", textAlign: "right" },
      },
    ];

    // Crear grupo de encabezados
    const headerGroup = (
      <ColumnGroup>
        <Row>
          <Column header="Método de Pago" rowSpan={2} />
          {Array.from(billingUsers).map((user) => (
            <Column key={user} header={user} colSpan={3} />
          ))}
          <Column header="Total General" rowSpan={2} />
        </Row>
        <Row>
          {Array.from(billingUsers).flatMap((user) => [
            <Column key={`${user}_copago`} header="Copago" />,
            <Column key={`${user}_particular`} header="Particular" />,
            <Column key={`${user}_autorizado`} header="Monto autorizado" />,
          ])}
        </Row>
      </ColumnGroup>
    );

    return (
      <div className="card">
        {tableLoading ? (
          <div
            className="flex justify-content-center align-items-center"
            style={{ height: "200px" }}
          >
            <ProgressSpinner />
          </div>
        ) : (
          <DataTable
            headerColumnGroup={headerGroup}
            value={tableData}
            loading={tableLoading}
            scrollable
            scrollHeight="flex"
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
            footerColumnGroup={
              <ColumnGroup>
                <Row>
                  {paymentColumns.map((col, index) => (
                    <Column
                      key={`footer-${index}`}
                      footer={col.footer}
                      footerStyle={col.footerStyle}
                    />
                  ))}
                </Row>
              </ColumnGroup>
            }
          >
            {paymentColumns.map((col, i) => (
              <Column
                key={i}
                field={col.field}
                header={col.header}
                body={col.body}
                style={col.style}
                headerStyle={col.headerStyle}
                footer={col.footer}
                footerStyle={col.footerStyle}
              />
            ))}
          </DataTable>
        )}
      </div>
    );
  };

  return (
    <main className="main" id="top">
      <div className="w-100">
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
                      <Accordion className="report-invoices-accordion">
                        <AccordionTab header="Filtros">
                          <div className="row">
                            <div className="col-12 col-md-6">
                              <label
                                className="form-label"
                                htmlFor="procedure"
                              >
                                Procedimientos
                              </label>
                              <MultiSelect
                                id="procedure"
                                value={selectedProcedures}
                                options={procedures}
                                onChange={(e) =>
                                  setSelectedProcedures(e.value)
                                }
                                placeholder="Seleccione procedimientos"
                                display="chip"
                                filter
                                className="w-100"
                              />
                            </div>
                            <div className="col-12 col-md-6 mb-3">
                              <label
                                className="form-label"
                                htmlFor="especialistas"
                              >
                                Especialistas
                              </label>
                              <MultiSelect
                                id="especialistas"
                                value={selectedSpecialists}
                                options={specialists}
                                onChange={(e) =>
                                  setSelectedSpecialists(e.value)
                                }
                                placeholder="Seleccione especialistas"
                                display="chip"
                                filter
                                className="w-100"
                              />
                            </div>
                            <div className="col-12 col-md-6 mb-3">
                              <label
                                className="form-label"
                                htmlFor="patients"
                              >
                                Pacientes
                              </label>
                              <MultiSelect
                                id="patients"
                                value={selectedPatients}
                                options={patients}
                                onChange={(e) =>
                                  setSelectedPatients(e.value)
                                }
                                placeholder="Seleccione pacientes"
                                display="chip"
                                filter
                                className="w-100"
                              />
                            </div>
                            <div className="col-12 col-md-6 mb-3">
                              <label
                                className="form-label"
                                htmlFor="fechasProcedimiento"
                              >
                                Fecha inicio - fin Procedimiento
                              </label>
                              <Calendar
                                id="fechasProcedimiento"
                                value={dateRange}
                                onChange={(e: any) =>
                                  setDateRange(e.value)
                                }
                                selectionMode="range"
                                readOnlyInput
                                dateFormat="dd/mm/yy"
                                placeholder="dd/mm/yyyy - dd/mm/yyyy"
                                className="w-100"
                              />
                            </div>
                            <div className="col-12 col-md-6 mb-3">
                              <label
                                className="form-label"
                                htmlFor="entity"
                              >
                                Entidad
                              </label>
                              <Dropdown
                                id="entity"
                                value={selectedEntity}
                                options={entities}
                                onChange={(e) =>
                                  setSelectedEntity(e.value)
                                }
                                placeholder="Seleccione entidad"
                                filter
                                className="w-100"
                              />
                            </div>
                            <div className="col-12">
                              <div className="d-flex justify-content-end m-2">
                                <Button
                                  label="Filtrar"
                                  icon="pi pi-filter"
                                  onClick={handleFilter}
                                  className="p-button-primary"
                                />
                              </div>
                            </div>
                          </div>
                        </AccordionTab>
                      </Accordion>
                      <div className="tabs-header">
                        <button
                          className={`tab-item ${activeTab === "procedures" ? "active" : ""}`}
                          onClick={() => setActiveTab("procedures")}
                        >
                          <i className="fas fa-chart-line"></i>
                          Procedimientos $
                        </button>
                        <button
                          className={`tab-item ${activeTab === "procedures-count" ? "active" : ""}`}
                          onClick={() => setActiveTab("procedures-count")}
                        >
                          <i className="fas fa-hashtag"></i>
                          Procedimientos #
                        </button>
                        <button
                          className={`tab-item ${activeTab === "entities" ? "active" : ""}`}
                          onClick={() => setActiveTab("entities")}
                        >
                          <i className="fas fa-building"></i>
                          Entidades
                        </button>
                        <button
                          className={`tab-item ${activeTab === "payments" ? "active" : ""}`}
                          onClick={() => setActiveTab("payments")}
                        >
                          <i className="fas fa-credit-card"></i>
                          Métodos de pago
                        </button>
                      </div>

                      <div className="tabs-content">
                        {/* Panel de Procedimientos $ */}
                        <div className={`tab-panel ${activeTab === "procedures" ? "active" : ""}`}>
                          <div className="d-flex justify-content-end gap-2 mb-4">
                            <ExportButtonExcel
                              onClick={handleExportProcedures}
                              loading={exporting.procedures}
                              disabled={!reportData || reportData.length === 0}
                            />
                            <ExportButtonPDF
                              onClick={() => exportToProceduresPDF("procedures")}
                              loading={exporting.procedures}
                              disabled={!reportData || reportData.length === 0}
                            />
                          </div>
                          {generateProceduresTable()}
                        </div>

                        {/* Panel de Procedimientos # */}
                        <div className={`tab-panel ${activeTab === "procedures-count" ? "active" : ""}`}>
                          <div className="d-flex justify-content-end gap-2 mb-4">
                            <ExportButtonPDF
                              onClick={() => exportToProceduresPDF("procedures-count")}
                              loading={exporting.procedures}
                              disabled={!reportData || reportData.length === 0}
                            />
                          </div>
                          {generateProceduresCountTable()}
                        </div>

                        {/* Panel de Entidades */}
                        <div className={`tab-panel ${activeTab === "entities" ? "active" : ""}`}>
                          <div className="d-flex justify-content-end gap-2 mb-4">
                            <ExportButtonExcel
                              onClick={handleExportEntities}
                              loading={exporting.entities}
                              disabled={
                                !reportData ||
                                reportData.length === 0 ||
                                !reportData.some((item) => item.insurance)
                              }
                            />
                            <ExportButtonPDF
                              onClick={() => exportToProceduresPDF("entities")}
                              loading={exporting.entities}
                              disabled={
                                !reportData ||
                                reportData.length === 0 ||
                                !reportData.some((item) => item.insurance)
                              }
                            />
                          </div>
                          {generateEntitiesTable()}
                        </div>

                        {/* Panel de Métodos de pago */}
                        <div className={`tab-panel ${activeTab === "payments" ? "active" : ""}`}>
                          <div className="d-flex justify-content-end gap-2 mb-4">
                            <ExportButtonExcel
                              onClick={handleExportPayments}
                              loading={exporting.payments}
                              disabled={
                                !reportData ||
                                reportData.length === 0 ||
                                !reportData.some(
                                  (item) =>
                                    item.payment_methods &&
                                    item.payment_methods.length > 0
                                )
                              }
                            />
                            <ExportButtonPDF
                              onClick={() => exportToProceduresPDF("payments")}
                              loading={exporting.payments}
                              disabled={
                                !reportData ||
                                reportData.length === 0 ||
                                !reportData.some(
                                  (item) =>
                                    item.payment_methods &&
                                    item.payment_methods.length > 0
                                )
                              }
                            />
                          </div>
                          {generatePaymentsTable()}
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
    </main >
  );
};

const ExportButtonExcel: React.FC<ExportButtonProps> = ({
  onClick,
  loading = false,
  disabled = false,
}) => {
  return (
    <Button
      tooltip="Exportar a excel"
      tooltipOptions={{ position: "top" }}
      icon="pi pi-file-excel"
      onClick={onClick}
      className="p-button-success"
      loading={loading}
      disabled={disabled}
    >
      {" "}
      <i className="fa-solid fa-file-excel"> </i>
    </Button>
  );
};

const ExportButtonPDF: React.FC<ExportButtonProps> = ({
  onClick,
  loading = false,
  disabled = false,
}) => {
  return (
    <Button
      tooltip="Exportar a excel"
      tooltipOptions={{ position: "top" }}
      onClick={onClick}
      className="p-button-secondary"
      loading={loading}
      disabled={disabled}
    >
      {" "}
      <i className="fa-solid fa-file-pdf"> </i>
    </Button>
  );
};