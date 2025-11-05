import React, { useState, useEffect } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { Accordion, AccordionTab } from "primereact/accordion";
import { InputText } from "primereact/inputtext";
import {
  exportDoctorsProceduresToExcel,
  exportEntityPricesToExcel,
  exportEntityCountsToExcel,
  exportConsultationsToExcel,
  ExportButtonProps,
  SpecialistReportData,
} from "./excel/ExcelSpecialist";

// Import your services
import {
  productService,
  userService,
  patientService,
  billingService,
  entityService,
} from "../../services/api/index";
import { exportToExcel } from "../accounting/utils/ExportToExcelOptions";

import { formatDate as formatDateUtils } from "../../services/utilidades";

import { generatePDFFromHTML } from "../../funciones/funcionesJS/exportPDF";
import { useCompany } from "../hooks/useCompany";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

import { useProceduresCashFormat } from "../documents-generation/hooks/reports-medical/invoicesDoctors/useProceduresCashFormat";
import { useProceduresCountFormat } from "../documents-generation/hooks/reports-medical/invoicesDoctors/useProceduresCountFormat";
import { useEntitiesCountFormat } from "../documents-generation/hooks/reports-medical/invoicesDoctors/useEntitiesCountFormat";
import { useAppointmentsFormat } from "../documents-generation/hooks/reports-medical/invoicesDoctors/useAppointmentsFormat";
import { useProductivityFormat } from "../documents-generation/hooks/reports-medical/invoicesDoctors/useProductivityFormat";

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

export const SpecialistsReport = () => {
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
  const [selectedEntity, setSelectedEntity] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState([fiveDaysAgo, today]);
  const { company, setCompany, fetchCompany } = useCompany();

  // State for report data
  const [reportData, setReportData] = useState<SpecialistReportData[]>([]);
  const [activeTab, setActiveTab] = useState("doctors-tab");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");

  // Pagination state
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  const { generateFormatProceduresCash } = useProceduresCashFormat();
  const { generateFormatProceduresCount } = useProceduresCountFormat();
  const { generateFormatEntitiesCount } = useEntitiesCountFormat();
  const { generateFormatAppointments } = useAppointmentsFormat();
  const { generateFormatProductivity } = useProductivityFormat();

  // Export loading states
  const [exporting, setExporting] = useState({
    procedures: false,
    proceduresCount: false,
    entityPrices: false,
    entityCounts: false,
    consultations: false,
  });

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        // Load initial data
        await loadProcedures();
        await loadSpecialists();
        await loadPatients();
        await loadEntities();
        const defaultFilters = {
          end_date: formatDate(today),
          start_date: formatDate(fiveDaysAgo),
          user_ids: [],
        };
        await loadData(defaultFilters);
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const loadData = async (filterParams = {}, tab = "") => {
    let data: any = [];
    try {
      setTableLoading(true);
      if (tab == "productivity-tab") {
        data = await billingService.productivityByDoctor(filterParams);
      } else {
        data = await billingService.getBillingReport(filterParams);
      }
      setReportData(data);
      return data;
    } catch (error) {
      console.error("Error loading report data:", error);
      throw error;
    } finally {
      setTableLoading(false);
    }
  };

  const handleTabChange = async (tab: string) => {
    setReportData([]);
    try {
      setActiveTab(tab);
      const filterParams: any = {
        end_date: dateRange[1] ? formatDate(dateRange[1]) : "",
        start_date: dateRange[0] ? formatDate(dateRange[0]) : "",
      };

      if (selectedPatients?.length) {
        filterParams.patient_ids = selectedPatients;
      }

      if (selectedProcedures?.length) {
        filterParams.product_ids = selectedProcedures;
      }

      if (selectedSpecialists?.length) {
        filterParams.user_ids = selectedSpecialists;
      } else {
        filterParams.user_ids = [];
      }

      if (selectedEntity?.length) {
        filterParams.entity_id = selectedEntity;
      }

      await loadData(filterParams, tab);
    } catch (error) {
      console.error("Error changing tab:", error);
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
      const filterParams: any = {
        end_date: dateRange[1] ? formatDate(dateRange[1]) : "",
        start_date: dateRange[0] ? formatDate(dateRange[0]) : "",
      };

      if (selectedPatients?.length) {
        filterParams.patient_ids = selectedPatients;
      }

      if (selectedProcedures?.length) {
        filterParams.product_ids = selectedProcedures;
      }

      if (selectedSpecialists?.length) {
        filterParams.user_ids = selectedSpecialists;
      } else {
        filterParams.user_ids = [];
      }

      if (selectedEntity?.length) {
        filterParams.entity_id = selectedEntity;
      }

      await loadData(filterParams, activeTab);
      setFirst(0);
    } catch (error) {
      console.error("Error filtering data:", error);
    }
  };

  const handleExportProcedures = async () => {
    try {
      setExporting({ ...exporting, procedures: true });
      await exportDoctorsProceduresToExcel(reportData);
    } catch (error) {
      console.error("Error exporting procedures:", error);
      alert(error.message);
    } finally {
      setExporting({ ...exporting, procedures: false });
    }
  };

  const handleExportEntityPrices = async () => {
    try {
      setExporting({ ...exporting, entityPrices: true });
      await exportEntityPricesToExcel(reportData);
    } catch (error) {
      console.error("Error exporting entity prices:", error);
      alert(error.message);
    } finally {
      setExporting({ ...exporting, entityPrices: false });
    }
  };

  const handleExportEntityCounts = async () => {
    try {
      setExporting({ ...exporting, entityCounts: true });
      await exportEntityCountsToExcel(reportData);
    } catch (error) {
      console.error("Error exporting entity counts:", error);
      alert(error.message);
    } finally {
      setExporting({ ...exporting, entityCounts: false });
    }
  };

  const handleExportConsultations = async () => {
    try {
      setExporting({ ...exporting, consultations: true });
      await exportConsultationsToExcel(reportData);
    } catch (error) {
      console.error("Error exporting consultations:", error);
      alert(error.message);
    } finally {
      setExporting({ ...exporting, consultations: false });
    }
  };

  function exportToPDF(tab = "") {
    let dataExport: any = [];
    let namePDF = "";

    switch (tab) {
      case "doctors-tab":
        dataExport = generateDoctorsTable(true);
        return generateFormatProceduresCash(dataExport, dateRange, "Impresion");
      case "doctors-count-tab":
        dataExport = generateEntityPricesTable(true);
        return generateFormatProceduresCount(
          dataExport,
          dateRange,
          "Impresion"
        );
      case "conteo-entidad-tab":
        dataExport = generateEntityCountTable(true);
        return generateFormatEntitiesCount(dataExport, dateRange, "Impresion");
      case "consultation-tab":
        dataExport = generateConsultationsTable(true);
        return generateFormatAppointments(dataExport, dateRange, "Impresion");
      case "productivity-tab":
        dataExport = generateTableProductivity(true);
        return generateFormatProductivity(dataExport, dateRange, "Impresion");
    }

    const headers = dataExport[0];
    const lastRowIndex = dataExport.length - 1;

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
          .number-cell {
            text-align: right;
          }
          </style>
      
          <table>
            <thead>
              <tr>
                ${Object.keys(headers)
        .map((header) => `<th>${header}</th>`)
        .join("")}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${dataExport.reduce((acc: string, child: any, index: number) => {
          let rowTotal = 0;
          const formattedCells = Object.keys(headers).map((header) => {
            const value = child[header];
            const num = Number(value);

            if (!isNaN(num)) {
              rowTotal += num;
              return `<td class="number-cell">${formatCurrency(
                num
              )}</td>`;
            }
            return `<td>${value}</td>`;
          });

          return (
            acc +
            `
                    <tr>
                      ${formattedCells.join("")}
                      <td class="number-cell">${formatCurrency(rowTotal)}</td>
                    </tr>
                  `
          );
        }, "")}
            </tbody>
          </table>`;
    const configPDF = {
      name: namePDF,
    };
    generatePDFFromHTML(table, company, configPDF);
  }

  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const generateDoctorsTable = (isReturnData = false) => {
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

    // Process data and group by procedure and doctor
    const procedureDoctorTotals: Record<
      string,
      Record<
        string,
        {
          count: number;
          amount: number;
          avg: number;
        }
      >
    > = {};
    const doctors = new Set<string>();
    const procedureSet = new Set<string>();

    reportData.forEach((entry) => {
      const doctor = entry.billing_doctor;
      doctors.add(doctor);

      entry.billed_procedure?.forEach((proc) => {
        const procedureName = proc.product?.name;
        const amount = parseFloat(proc.amount) || 0;
        const entityAmount = parseFloat(entry.entity_authorized_amount) || 0;

        procedureSet.add(procedureName);

        if (!procedureDoctorTotals[procedureName]) {
          procedureDoctorTotals[procedureName] = {};
        }

        if (!procedureDoctorTotals[procedureName][doctor]) {
          procedureDoctorTotals[procedureName][doctor] = {
            count: 0,
            amount: 0,
            avg: 0,
          };
        }

        // Copago (count)
        if (entry.sub_type === "entity") {
          procedureDoctorTotals[procedureName][doctor].count += amount;
        }

        // Particular (amount)
        if (entry.sub_type === "public") {
          procedureDoctorTotals[procedureName][doctor].amount += amount;
        }

        // Monto autorizado (avg)
        procedureDoctorTotals[procedureName][doctor].avg += entityAmount;
      });
    });

    // Calculate column totals (doctors)
    const doctorTotals: Record<
      string,
      {
        count: number;
        amount: number;
        avg: number;
        total: number;
      }
    > = {};

    Array.from(doctors).forEach((doctor: string) => {
      doctorTotals[doctor] = {
        count: 0,
        amount: 0,
        avg: 0,
        total: 0,
      };

      Array.from(procedureSet).forEach((proc: string) => {
        const doctorData = procedureDoctorTotals[proc]?.[doctor] || {
          count: 0,
          amount: 0,
          avg: 0,
        };
        doctorTotals[doctor].count += doctorData.count;
        doctorTotals[doctor].amount += doctorData.amount;
        doctorTotals[doctor].avg += doctorData.avg;
        doctorTotals[doctor].total += doctorData.amount;
      });
    });

    // Prepare table data
    const tableData = Array.from(procedureSet).map((proc: string) => {
      const row: Record<string, any> = { procedure: proc };
      let rowTotal = 0;

      Array.from(doctors).forEach((doctor: string) => {
        const doctorData = procedureDoctorTotals[proc]?.[doctor] || {
          count: 0,
          amount: 0,
          avg: 0,
        };

        row[`${doctor}_count`] = doctorData.count;
        row[`${doctor}_amount`] = doctorData.amount;
        row[`${doctor}_avg`] = doctorData.avg;

        rowTotal += doctorData.amount;
      });

      row["total"] = rowTotal;
      return row;
    });

    // Add totals row
    const totalsRow: Record<string, any> = {
      procedure: "TOTALES",
      isTotal: true,
      style: { fontWeight: "bold", backgroundColor: "#f8f9fa" },
    };

    Array.from(doctors).forEach((doctor: string) => {
      totalsRow[`${doctor}_count`] = doctorTotals[doctor].count;
      totalsRow[`${doctor}_amount`] = doctorTotals[doctor].amount;
      totalsRow[`${doctor}_avg`] = doctorTotals[doctor].avg;
    });

    totalsRow["total"] = Array.from(doctors).reduce(
      (sum, doctor) => sum + doctorTotals[doctor].total,
      0
    );

    // Add totals row to table data only for display (not when returning data)
    const displayData = isReturnData ? tableData : [...tableData, totalsRow];

    if (isReturnData) {
      return reportData;
    }

    // Create columns for the table
    const procedureColumns: TableColumn[] = [
      {
        field: "procedure",
        header: "Procedimiento",
        style: createColumnStyle("left", "200px"),
        body: (rowData: any) => (
          <span
            style={{
              fontWeight: rowData.isTotal ? "bold" : "normal",
              fontSize: rowData.isTotal ? "1.1em" : "inherit",
              ...rowData.style,
            }}
          >
            {rowData.procedure}
          </span>
        ),
      },
      ...Array.from(doctors).flatMap((doctor: string) => [
        {
          field: `${doctor}_count`,
          header: "Copago",
          body: (rowData: any) => (
            <span
              style={{
                fontWeight: rowData.isTotal ? "bold" : "normal",
                fontSize: rowData.isTotal ? "1.1em" : "inherit",
              }}
            >
              {rowData[`${doctor}_count`]
                ? formatCurrency(rowData[`${doctor}_count`])
                : "-"}
            </span>
          ),
          style: createColumnStyle("right"),
          headerStyle: createColumnStyle("right"),
        },
        {
          field: `${doctor}_amount`,
          header: "Particular",
          body: (rowData: any) => (
            <span
              style={{
                fontWeight: rowData.isTotal ? "bold" : "normal",
                fontSize: rowData.isTotal ? "1.1em" : "inherit",
              }}
            >
              {rowData[`${doctor}_amount`]
                ? formatCurrency(rowData[`${doctor}_amount`])
                : "-"}
            </span>
          ),
          style: createColumnStyle("right"),
          headerStyle: createColumnStyle("right"),
        },
        {
          field: `${doctor}_avg`,
          header: "Seguro",
          body: (rowData: any) => (
            <span
              style={{
                fontWeight: rowData.isTotal ? "bold" : "normal",
                fontSize: rowData.isTotal ? "1.1em" : "inherit",
              }}
            >
              {rowData[`${doctor}_avg`]
                ? formatCurrency(rowData[`${doctor}_avg`])
                : "-"}
            </span>
          ),
          style: createColumnStyle("right"),
          headerStyle: createColumnStyle("right"),
        },
      ]),
      {
        field: "total",
        header: "Total General",
        body: (rowData: any) => (
          <span
            style={{
              fontWeight: rowData.isTotal ? "bold" : "normal",
              fontSize: rowData.isTotal ? "1.1em" : "inherit",
            }}
          >
            {formatCurrency(rowData.total)}
          </span>
        ),
        style: createColumnStyle("right"),
        headerStyle: createColumnStyle("right"),
      },
    ];

    // Create header group
    const headerGroup = (
      <ColumnGroup>
        <Row>
          <Column header="Procedimiento" rowSpan={2} />
          {Array.from(doctors).map((doctor) => (
            <Column key={doctor} header={doctor} colSpan={3} />
          ))}
          <Column header="Total General" rowSpan={2} />
        </Row>
        <Row>
          {Array.from(doctors).flatMap((doctor) => [
            <Column key={`${doctor}_count`} header="Copago" />,
            <Column key={`${doctor}_amount`} header="Particular" />,
            <Column key={`${doctor}_avg`} header="Seguro" />,
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
            value={displayData}
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
                />
              );
            })}
          </DataTable>
        )}
      </div>
    );
  };

  const generateDoctorsCountTable = (isReturnData = false) => {
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

    // Process data and group by procedure and doctor
    const procedureDoctorCounts: Record<
      string,
      Record<
        string,
        {
          amount: number; // Particular count
          avg: number; // Monto autorizado count
        }
      >
    > = {};
    const doctors = new Set<string>();
    const procedureSet = new Set<string>();

    reportData.forEach((entry) => {
      const doctor = entry.billing_doctor;
      doctors.add(doctor);

      entry.billed_procedure?.forEach((proc) => {
        const procedureName = proc.product?.name;
        procedureSet.add(procedureName);

        if (!procedureDoctorCounts[procedureName]) {
          procedureDoctorCounts[procedureName] = {};
        }

        if (!procedureDoctorCounts[procedureName][doctor]) {
          procedureDoctorCounts[procedureName][doctor] = {
            amount: 0,
            avg: 0,
          };
        }

        // Increment counts instead of summing amounts
        if (entry.sub_type === "entity") {
          procedureDoctorCounts[procedureName][doctor].avg += 1; // Count instead of sum amount
        }

        if (entry.sub_type === "public") {
          procedureDoctorCounts[procedureName][doctor].amount += 1; // Count instead of sum amount
        } // Count for authorized amount
      });
    });

    // Calculate column totals (doctors)
    const doctorTotals: Record<
      string,
      {
        amount: number;
        avg: number;
        total: number;
      }
    > = {};

    Array.from(doctors).forEach((doctor: string) => {
      doctorTotals[doctor] = {
        amount: 0,
        avg: 0,
        total: 0,
      };

      Array.from(procedureSet).forEach((proc: string) => {
        const doctorData = procedureDoctorCounts[proc]?.[doctor] || {
          count: 0,
          amount: 0,
          avg: 0,
        };
        doctorTotals[doctor].amount += doctorData.amount;
        doctorTotals[doctor].avg += doctorData.avg;
        doctorTotals[doctor].total += doctorData.amount; // Sum counts for total
      });
    });

    // Prepare table data
    const tableData = Array.from(procedureSet).map((proc: string) => {
      const row: Record<string, any> = { procedure: proc };
      let rowTotal = 0;

      Array.from(doctors).forEach((doctor: string) => {
        const doctorData = procedureDoctorCounts[proc]?.[doctor] || {
          count: 0,
          amount: 0,
          avg: 0,
        };

        row[`${doctor}_amount`] = doctorData.amount;
        row[`${doctor}_avg`] = doctorData.avg;

        rowTotal += doctorData.amount; // Sum counts for row total
      });

      row["total"] = rowTotal;
      return row;
    });

    // Add totals row
    const totalsRow: Record<string, any> = {
      procedure: "TOTALES",
      isTotal: true,
      style: { fontWeight: "bold", backgroundColor: "#f8f9fa" },
    };

    Array.from(doctors).forEach((doctor: string) => {
      totalsRow[`${doctor}_amount`] = doctorTotals[doctor].amount;
      totalsRow[`${doctor}_avg`] = doctorTotals[doctor].avg;
    });

    totalsRow["total"] = Array.from(doctors).reduce(
      (sum, doctor) => sum + doctorTotals[doctor].total,
      0
    );

    const displayData = isReturnData ? tableData : [...tableData, totalsRow];

    if (isReturnData) {
      return tableData;
    }

    // Create columns for the table
    const procedureColumns: TableColumn[] = [
      {
        field: "procedure",
        header: "Procedimiento",
        style: createColumnStyle("left", "200px"),
        body: (rowData: any) => (
          <span
            style={{
              fontWeight: rowData.isTotal ? "bold" : "normal",
              fontSize: rowData.isTotal ? "1.1em" : "inherit",
              ...rowData.style,
            }}
          >
            {rowData.procedure}
          </span>
        ),
      },
      ...Array.from(doctors).flatMap((doctor: string) => [
        {
          field: `${doctor}_amount`,
          header: "Particular",
          body: (rowData: any) => (
            <span
              style={{
                fontWeight: rowData.isTotal ? "bold" : "normal",
                fontSize: rowData.isTotal ? "1.1em" : "inherit",
              }}
            >
              {rowData[`${doctor}_amount`] || "0"}
            </span>
          ),
          style: createColumnStyle("right"),
          headerStyle: createColumnStyle("right"),
        },
        {
          field: `${doctor}_avg`,
          header: "Seguro",
          body: (rowData: any) => (
            <span
              style={{
                fontWeight: rowData.isTotal ? "bold" : "normal",
                fontSize: rowData.isTotal ? "1.1em" : "inherit",
              }}
            >
              {rowData[`${doctor}_avg`] || "0"}
            </span>
          ),
          style: createColumnStyle("right"),
          headerStyle: createColumnStyle("right"),
        },
      ]),
      {
        field: "total",
        header: "Total General",
        body: (rowData: any) => (
          <span
            style={{
              fontWeight: rowData.isTotal ? "bold" : "normal",
              fontSize: rowData.isTotal ? "1.1em" : "inherit",
            }}
          >
            {rowData.total}
          </span>
        ),
        style: createColumnStyle("right"),
        headerStyle: createColumnStyle("right"),
      },
    ];

    // Create header group (same as generateDoctorsTable)
    const headerGroup = (
      <ColumnGroup>
        <Row>
          <Column header="Procedimiento" rowSpan={2} />
          {Array.from(doctors).map((doctor) => (
            <Column key={doctor} header={doctor} colSpan={2} />
          ))}
          <Column header="Total General" rowSpan={2} />
        </Row>
        <Row>
          {Array.from(doctors).flatMap((doctor) => [
            <Column key={`${doctor}_amount`} header="Particular" />,
            <Column key={`${doctor}_avg`} header="Seguro" />,
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
            value={displayData}
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
                />
              );
            })}
          </DataTable>
        )}
      </div>
    );
  };

  const handleExportProceduresCount = async () => {
    // try {
    //   setExporting({ ...exporting, proceduresCount: true });
    //   const data = generateDoctorsCountTable(true);
    //   await exportToExcel(data, "Procedimientos_conteo");
    // } catch (error) {
    //   console.error("Error exporting procedures count:", error);
    //   alert(error.message);
    // } finally {
    //   setExporting({ ...exporting, proceduresCount: false });
    // }
  };

  const generateEntityPricesTable = (isReturnData = false) => {
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

    // Process data and group by doctor and entity
    const filteredData = reportData.filter((item: any) => item.insurance);
    const doctorEntityTotals: Record<string, Record<string, number>> = {};
    const entities = new Set<string>();
    const doctors = new Set<string>();

    filteredData.forEach((entry: any) => {
      const entity = entry.insurance?.name;
      const doctor = entry.billing_doctor;
      const total = entry.billed_procedure?.reduce(
        (sum: number, proc: any) => sum + parseFloat(proc.amount || 0),
        0
      );

      if (entity && doctor) {
        entities.add(entity);
        doctors.add(doctor);

        if (!doctorEntityTotals[doctor]) {
          doctorEntityTotals[doctor] = {};
        }

        doctorEntityTotals[doctor][entity] =
          (doctorEntityTotals[doctor][entity] || 0) + total;
      }
    });

    // Calculate column totals (entities)
    const entityTotals: Record<string, number> = {};
    Array.from(entities).forEach((entity: string) => {
      entityTotals[entity] = Array.from(doctors).reduce(
        (sum, doctor: string) => {
          return sum + (doctorEntityTotals[doctor]?.[entity] || 0);
        },
        0
      );
    });

    // Prepare table data
    const tableData = Array.from(doctors).map((doctor: string) => {
      const row: Record<string, any> = { doctor };
      Array.from(entities).forEach((entity: string) => {
        row[entity] = doctorEntityTotals[doctor]?.[entity] || 0;
      });
      return row;
    });

    // Add totals row
    const totalsRow: Record<string, any> = {
      doctor: "Total",
      isTotal: true,
      style: { fontWeight: "bold", fontSize: "1em" },
    };
    Array.from(entities).forEach((entity: string) => {
      totalsRow[entity] = entityTotals[entity] || 0;
    });
    tableData.push(totalsRow);

    if (isReturnData) {
      return reportData;
    }

    const entityColumns: TableColumn[] = [
      {
        field: "doctor",
        header: "Médico",
        style: createColumnStyle("left", "200px"),
        body: (rowData: any) => (
          <span
            style={{
              fontWeight: rowData.isTotal ? "bold" : "normal",
              fontSize: rowData.isTotal ? "1em" : "inherit",
            }}
          >
            {rowData.doctor}
          </span>
        ),
      },
      ...Array.from(entities).map((entity: string) => ({
        field: entity,
        header: entity,
        body: (rowData: any) => (
          <span
            style={{
              fontWeight: rowData.isTotal ? "bold" : "normal",
              fontSize: rowData.isTotal ? "1em" : "inherit",
            }}
          >
            {formatCurrency(rowData[entity])}
          </span>
        ),
        style: createColumnStyle("right"),
        headerStyle: createColumnStyle("right"),
      })),
      {
        field: "total",
        header: "Total",
        body: (rowData: any) => {
          const total = Array.from(entities).reduce((sum, entity: string) => {
            return sum + (rowData[entity] || 0);
          }, 0);
          return (
            <span
              style={{
                fontWeight: rowData.isTotal ? "bold" : "normal",
                fontSize: rowData.isTotal ? "1em" : "inherit",
              }}
            >
              {formatCurrency(total)}
            </span>
          );
        },
        style: createColumnStyle("right"),
        headerStyle: createColumnStyle("right"),
      },
    ];

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
            value={tableData}
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
          >
            {entityColumns.map((col, i) => (
              <Column
                key={i}
                field={col.field}
                header={col.header}
                body={col.body}
                style={col.style}
                headerStyle={col.headerStyle}
              />
            ))}
          </DataTable>
        )}
      </div>
    );
  };

  const generateEntityCountTable = (isReturnData = false) => {
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

    // Process data and group by entity and doctor
    const filteredData = reportData.filter((item: any) => item.insurance);
    const entityDoctorCounts: Record<string, Record<string, number>> = {};
    const doctors = new Set<string>();
    const entities = new Set<string>();

    filteredData.forEach((entry: any) => {
      const entity = entry.insurance?.name;
      const doctor = entry.billing_doctor;
      const procedureCount = entry.billed_procedure?.length || 0;

      if (entity && doctor) {
        entities.add(entity);
        doctors.add(doctor);

        if (!entityDoctorCounts[entity]) {
          entityDoctorCounts[entity] = {};
        }

        entityDoctorCounts[entity][doctor] =
          (entityDoctorCounts[entity][doctor] || 0) + procedureCount;
      }
    });

    // Calculate column totals (doctors)
    const doctorTotals: Record<string, number> = {};
    Array.from(doctors).forEach((doctor: string) => {
      doctorTotals[doctor] = Array.from(entities).reduce(
        (sum, entity: string) => {
          return sum + (entityDoctorCounts[entity]?.[doctor] || 0);
        },
        0
      );
    });

    // Prepare table data
    const tableData = Array.from(entities).map((entity: string) => {
      const row: Record<string, any> = { entity };
      Array.from(doctors).forEach((doctor: string) => {
        row[doctor] = entityDoctorCounts[entity]?.[doctor] || 0;
      });
      return row;
    });

    // Add totals row
    const totalsRow: Record<string, any> = {
      entity: "Total",
      isTotal: true,
      style: { fontWeight: "bold", fontSize: "1em" },
    };
    Array.from(doctors).forEach((doctor: string) => {
      totalsRow[doctor] = doctorTotals[doctor] || 0;
    });
    tableData.push(totalsRow);

    if (isReturnData) {
      return reportData;
    }

    const countColumns: TableColumn[] = [
      {
        field: "entity",
        header: "Entidad",
        style: createColumnStyle("left", "200px"),
        body: (rowData: any) => (
          <span
            style={{
              fontWeight: rowData.isTotal ? "bold" : "normal",
              fontSize: rowData.isTotal ? "1em" : "inherit",
            }}
          >
            {rowData.entity}
          </span>
        ),
      },
      ...Array.from(doctors).flatMap((doctor: string) => [
        {
          field: `${doctor}_amount`,
          header: "Particular",
          body: (rowData: any) => (
            <span
              style={{
                fontWeight: rowData.isTotal ? "bold" : "normal",
                fontSize: rowData.isTotal ? "1em" : "inherit",
              }}
            >
              {rowData[doctor] || "0"}
            </span>
          ),
          style: createColumnStyle("right"),
          headerStyle: createColumnStyle("right"),
        },
        {
          field: `${doctor}_avg`,
          header: "Seguro",
          body: (rowData: any) => (
            <span
              style={{
                fontWeight: rowData.isTotal ? "bold" : "normal",
                fontSize: rowData.isTotal ? "1em" : "inherit",
              }}
            >
              {rowData[doctor] || "0"}
            </span>
          ),
          style: createColumnStyle("right"),
          headerStyle: createColumnStyle("right"),
        },
      ]),
      {
        field: "total",
        header: "Total",
        body: (rowData: any) => {
          const total = Array.from(doctors).reduce((sum, doctor: string) => {
            return sum + (rowData[doctor] || 0);
          }, 0);
          return (
            <span
              style={{
                fontWeight: rowData.isTotal ? "bold" : "normal",
                fontSize: rowData.isTotal ? "1em" : "inherit",
              }}
            >
              {total}
            </span>
          );
        },
        style: createColumnStyle("right"),
        headerStyle: createColumnStyle("right"),
      },
    ];

    // Create header group with the new subheaders
    const headerGroup = (
      <ColumnGroup>
        <Row>
          <Column header="Entidad" rowSpan={2} />
          {Array.from(doctors).map((doctor) => (
            <Column key={doctor} header={doctor} colSpan={2} />
          ))}
          <Column header="Total" rowSpan={2} />
        </Row>
        <Row>
          {Array.from(doctors).flatMap((doctor) => [
            <Column key={`${doctor}_amount`} header="Particular" />,
            <Column key={`${doctor}_avg`} header="Seguro" />,
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
          >
            {countColumns.map((col, i) => (
              <Column
                key={i}
                field={col.field}
                header={col.header}
                body={col.body}
                style={col.style}
                headerStyle={col.headerStyle}
              />
            ))}
          </DataTable>
        )}
      </div>
    );
  };

  const generateConsultationsTable = (isReturnData = false) => {
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

    // Process data and group by professional and date
    const doctorDateCounts: Record<
      string,
      Record<string, { particular: number; seguro: number }>
    > = {};
    const dates = new Set<string>();
    const doctors = new Set<string>();

    reportData.forEach((entry: any) => {
      const doctor = entry.billing_doctor;
      const date = entry.appointment_date_time?.date;

      if (doctor && date) {
        doctors.add(doctor);
        dates.add(date);

        if (!doctorDateCounts[doctor]) {
          doctorDateCounts[doctor] = {};
        }

        if (!doctorDateCounts[doctor][date]) {
          doctorDateCounts[doctor][date] = { particular: 0, seguro: 0 };
        }

        if (entry.sub_type === "public") {
          doctorDateCounts[doctor][date].particular += 1;
        } else if (entry.sub_type === "entity") {
          doctorDateCounts[doctor][date].seguro += 1;
        }
      }
    });

    // Sort dates
    const sortedDates = Array.from(dates).sort();

    // Calculate column totals (dates)
    const dateTotals: Record<string, { particular: number; seguro: number }> =
      {};
    sortedDates.forEach((date: string) => {
      dateTotals[date] = { particular: 0, seguro: 0 };

      Array.from(doctors).forEach((doctor: string) => {
        const counts = doctorDateCounts[doctor]?.[date] || {
          particular: 0,
          seguro: 0,
        };
        dateTotals[date].particular += counts.particular;
        dateTotals[date].seguro += counts.seguro;
      });
    });

    // Prepare table data
    const tableData = Array.from(doctors).map((doctor: string) => {
      const row: Record<string, any> = { doctor };
      sortedDates.forEach((date: string) => {
        const counts = doctorDateCounts[doctor]?.[date] || {
          particular: 0,
          seguro: 0,
        };
        row[`${date}_particular`] = counts.particular;
        row[`${date}_seguro`] = counts.seguro;
      });
      return row;
    });

    // Add totals row
    const totalsRow: Record<string, any> = {
      doctor: "Total",
      isTotal: true,
      style: { fontWeight: "bold", fontSize: "1em" },
    };
    sortedDates.forEach((date: string) => {
      totalsRow[`${date}_particular`] = dateTotals[date].particular;
      totalsRow[`${date}_seguro`] = dateTotals[date].seguro;
    });
    tableData.push(totalsRow);

    if (isReturnData) {
      return reportData;
    }

    const consultationColumns: TableColumn[] = [
      {
        field: "doctor",
        header: "Profesional",
        style: createColumnStyle("left", "200px"),
        body: (rowData: any) => (
          <span
            style={{
              fontWeight: rowData.isTotal ? "bold" : "normal",
              fontSize: rowData.isTotal ? "1em" : "inherit",
            }}
          >
            {rowData.doctor}
          </span>
        ),
      },
      ...sortedDates.flatMap((date: string) => [
        {
          field: `${date}_particular`,
          header: "Particular",
          body: (rowData: any) => (
            <span
              style={{
                fontWeight: rowData.isTotal ? "bold" : "normal",
                fontSize: rowData.isTotal ? "1em" : "inherit",
              }}
            >
              {rowData[`${date}_particular`] || "0"}
            </span>
          ),
          style: createColumnStyle("center"),
          headerStyle: createColumnStyle("center"),
        },
        {
          field: `${date}_seguro`,
          header: "Seguro",
          body: (rowData: any) => (
            <span
              style={{
                fontWeight: rowData.isTotal ? "bold" : "normal",
                fontSize: rowData.isTotal ? "1em" : "inherit",
              }}
            >
              {rowData[`${date}_seguro`] || "0"}
            </span>
          ),
          style: createColumnStyle("center"),
          headerStyle: createColumnStyle("center"),
        },
      ]),
      {
        field: "total",
        header: "Total",
        body: (rowData: any) => {
          const total = sortedDates.reduce((sum, date: string) => {
            return (
              sum +
              (rowData[`${date}_particular`] || 0) +
              (rowData[`${date}_seguro`] || 0)
            );
          }, 0);
          return (
            <span
              style={{
                fontWeight: rowData.isTotal ? "bold" : "normal",
                fontSize: rowData.isTotal ? "1em" : "inherit",
              }}
            >
              {total}
            </span>
          );
        },
        style: createColumnStyle("center"),
        headerStyle: createColumnStyle("center"),
      },
    ];

    // Create header group with the new subheaders
    const headerGroup = (
      <ColumnGroup>
        <Row>
          <Column header="Profesional" rowSpan={2} />
          {sortedDates.map((date) => (
            <Column key={date} header={date} colSpan={2} />
          ))}
          <Column header="Total" rowSpan={2} />
        </Row>
        <Row>
          {sortedDates.flatMap((date) => [
            <Column key={`${date}_particular`} header="Particular" />,
            <Column key={`${date}_seguro`} header="Seguro" />,
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
          >
            {consultationColumns.map((col, i) => (
              <Column
                key={i}
                field={col.field}
                header={col.header}
                body={col.body}
                style={col.style}
                headerStyle={col.headerStyle}
              />
            ))}
          </DataTable>
        )}
      </div>
    );
  };

  const generateTableProductivity = (isReturnData = false) => {
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

    if (isReturnData) {
      return reportData;
    }

    // Process productivity data for DataTable
    const productivityData: any[] = [];

    reportData.forEach((user: any, userIndex) => {
      let countAppointments = user.appointments?.length;
      let countProceduresInvoiced = 0;
      const fullName = `${user.first_name ?? ""} ${user.middle_name ?? ""} ${user.last_name ?? ""
        } ${user.second_name ?? ""}`;

      // Add professional summary row
      productivityData.push({
        id: `professional_${userIndex}`,
        doctor: fullName,
        date: "",
        countAppointments: countAppointments,
        proceduresInvoiced: countProceduresInvoiced,
        average: countAppointments > 0
          ? ((countProceduresInvoiced / countAppointments) * 100).toFixed(2) + "%"
          : "0%",
        isProfessional: true,
        rawData: user.appointments
      });

      // Add appointment detail rows
      user.appointments?.forEach((appointment, appointmentIndex) => {
        let status = "unInvoiced";
        if (
          appointment.admission &&
          appointment.admission.invoice &&
          appointment?.admission?.invoice?.status !== "cancelled"
        ) {
          countProceduresInvoiced++;
          status = "invoiced";
        }

        productivityData.push({
          id: `appointment_${userIndex}_${appointmentIndex}`,
          doctor: fullName,
          date: appointment.appointment_date,
          countAppointments: appointment.exam_recipe.details
            .map((detail) => detail.exam_type.name)
            .join(", "),
          proceduresInvoiced: appointment?.admission?.invoice?.details
            .map((detail) => detail.product.name)
            .join(", ") ?? "Sin factura",
          average: status,
          isProfessional: false,
          rawData: [appointment]
        });
      });
    });

    const doctorTemplate = (rowData: any) =>
      rowData.isProfessional ? (
        <strong>{rowData.doctor}</strong>
      ) : (
        <span style={{ paddingLeft: "20px" }}>{rowData.doctor}</span>
      );

    const ordersTemplate = (rowData: any) =>
      rowData.isProfessional ? (
        <strong>{rowData.countAppointments}</strong>
      ) : (
        <span>{rowData.countAppointments}</span>
      );

    const datesTemplate = (rowData: any) =>
      rowData.isProfessional ? (
        <strong>{rowData.date}</strong>
      ) : (
        <span>{rowData.date}</span>
      );

    const proceduresInvoicedTemplate = (rowData: any) =>
      rowData.isProfessional ? (
        <strong>{rowData.proceduresInvoiced}</strong>
      ) : (
        <span>{rowData.proceduresInvoiced}</span>
      );

    const averageTemplate = (rowData: any) => {
      if (rowData.isProfessional) {
        return <strong>{rowData.average}</strong>;
      } else {
        return (
          <span
            style={{
              paddingLeft: "20px",
              color: rowData.average === "unInvoiced" ? "red" : "green",
            }}
          >
            {rowData.average == "unInvoiced" ? "No facturado" : "Facturado"}
          </span>
        );
      }
    };

    const rowClassName = (data: any) => {
      return data.isProfessional ? 'font-bold bg-blue-50' : '';
    };

    return (
      <div className="border-top border-translucent">
        {loading ? (
          <div className="text-center p-5">
            <ProgressSpinner />
            <p className="mt-2">Cargando datos...</p>
          </div>
        ) : (
          <div id="purchasersSellersTable">
            <div className="card">
              <DataTable
                value={productivityData}
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
              >
                <Column
                  field="doctor"
                  header="Profesional"
                  body={doctorTemplate}
                  style={{ minWidth: "250px" }}
                />
                <Column
                  field="date"
                  header="Fecha cita"
                  body={datesTemplate}
                  style={{ minWidth: "150px" }}
                />
                <Column
                  field="countAppointments"
                  header="Ordenes"
                  body={ordersTemplate}
                  style={{ minWidth: "150px" }}
                />
                <Column
                  field="proceduresInvoiced"
                  header="Servicios facturados"
                  body={proceduresInvoicedTemplate}
                  style={{ minWidth: "200px" }}
                />
                <Column
                  field="average"
                  header="Productividad %"
                  body={averageTemplate}
                  style={{ minWidth: "150px" }}
                />
              </DataTable>
            </div>
            <div className="row align-items-center justify-content-between pe-0 fs-9 mt-3">
              <div className="col-auto d-flex">
                <p className="mb-0 d-none d-sm-block me-3 fw-semibold text-body">
                  Mostrando {productivityData.filter(item => item.isProfessional).length} Profesionales
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="main" id="top">
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
                        className={`tab-item ${activeTab === "doctors-tab" ? "active" : ""}`}
                        onClick={() => handleTabChange("doctors-tab")}
                      >
                        <i className="fas fa-dollar-sign"></i>
                        Procedimientos $
                      </button>
                      <button
                        className={`tab-item ${activeTab === "doctors-count-tab" ? "active" : ""}`}
                        onClick={() => handleTabChange("doctors-count-tab")}
                      >
                        <i className="fas fa-hashtag"></i>
                        Procedimientos #
                      </button>
                      <button
                        className={`tab-item ${activeTab === "precios-entidad-tab" ? "active" : ""}`}
                        onClick={() => handleTabChange("precios-entidad-tab")}
                      >
                        <i className="fas fa-building"></i>
                        Entidades $
                      </button>
                      <button
                        className={`tab-item ${activeTab === "conteo-entidad-tab" ? "active" : ""}`}
                        onClick={() => handleTabChange("conteo-entidad-tab")}
                      >
                        <i className="fas fa-building"></i>
                        Entidades #
                      </button>
                      <button
                        className={`tab-item ${activeTab === "consultas-tab" ? "active" : ""}`}
                        onClick={() => handleTabChange("consultas-tab")}
                      >
                        <i className="fas fa-calendar-check"></i>
                        Consultas
                      </button>
                      <button
                        className={`tab-item ${activeTab === "productivity-tab" ? "active" : ""}`}
                        onClick={() => handleTabChange("productivity-tab")}
                      >
                        <i className="fas fa-chart-line"></i>
                        Productividad
                      </button>
                    </div>

                    <div className="tabs-content">
                      {/* Panel de Procedimientos $ */}
                      <div className={`tab-panel ${activeTab === "doctors-tab" ? "active" : ""}`}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <span className="text-xl font-semibold">Procedimientos por Monto</span>
                          <div className="d-flex gap-2">
                            <span className="p-input-icon-left">
                              <i className="pi pi-search" />
                              <InputText
                                type="search"
                                onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                                placeholder="Buscar..."
                              />
                            </span>
                            <ExportButtonExcel
                              onClick={handleExportProcedures}
                              loading={exporting.procedures}
                              disabled={!reportData || reportData.length === 0}
                            />
                            <ExportButtonPDF
                              onClick={() => exportToPDF("doctors-tab")}
                              loading={exporting.procedures}
                              disabled={!reportData || reportData.length === 0}
                            />
                          </div>
                        </div>
                        {generateDoctorsTable()}
                      </div>

                      {/* Panel de Procedimientos # */}
                      <div className={`tab-panel ${activeTab === "doctors-count-tab" ? "active" : ""}`}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <span className="text-xl font-semibold">Procedimientos por Conteo</span>
                          <div className="d-flex gap-2">
                            <span className="p-input-icon-left">
                              <i className="pi pi-search" />
                              <InputText
                                type="search"
                                onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                                placeholder="Buscar..."
                              />
                            </span>
                            <ExportButtonExcel
                              onClick={handleExportProceduresCount}
                              loading={exporting.proceduresCount}
                              disabled={!reportData || reportData.length === 0}
                            />
                            <ExportButtonPDF
                              onClick={() => exportToPDF("doctors-count-tab")}
                              loading={exporting.proceduresCount}
                              disabled={!reportData || reportData.length === 0}
                            />
                          </div>
                        </div>
                        {generateDoctorsCountTable()}
                      </div>

                      {/* Panel de Entidades $ */}
                      <div className={`tab-panel ${activeTab === "precios-entidad-tab" ? "active" : ""}`}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <span className="text-xl font-semibold">Entidades por Monto</span>
                          <div className="d-flex gap-2">
                            <span className="p-input-icon-left">
                              <i className="pi pi-search" />
                              <InputText
                                type="search"
                                onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                                placeholder="Buscar..."
                              />
                            </span>
                            <ExportButtonExcel
                              onClick={handleExportEntityPrices}
                              loading={exporting.entityPrices}
                              disabled={
                                !reportData ||
                                reportData.length === 0 ||
                                !reportData.some((item) => item.insurance)
                              }
                            />
                            <ExportButtonPDF
                              onClick={() => exportToPDF("precios-entidad-tab")}
                              loading={exporting.entityPrices}
                              disabled={!reportData || reportData.length === 0}
                            />
                          </div>
                        </div>
                        {generateEntityPricesTable()}
                      </div>

                      {/* Panel de Entidades # */}
                      <div className={`tab-panel ${activeTab === "conteo-entidad-tab" ? "active" : ""}`}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <span className="text-xl font-semibold">Entidades por Conteo</span>
                          <div className="d-flex gap-2">
                            <span className="p-input-icon-left">
                              <i className="pi pi-search" />
                              <InputText
                                type="search"
                                onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                                placeholder="Buscar..."
                              />
                            </span>
                            <ExportButtonExcel
                              onClick={handleExportEntityCounts}
                              loading={exporting.entityCounts}
                              disabled={
                                !reportData ||
                                reportData.length === 0 ||
                                !reportData.some((item) => item.insurance)
                              }
                            />
                            <ExportButtonPDF
                              onClick={() => exportToPDF("conteo-entidad-tab")}
                              loading={exporting.entityCounts}
                              disabled={!reportData || reportData.length === 0}
                            />
                          </div>
                        </div>
                        {generateEntityCountTable()}
                      </div>

                      {/* Panel de Consultas */}
                      <div className={`tab-panel ${activeTab === "consultas-tab" ? "active" : ""}`}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <span className="text-xl font-semibold">Consultas por Profesional</span>
                          <div className="d-flex gap-2">
                            <span className="p-input-icon-left">
                              <i className="pi pi-search" />
                              <InputText
                                type="search"
                                onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                                placeholder="Buscar..."
                              />
                            </span>
                            <ExportButtonExcel
                              onClick={handleExportConsultations}
                              loading={exporting.consultations}
                              disabled={!reportData || reportData.length === 0}
                            />
                            <ExportButtonPDF
                              onClick={() => exportToPDF("consultas-tab")}
                              loading={exporting.consultations}
                              disabled={!reportData || reportData.length === 0}
                            />
                          </div>
                        </div>
                        {generateConsultationsTable()}
                      </div>

                      {/* Panel de Productividad */}
                      <div className={`tab-panel ${activeTab === "productivity-tab" ? "active" : ""}`}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <span className="text-xl font-semibold">Productividad por Profesional</span>
                          <div className="d-flex gap-2">
                            <span className="p-input-icon-left">
                              <i className="pi pi-search" />
                              <InputText
                                type="search"
                                onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                                placeholder="Buscar..."
                              />
                            </span>
                            <ExportButtonExcel
                              onClick={handleExportConsultations}
                              loading={exporting.consultations}
                              disabled={!reportData || reportData.length === 0}
                            />
                            <ExportButtonPDF
                              onClick={() => exportToPDF("productivity-tab")}
                              loading={exporting.consultations}
                              disabled={!reportData || reportData.length === 0}
                            />
                          </div>
                        </div>
                        {generateTableProductivity()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

const ExportButtonExcel = ({
  onClick,
  loading,
  disabled,
}: ExportButtonProps) => {
  return (
    <Button
      tooltip="Exportar a excel"
      tooltipOptions={{ position: "top" }}
      onClick={onClick}
      className="p-button-success"
      disabled={disabled || loading}
    >
      <i className="fa-solid fa-file-excel"></i>
    </Button>
  );
};

const ExportButtonPDF = ({ onClick, loading, disabled }: ExportButtonProps) => {
  return (
    <Button
      tooltip="Exportar a PDF"
      tooltipOptions={{ position: "top" }}
      onClick={onClick}
      className="p-button-secondary"
      disabled={disabled || loading}
    >
      <i className="fa-solid fa-file-pdf"></i>
    </Button>
  );
};