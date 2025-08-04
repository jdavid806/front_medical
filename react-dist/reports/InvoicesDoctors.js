import React, { useState, useEffect } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { exportDoctorsProceduresToExcel, exportEntityPricesToExcel, exportEntityCountsToExcel, exportConsultationsToExcel } from "./excel/ExcelSpecialist.js"; // Import your services
import { productService, userService, patientService, billingService, entityService } from "../../services/api/index.js";
import { generatePDFFromHTML } from "../../funciones/funcionesJS/exportPDF.js";
import { useCompany } from "../hooks/useCompany.js";
export const SpecialistsReport = () => {
  // Set default date range (last 5 days)
  const today = new Date();
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(today.getDate() - 5);

  // State for filters
  const [procedures, setProcedures] = useState([]);
  const [selectedProcedures, setSelectedProcedures] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [selectedSpecialists, setSelectedSpecialists] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [dateRange, setDateRange] = useState([fiveDaysAgo, today]);
  const {
    company,
    setCompany,
    fetchCompany
  } = useCompany();

  // State for report data
  const [reportData, setReportData] = useState([]);
  const [activeTab, setActiveTab] = useState("doctors-tab");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  // Pagination state
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  // Export loading states
  const [exporting, setExporting] = useState({
    procedures: false,
    entityPrices: false,
    entityCounts: false,
    consultations: false
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
          patient_ids: [],
          product_ids: [],
          user_ids: [],
          entity_id: null
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
  const loadData = async (filterParams = {}) => {
    try {
      setTableLoading(true);
      const data = await billingService.getBillingReport(filterParams);
      setReportData(data);
      return data; // Retornamos los datos por si se necesitan
    } catch (error) {
      console.error("Error loading report data:", error);
      throw error; // Relanzamos el error para manejarlo donde se llame
    } finally {
      setTableLoading(false);
    }
  };
  const handleTabChange = async tab => {
    try {
      setActiveTab(tab);
      const filterParams = {
        end_date: dateRange[1] ? formatDate(dateRange[1]) : "",
        start_date: dateRange[0] ? formatDate(dateRange[0]) : "",
        patient_ids: selectedPatients,
        product_ids: selectedProcedures,
        user_ids: selectedSpecialists,
        entity_id: selectedEntity
      };
      await loadData(filterParams);
    } catch (error) {
      console.error("Error changing tab:", error);
    }
  };
  const onPageChange = event => {
    setFirst(event.first);
    setRows(event.rows);
  };
  const formatCurrency = value => {
    const formatted = new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2
    }).format(value);
    return formatted;
  };
  const loadProcedures = async () => {
    try {
      const response = await productService.getAllProducts();
      setProcedures(response.data.map(item => ({
        label: item.attributes.name,
        value: item.id
      })));
    } catch (error) {
      console.error("Error loading procedures:", error);
    }
  };
  const loadSpecialists = async () => {
    try {
      const response = await userService.getAllUsers();
      setSpecialists(response.map(user => ({
        label: `${user.first_name} ${user.last_name} - ${user.specialty?.name || ""}`,
        value: user.id
      })));
    } catch (error) {
      console.error("Error loading specialists:", error);
    }
  };
  const loadPatients = async () => {
    try {
      const response = await patientService.getAll();
      setPatients(response.map(patient => ({
        label: `${patient.first_name} ${patient.last_name}`,
        value: patient.id
      })));
    } catch (error) {
      console.error("Error loading patients:", error);
    }
  };
  const loadEntities = async () => {
    try {
      const response = await entityService.getAll();
      setEntities([{
        label: "Seleccione",
        value: null
      }, ...response.data.map(entity => ({
        label: entity.name,
        value: entity.id
      }))]);
    } catch (error) {
      console.error("Error loading entities:", error);
    }
  };
  const createColumnStyle = (textAlign = "left", minWidth = "150px") => ({
    textAlign,
    minWidth
  });
  const handleFilter = async () => {
    try {
      const filterParams = {
        end_date: dateRange[1] ? formatDate(dateRange[1]) : "",
        start_date: dateRange[0] ? formatDate(dateRange[0]) : "",
        patient_ids: selectedPatients,
        product_ids: selectedProcedures,
        user_ids: selectedSpecialists,
        entity_id: selectedEntity
      };
      await loadData(filterParams);
      setFirst(0); // Reset to first page when filtering
    } catch (error) {
      console.error("Error filtering data:", error);
    }
  };
  const handleExportProcedures = async () => {
    try {
      setExporting({
        ...exporting,
        procedures: true
      });
      await exportDoctorsProceduresToExcel(reportData);
    } catch (error) {
      console.error("Error exporting procedures:", error);
      alert(error.message);
    } finally {
      setExporting({
        ...exporting,
        procedures: false
      });
    }
  };
  const handleExportEntityPrices = async () => {
    try {
      setExporting({
        ...exporting,
        entityPrices: true
      });
      await exportEntityPricesToExcel(reportData);
    } catch (error) {
      console.error("Error exporting entity prices:", error);
      alert(error.message);
    } finally {
      setExporting({
        ...exporting,
        entityPrices: false
      });
    }
  };
  const handleExportEntityCounts = async () => {
    try {
      setExporting({
        ...exporting,
        entityCounts: true
      });
      await exportEntityCountsToExcel(reportData);
    } catch (error) {
      console.error("Error exporting entity counts:", error);
      alert(error.message);
    } finally {
      setExporting({
        ...exporting,
        entityCounts: false
      });
    }
  };
  const handleExportConsultations = async () => {
    try {
      setExporting({
        ...exporting,
        consultations: true
      });
      await exportConsultationsToExcel(reportData);
    } catch (error) {
      console.error("Error exporting consultations:", error);
      alert(error.message);
    } finally {
      setExporting({
        ...exporting,
        consultations: false
      });
    }
  };
  function exportToPDF(tab = "") {
    let dataExport = [];
    let namePDF = "";
    switch (tab) {
      case "doctors-tab":
        dataExport = generateDoctorsTable(true);
        namePDF = "Procedimientos";
        break;
      case "entities-tab":
        dataExport = generateEntityPricesTable(true);
        namePDF = "Entidades";
        break;
      case "prices-tab":
        dataExport = generateEntityCountTable(true);
        namePDF = "Precios";
        break;
      case "consultation-tab":
        dataExport = generateConsultationsTable(true);
        namePDF = "Consultas";
        break;
    }
    console.log("dataExport", dataExport);
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
                ${Object.keys(headers).map(header => `<th>${header}</th>`).join("")}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${dataExport.reduce((acc, child, index) => {
      let rowTotal = 0;
      const formattedCells = Object.keys(headers).map(header => {
        const value = child[header];
        const num = Number(value);
        if (!isNaN(num)) {
          rowTotal += num;
          return `<td class="number-cell">${formatCurrency(num)}</td>`;
        }
        return `<td>${value}</td>`;
      });
      return acc + `
                    <tr>
                      ${formattedCells.join("")}
                      <td class="number-cell">${formatCurrency(rowTotal)}</td>
                    </tr>
                  `;
    }, "")}
            </tbody>
          </table>`;
    const configPDF = {
      name: namePDF
    };
    generatePDFFromHTML(table, company, configPDF);
  }
  const formatDate = date => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const generateDoctorsTable = (isReturnData = false) => {
    if (!reportData || reportData.length === 0) {
      return /*#__PURE__*/React.createElement("div", {
        className: "flex justify-content-center align-items-center",
        style: {
          height: "200px"
        }
      }, /*#__PURE__*/React.createElement("span", null, "No hay datos disponibles"));
    }

    // Process data and group by procedure and doctor
    const procedureDoctorTotals = {};
    const doctors = new Set();
    const procedureSet = new Set();
    reportData.forEach(entry => {
      const doctor = entry.billing_doctor;
      doctors.add(doctor);
      entry.billed_procedure?.forEach(proc => {
        const procedureName = proc.product?.name;
        const amount = parseFloat(proc.amount) || 0;
        procedureSet.add(procedureName);
        if (!procedureDoctorTotals[procedureName]) {
          procedureDoctorTotals[procedureName] = {};
        }
        procedureDoctorTotals[procedureName][doctor] = (procedureDoctorTotals[procedureName][doctor] || 0) + amount;
      });
    });

    // Calculate column totals (doctors)
    const doctorTotals = {};
    Array.from(doctors).forEach(doctor => {
      doctorTotals[doctor] = Array.from(procedureSet).reduce((sum, proc) => {
        return sum + (procedureDoctorTotals[proc]?.[doctor] || 0);
      }, 0);
    });

    // Prepare table data
    const tableData = Array.from(procedureSet).map(proc => {
      const row = {
        procedure: proc
      };
      Array.from(doctors).forEach(doctor => {
        row[doctor] = procedureDoctorTotals[proc]?.[doctor] || 0;
      });
      return row;
    });

    // Add totals row
    const totalsRow = {
      procedure: "Total",
      isTotal: true,
      style: {
        fontWeight: "bold",
        fontSize: "1em"
      }
    };
    Array.from(doctors).forEach(doctor => {
      totalsRow[doctor] = doctorTotals[doctor] || 0;
    });
    tableData.push(totalsRow);
    if (isReturnData) {
      return tableData;
    }
    const procedureColumns = [{
      field: "procedure",
      header: "Procedimiento",
      style: createColumnStyle("left", "200px"),
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal ? "bold" : "normal",
          fontSize: rowData.isTotal ? "1em" : "inherit"
        }
      }, rowData.procedure)
    }, ...Array.from(doctors).map(doctor => ({
      field: doctor,
      header: doctor,
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal ? "bold" : "normal",
          fontSize: rowData.isTotal ? "1em" : "inherit"
        }
      }, formatCurrency(rowData[doctor])),
      style: createColumnStyle("center", "nowrap"),
      headerStyle: createColumnStyle("center", "180px")
    })), {
      field: "total",
      header: "Total",
      body: rowData => {
        const total = Array.from(doctors).reduce((sum, doctor) => {
          return sum + (rowData[doctor] || 0);
        }, 0);
        return /*#__PURE__*/React.createElement("span", {
          style: {
            fontWeight: rowData.isTotal ? "bold" : "normal",
            fontSize: rowData.isTotal ? "1em" : "inherit"
          }
        }, formatCurrency(total));
      },
      style: createColumnStyle("center", "nowrap"),
      headerStyle: createColumnStyle("center", "180px")
    }];
    return /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, tableLoading ? /*#__PURE__*/React.createElement("div", {
      className: "flex justify-content-center align-items-center",
      style: {
        height: "200px",
        marginLeft: "800px"
      }
    }, /*#__PURE__*/React.createElement(ProgressSpinner, null)) : /*#__PURE__*/React.createElement(DataTable, {
      value: tableData,
      loading: tableLoading,
      scrollable: true,
      scrollHeight: "flex",
      showGridlines: true,
      stripedRows: true,
      size: "small",
      tableStyle: {
        minWidth: "100%",
        width: "100%"
      },
      className: "p-datatable-sm",
      paginator: true,
      rows: rows,
      first: first,
      onPage: onPageChange,
      rowsPerPageOptions: [5, 10, 25, 50],
      paginatorTemplate: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",
      currentPageReportTemplate: "Mostrando {first} a {last} de {totalRecords} registros"
    }, procedureColumns.map((col, i) => /*#__PURE__*/React.createElement(Column, {
      key: i,
      field: col.field,
      header: col.header,
      body: col.body,
      style: col.style,
      headerStyle: col.headerStyle
    }))));
  };
  const generateEntityPricesTable = (isReturnData = false) => {
    if (!reportData || reportData.length === 0 || !reportData.some(item => item.insurance)) {
      return /*#__PURE__*/React.createElement("div", {
        className: "flex justify-content-center align-items-center",
        style: {
          height: "200px"
        }
      }, /*#__PURE__*/React.createElement("span", null, "No hay datos disponibles"));
    }

    // Process data and group by doctor and entity
    const filteredData = reportData.filter(item => item.insurance);
    const doctorEntityTotals = {};
    const entities = new Set();
    const doctors = new Set();
    filteredData.forEach(entry => {
      const entity = entry.insurance?.name;
      const doctor = entry.billing_doctor;
      const total = entry.billed_procedure?.reduce((sum, proc) => sum + parseFloat(proc.amount || 0), 0);
      if (entity && doctor) {
        entities.add(entity);
        doctors.add(doctor);
        if (!doctorEntityTotals[doctor]) {
          doctorEntityTotals[doctor] = {};
        }
        doctorEntityTotals[doctor][entity] = (doctorEntityTotals[doctor][entity] || 0) + total;
      }
    });

    // Calculate column totals (entities)
    const entityTotals = {};
    Array.from(entities).forEach(entity => {
      entityTotals[entity] = Array.from(doctors).reduce((sum, doctor) => {
        return sum + (doctorEntityTotals[doctor]?.[entity] || 0);
      }, 0);
    });

    // Prepare table data
    const tableData = Array.from(doctors).map(doctor => {
      const row = {
        doctor
      };
      Array.from(entities).forEach(entity => {
        row[entity] = doctorEntityTotals[doctor]?.[entity] || 0;
      });
      return row;
    });

    // Add totals row
    const totalsRow = {
      doctor: "Total",
      isTotal: true,
      style: {
        fontWeight: "bold",
        fontSize: "1em"
      }
    };
    Array.from(entities).forEach(entity => {
      totalsRow[entity] = entityTotals[entity] || 0;
    });
    tableData.push(totalsRow);
    if (isReturnData) {
      return tableData;
    }
    const entityColumns = [{
      field: "doctor",
      header: "Médico",
      style: createColumnStyle("left", "200px"),
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal ? "bold" : "normal",
          fontSize: rowData.isTotal ? "1em" : "inherit"
        }
      }, rowData.doctor)
    }, ...Array.from(entities).map(entity => ({
      field: entity,
      header: entity,
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal ? "bold" : "normal",
          fontSize: rowData.isTotal ? "1em" : "inherit"
        }
      }, formatCurrency(rowData[entity])),
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right")
    })), {
      field: "total",
      header: "Total",
      body: rowData => {
        const total = Array.from(entities).reduce((sum, entity) => {
          return sum + (rowData[entity] || 0);
        }, 0);
        return /*#__PURE__*/React.createElement("span", {
          style: {
            fontWeight: rowData.isTotal ? "bold" : "normal",
            fontSize: rowData.isTotal ? "1em" : "inherit"
          }
        }, formatCurrency(total));
      },
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right")
    }];
    return /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, tableLoading ? /*#__PURE__*/React.createElement("div", {
      className: "flex justify-content-center align-items-center",
      style: {
        height: "200px"
      }
    }, /*#__PURE__*/React.createElement(ProgressSpinner, null)) : /*#__PURE__*/React.createElement(DataTable, {
      value: tableData,
      loading: tableLoading,
      scrollable: true,
      scrollHeight: "flex",
      showGridlines: true,
      stripedRows: true,
      size: "small",
      tableStyle: {
        minWidth: "100%"
      },
      className: "p-datatable-sm",
      paginator: true,
      rows: rows,
      first: first,
      onPage: onPageChange,
      rowsPerPageOptions: [5, 10, 25, 50],
      paginatorTemplate: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",
      currentPageReportTemplate: "Mostrando {first} a {last} de {totalRecords} registros"
    }, entityColumns.map((col, i) => /*#__PURE__*/React.createElement(Column, {
      key: i,
      field: col.field,
      header: col.header,
      body: col.body,
      style: col.style,
      headerStyle: col.headerStyle
    }))));
  };
  const generateEntityCountTable = (isReturnData = false) => {
    if (!reportData || reportData.length === 0 || !reportData.some(item => item.insurance)) {
      return /*#__PURE__*/React.createElement("div", {
        className: "flex justify-content-center align-items-center",
        style: {
          height: "200px"
        }
      }, /*#__PURE__*/React.createElement("span", null, "No hay datos disponibles"));
    }

    // Process data and group by entity and doctor
    const filteredData = reportData.filter(item => item.insurance);
    const entityDoctorCounts = {};
    const doctors = new Set();
    const entities = new Set();
    filteredData.forEach(entry => {
      const entity = entry.insurance?.name;
      const doctor = entry.billing_doctor;
      const procedureCount = entry.billed_procedure?.length || 0;
      if (entity && doctor) {
        entities.add(entity);
        doctors.add(doctor);
        if (!entityDoctorCounts[entity]) {
          entityDoctorCounts[entity] = {};
        }
        entityDoctorCounts[entity][doctor] = (entityDoctorCounts[entity][doctor] || 0) + procedureCount;
      }
    });

    // Calculate column totals (doctors)
    const doctorTotals = {};
    Array.from(doctors).forEach(doctor => {
      doctorTotals[doctor] = Array.from(entities).reduce((sum, entity) => {
        return sum + (entityDoctorCounts[entity]?.[doctor] || 0);
      }, 0);
    });

    // Prepare table data
    const tableData = Array.from(entities).map(entity => {
      const row = {
        entity
      };
      Array.from(doctors).forEach(doctor => {
        row[doctor] = entityDoctorCounts[entity]?.[doctor] || 0;
      });
      return row;
    });

    // Add totals row
    const totalsRow = {
      entity: "Total",
      isTotal: true,
      style: {
        fontWeight: "bold",
        fontSize: "1em"
      }
    };
    Array.from(doctors).forEach(doctor => {
      totalsRow[doctor] = doctorTotals[doctor] || 0;
    });
    tableData.push(totalsRow);
    if (isReturnData) {
      return tableData;
    }
    const countColumns = [{
      field: "entity",
      header: "Entidad",
      style: createColumnStyle("left", "200px"),
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal ? "bold" : "normal",
          fontSize: rowData.isTotal ? "1em" : "inherit"
        }
      }, rowData.entity)
    }, ...Array.from(doctors).map(doctor => ({
      field: doctor,
      header: doctor,
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal ? "bold" : "normal",
          fontSize: rowData.isTotal ? "1em" : "inherit"
        }
      }, rowData[doctor]),
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right")
    })), {
      field: "total",
      header: "Total",
      body: rowData => {
        const total = Array.from(doctors).reduce((sum, doctor) => {
          return sum + (rowData[doctor] || 0);
        }, 0);
        return /*#__PURE__*/React.createElement("span", {
          style: {
            fontWeight: rowData.isTotal ? "bold" : "normal",
            fontSize: rowData.isTotal ? "1em" : "inherit"
          }
        }, total);
      },
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right")
    }];
    return /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, tableLoading ? /*#__PURE__*/React.createElement("div", {
      className: "flex justify-content-center align-items-center",
      style: {
        height: "200px"
      }
    }, /*#__PURE__*/React.createElement(ProgressSpinner, null)) : /*#__PURE__*/React.createElement(DataTable, {
      value: tableData,
      loading: tableLoading,
      scrollable: true,
      scrollHeight: "flex",
      showGridlines: true,
      stripedRows: true,
      size: "small",
      tableStyle: {
        minWidth: "100%"
      },
      className: "p-datatable-sm",
      paginator: true,
      rows: rows,
      first: first,
      onPage: onPageChange,
      rowsPerPageOptions: [5, 10, 25, 50],
      paginatorTemplate: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",
      currentPageReportTemplate: "Mostrando {first} a {last} de {totalRecords} registros"
    }, countColumns.map((col, i) => /*#__PURE__*/React.createElement(Column, {
      key: i,
      field: col.field,
      header: col.header,
      body: col.body,
      style: col.style,
      headerStyle: col.headerStyle
    }))));
  };
  const generateConsultationsTable = (isReturnData = false) => {
    if (!reportData || reportData.length === 0) {
      return /*#__PURE__*/React.createElement("div", {
        className: "flex justify-content-center align-items-center",
        style: {
          height: "200px"
        }
      }, /*#__PURE__*/React.createElement("span", null, "No hay datos disponibles"));
    }

    // Process data and group by professional and date
    const doctorDateCounts = {};
    const dates = new Set();
    const doctors = new Set();
    reportData.forEach(entry => {
      const doctor = entry.billing_doctor;
      const date = entry.appointment_date_time?.date;
      if (doctor && date) {
        doctors.add(doctor);
        dates.add(date);
        if (!doctorDateCounts[doctor]) {
          doctorDateCounts[doctor] = {};
        }
        doctorDateCounts[doctor][date] = (doctorDateCounts[doctor][date] || 0) + 1;
      }
    });

    // Sort dates
    const sortedDates = Array.from(dates).sort();

    // Calculate column totals (dates)
    const dateTotals = {};
    sortedDates.forEach(date => {
      dateTotals[date] = Array.from(doctors).reduce((sum, doctor) => {
        return sum + (doctorDateCounts[doctor]?.[date] || 0);
      }, 0);
    });

    // Prepare table data
    const tableData = Array.from(doctors).map(doctor => {
      const row = {
        doctor
      };
      sortedDates.forEach(date => {
        row[date] = doctorDateCounts[doctor]?.[date] || 0;
      });
      return row;
    });

    // Add totals row
    const totalsRow = {
      doctor: "Total",
      isTotal: true,
      style: {
        fontWeight: "bold",
        fontSize: "1em"
      }
    };
    sortedDates.forEach(date => {
      totalsRow[date] = dateTotals[date] || 0;
    });
    tableData.push(totalsRow);
    if (isReturnData) {
      return tableData;
    }
    const consultationColumns = [{
      field: "doctor",
      header: "Profesional",
      style: createColumnStyle("left", "200px"),
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal ? "bold" : "normal",
          fontSize: rowData.isTotal ? "1em" : "inherit"
        }
      }, rowData.doctor)
    }, ...sortedDates.map(date => ({
      field: date,
      header: date,
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal ? "bold" : "normal",
          fontSize: rowData.isTotal ? "1em" : "inherit"
        }
      }, rowData[date]),
      style: createColumnStyle("center"),
      headerStyle: createColumnStyle("center")
    })), {
      field: "total",
      header: "Total",
      body: rowData => {
        const total = sortedDates.reduce((sum, date) => {
          return sum + (rowData[date] || 0);
        }, 0);
        return /*#__PURE__*/React.createElement("span", {
          style: {
            fontWeight: rowData.isTotal ? "bold" : "normal",
            fontSize: rowData.isTotal ? "1em" : "inherit"
          }
        }, total);
      },
      style: createColumnStyle("center"),
      headerStyle: createColumnStyle("center")
    }];
    return /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, tableLoading ? /*#__PURE__*/React.createElement("div", {
      className: "flex justify-content-center align-items-center",
      style: {
        height: "200px"
      }
    }, /*#__PURE__*/React.createElement(ProgressSpinner, null)) : /*#__PURE__*/React.createElement(DataTable, {
      value: tableData,
      loading: tableLoading,
      scrollable: true,
      scrollHeight: "flex",
      showGridlines: true,
      stripedRows: true,
      size: "small",
      tableStyle: {
        minWidth: "100%"
      },
      className: "p-datatable-sm",
      paginator: true,
      rows: rows,
      first: first,
      onPage: onPageChange,
      rowsPerPageOptions: [5, 10, 25, 50],
      paginatorTemplate: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",
      currentPageReportTemplate: "Mostrando {first} a {last} de {totalRecords} registros"
    }, consultationColumns.map((col, i) => /*#__PURE__*/React.createElement(Column, {
      key: i,
      field: col.field,
      header: col.header,
      body: col.body,
      style: col.style,
      headerStyle: col.headerStyle
    }))));
  };
  return /*#__PURE__*/React.createElement("main", {
    className: "main",
    id: "top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pb-9"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "mb-4"
  }, "Especialistas"), loading ? /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-center align-items-center",
    style: {
      height: "50vh",
      marginLeft: "900px",
      marginTop: "300px"
    }
  }, /*#__PURE__*/React.createElement(ProgressSpinner, null)) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "row g-3 justify-content-between align-items-start mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "nav nav-underline fs-9",
    id: "myTab",
    role: "tablist"
  }, /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: `nav-link ${activeTab === "range-dates-tab" ? "active" : ""}`,
    id: "range-dates-tab",
    onClick: () => setActiveTab("range-dates-tab"),
    role: "tab"
  }, "Filtros"))), /*#__PURE__*/React.createElement("div", {
    className: "tab-content mt-3",
    id: "myTabContent"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tab-pane fade show active",
    id: "tab-range-dates",
    role: "tabpanel",
    "aria-labelledby": "range-dates-tab"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card border border-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "procedure"
  }, "Procedimientos"), /*#__PURE__*/React.createElement(MultiSelect, {
    id: "procedure",
    value: selectedProcedures,
    options: procedures,
    onChange: e => setSelectedProcedures(e.value),
    placeholder: "Seleccione procedimientos",
    display: "chip",
    filter: true,
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "especialistas"
  }, "Especialistas"), /*#__PURE__*/React.createElement(MultiSelect, {
    id: "especialistas",
    value: selectedSpecialists,
    options: specialists,
    onChange: e => setSelectedSpecialists(e.value),
    placeholder: "Seleccione especialistas",
    display: "chip",
    filter: true,
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "patients"
  }, "Pacientes"), /*#__PURE__*/React.createElement(MultiSelect, {
    id: "patients",
    value: selectedPatients,
    options: patients,
    onChange: e => setSelectedPatients(e.value),
    placeholder: "Seleccione pacientes",
    display: "chip",
    filter: true,
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "fechasProcedimiento"
  }, "Fecha inicio - fin Procedimiento"), /*#__PURE__*/React.createElement(Calendar, {
    id: "fechasProcedimiento",
    value: dateRange,
    onChange: e => setDateRange(e.value),
    selectionMode: "range",
    readOnlyInput: true,
    dateFormat: "dd/mm/yy",
    placeholder: "dd/mm/yyyy - dd/mm/yyyy",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "entity"
  }, "Entidad"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "entity",
    value: selectedEntity,
    options: entities,
    onChange: e => setSelectedEntity(e.value),
    placeholder: "Seleccione entidad",
    filter: true,
    className: "w-100"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end m-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Filtrar",
    icon: "pi pi-filter",
    onClick: handleFilter,
    className: "p-button-primary"
  })))))))))))), /*#__PURE__*/React.createElement("div", {
    className: "row gy-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-xxl-12"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "nav nav-underline fs-9",
    id: "myTab",
    role: "tablist"
  }, /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: `nav-link ${activeTab === "doctors-tab" ? "active" : ""}`,
    id: "doctors-tab",
    onClick: () => handleTabChange("doctors-tab"),
    role: "tab"
  }, "Procedimientos")), /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: `nav-link ${activeTab === "precios-entidad-tab" ? "active" : ""}`,
    id: "precios-entidad-tab",
    onClick: () => handleTabChange("precios-entidad-tab"),
    role: "tab"
  }, "Entidades")), /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: `nav-link ${activeTab === "conteo-entidad-tab" ? "active" : ""}`,
    id: "conteo-entidad-tab",
    onClick: () => handleTabChange("conteo-entidad-tab"),
    role: "tab"
  }, "Precios - conteo")), /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: `nav-link ${activeTab === "consultas-tab" ? "active" : ""}`,
    id: "consultas-tab",
    onClick: () => handleTabChange("consultas-tab"),
    role: "tab"
  }, "Consultas"))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-xxl-12 tab-content mt-3",
    id: "myTabContent"
  }, /*#__PURE__*/React.createElement("div", {
    className: `tab-pane fade ${activeTab === "doctors-tab" ? "show active" : ""}`,
    id: "tab-doctors",
    role: "tabpanel",
    "aria-labelledby": "doctors-tab"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mb-3"
  }, /*#__PURE__*/React.createElement(ExportButtonExcel, {
    onClick: handleExportProcedures,
    loading: exporting.procedures,
    disabled: !reportData || reportData.length === 0
  }), /*#__PURE__*/React.createElement(ExportButtonPDF, {
    onClick: () => exportToPDF("doctors-tab"),
    loading: exporting.procedures,
    disabled: !reportData || reportData.length === 0
  })), generateDoctorsTable()), /*#__PURE__*/React.createElement("div", {
    className: `tab-pane fade ${activeTab === "precios-entidad-tab" ? "show active" : ""}`,
    id: "tab-precios-entidad",
    role: "tabpanel",
    "aria-labelledby": "precios-entidad-tab"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mb-3"
  }, /*#__PURE__*/React.createElement(ExportButtonExcel, {
    onClick: handleExportEntityPrices,
    loading: exporting.entityPrices,
    disabled: !reportData || reportData.length === 0 || !reportData.some(item => item.insurance)
  }), /*#__PURE__*/React.createElement(ExportButtonPDF, {
    onClick: () => exportToPDF("entities-tab"),
    loading: exporting.procedures,
    disabled: !reportData || reportData.length === 0
  })), generateEntityPricesTable()), /*#__PURE__*/React.createElement("div", {
    className: `tab-pane fade ${activeTab === "conteo-entidad-tab" ? "show active" : ""}`,
    id: "tab-conteo-entidad",
    role: "tabpanel",
    "aria-labelledby": "conteo-entidad-tab"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mb-3"
  }, /*#__PURE__*/React.createElement(ExportButtonExcel, {
    onClick: handleExportEntityCounts,
    loading: exporting.entityCounts,
    disabled: !reportData || reportData.length === 0 || !reportData.some(item => item.insurance)
  }), /*#__PURE__*/React.createElement(ExportButtonPDF, {
    onClick: () => exportToPDF("prices-tab"),
    loading: exporting.procedures,
    disabled: !reportData || reportData.length === 0
  })), generateEntityCountTable()), /*#__PURE__*/React.createElement("div", {
    className: `tab-pane fade ${activeTab === "consultas-tab" ? "show active" : ""}`,
    id: "tab-consultas",
    role: "tabpanel",
    "aria-labelledby": "consultas-tab"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mb-3"
  }, /*#__PURE__*/React.createElement(ExportButtonExcel, {
    onClick: handleExportConsultations,
    loading: exporting.consultations,
    disabled: !reportData || reportData.length === 0
  }), /*#__PURE__*/React.createElement(ExportButtonPDF, {
    onClick: () => exportToPDF("consultation-tab"),
    loading: exporting.procedures,
    disabled: !reportData || reportData.length === 0
  })), generateConsultationsTable()))))))));
};
const ExportButtonExcel = ({
  onClick,
  loading,
  disabled
}) => {
  return /*#__PURE__*/React.createElement(Button, {
    tooltip: "Exportar a excel",
    tooltipOptions: {
      position: "top"
    },
    onClick: onClick,
    className: "p-button-success",
    disabled: disabled || loading
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-excel"
  }));
};
const ExportButtonPDF = ({
  onClick,
  loading,
  disabled
}) => {
  return /*#__PURE__*/React.createElement(Button, {
    tooltip: "Exportar a PDF",
    tooltipOptions: {
      position: "top"
    },
    onClick: onClick,
    className: "p-button-secondary",
    disabled: disabled || loading
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-pdf"
  }));
};