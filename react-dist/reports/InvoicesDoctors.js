import React, { useState, useEffect } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { TreeTable } from "primereact/treetable";
import { exportDoctorsProceduresToExcel, exportEntityPricesToExcel, exportEntityCountsToExcel, exportConsultationsToExcel } from "./excel/ExcelSpecialist.js"; // Import your services
import { productService, userService, patientService, billingService, entityService } from "../../services/api/index.js";
import { generatePDFFromHTML } from "../../funciones/funcionesJS/exportPDF.js";
import { useCompany } from "../hooks/useCompany.js";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
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
  const [selectedEntity, setSelectedEntity] = useState([]);
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
  const [treeNodes, setTreeNodes] = useState([]);
  const [keys, setKeys] = useState({});

  // Pagination state
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  // Export loading states
  const [exporting, setExporting] = useState({
    procedures: false,
    proceduresCount: false,
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
          user_ids: []
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
  useEffect(() => {
    if (activeTab === "productivity-tab" && reportData.length > 0) {
      const newTreeNodes = reportData.map((user, userIndex) => {
        console.log("user", user);
        let countAppointments = user.appointments.length;
        let countProceduresInvoiced = 0;
        const fullName = `${user.first_name ?? ""} ${user.middle_name ?? ""} ${user.last_name ?? ""} ${user.second_name ?? ""}`;
        const children = user.appointments.map((appointment, appointmentIndex) => {
          let status = "unInvoiced";
          if (appointment.admission && appointment.admission.invoice && appointment?.admission?.invoice?.status !== "cancelled") {
            countProceduresInvoiced++;
            status = "invoiced";
          }
          return {
            key: `${userIndex}-${appointmentIndex}`,
            data: {
              doctor: "",
              date: appointment.appointment_date,
              countAppointments: appointment.exam_recipe.details.map(detail => detail.exam_type.name).join(", "),
              counrProceduresInvoiced: appointment?.admission?.invoice?.details.map(detail => detail.product.name).join(", ") ?? "Sin factura",
              average: status,
              isLeaf: true
            }
          };
        });
        return {
          key: userIndex.toString(),
          data: {
            doctor: fullName,
            date: "",
            countAppointments: countAppointments,
            counrProceduresInvoiced: countProceduresInvoiced,
            average: (countProceduresInvoiced / countAppointments * 100).toFixed(2) + "%",
            isLeaf: false,
            rawData: user.appointments
          },
          children: children
        };
      });
      setTreeNodes(newTreeNodes);
      setKeys(treeNodes.reduce((acc, node) => {
        acc[node.key] = true;
        return acc;
      }, {}));
    }
  }, [reportData, activeTab]);
  const loadData = async (filterParams = {}, tab = "") => {
    let data = [];
    try {
      setTableLoading(true);
      if (tab == "productivity-tab") {
        data = await billingService.productivityByDoctor(filterParams);
      } else {
        data = await billingService.getBillingReport(filterParams);
      }
      console.log("data", data);
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
    setReportData([]);
    try {
      setActiveTab(tab);
      const filterParams = {
        end_date: dateRange[1] ? formatDate(dateRange[1]) : "",
        start_date: dateRange[0] ? formatDate(dateRange[0]) : ""
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
        start_date: dateRange[0] ? formatDate(dateRange[0]) : ""
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
        const entityAmount = parseFloat(entry.entity_authorized_amount) || 0;
        procedureSet.add(procedureName);
        if (!procedureDoctorTotals[procedureName]) {
          procedureDoctorTotals[procedureName] = {};
        }
        if (!procedureDoctorTotals[procedureName][doctor]) {
          procedureDoctorTotals[procedureName][doctor] = {
            count: 0,
            amount: 0,
            avg: 0
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
    const doctorTotals = {};
    Array.from(doctors).forEach(doctor => {
      doctorTotals[doctor] = {
        count: 0,
        amount: 0,
        avg: 0,
        total: 0
      };
      Array.from(procedureSet).forEach(proc => {
        const doctorData = procedureDoctorTotals[proc]?.[doctor] || {
          count: 0,
          amount: 0,
          avg: 0
        };
        doctorTotals[doctor].count += doctorData.count;
        doctorTotals[doctor].amount += doctorData.amount;
        doctorTotals[doctor].avg += doctorData.avg;
        doctorTotals[doctor].total += doctorData.amount;
      });
    });

    // Prepare table data
    const tableData = Array.from(procedureSet).map(proc => {
      const row = {
        procedure: proc
      };
      let rowTotal = 0;
      Array.from(doctors).forEach(doctor => {
        const doctorData = procedureDoctorTotals[proc]?.[doctor] || {
          count: 0,
          amount: 0,
          avg: 0
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
    const totalsRow = {
      procedure: "TOTALES",
      isTotal: true,
      style: {
        fontWeight: "bold",
        backgroundColor: "#f8f9fa"
      }
    };
    Array.from(doctors).forEach(doctor => {
      totalsRow[`${doctor}_count`] = doctorTotals[doctor].count;
      totalsRow[`${doctor}_amount`] = doctorTotals[doctor].amount;
      totalsRow[`${doctor}_avg`] = doctorTotals[doctor].avg;
    });
    totalsRow["total"] = Array.from(doctors).reduce((sum, doctor) => sum + doctorTotals[doctor].total, 0);

    // Add totals row to table data only for display (not when returning data)
    const displayData = isReturnData ? tableData : [...tableData, totalsRow];
    if (isReturnData) {
      return tableData;
    }

    // Create columns for the table
    const procedureColumns = [{
      field: "procedure",
      header: "Procedimiento",
      style: createColumnStyle("left", "200px"),
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal ? "bold" : "normal",
          fontSize: rowData.isTotal ? "1.1em" : "inherit",
          ...rowData.style
        }
      }, rowData.procedure)
    }, ...Array.from(doctors).flatMap(doctor => [{
      field: `${doctor}_count`,
      header: "Copago",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal ? "bold" : "normal",
          fontSize: rowData.isTotal ? "1.1em" : "inherit"
        }
      }, rowData[`${doctor}_count`] ? formatCurrency(rowData[`${doctor}_count`]) : "-"),
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right")
    }, {
      field: `${doctor}_amount`,
      header: "Particular",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal ? "bold" : "normal",
          fontSize: rowData.isTotal ? "1.1em" : "inherit"
        }
      }, rowData[`${doctor}_amount`] ? formatCurrency(rowData[`${doctor}_amount`]) : "-"),
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right")
    }, {
      field: `${doctor}_avg`,
      header: "Seguro",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal ? "bold" : "normal",
          fontSize: rowData.isTotal ? "1.1em" : "inherit"
        }
      }, rowData[`${doctor}_avg`] ? formatCurrency(rowData[`${doctor}_avg`]) : "-"),
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right")
    }]), {
      field: "total",
      header: "Total General",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal ? "bold" : "normal",
          fontSize: rowData.isTotal ? "1.1em" : "inherit"
        }
      }, formatCurrency(rowData.total)),
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right")
    }];

    // Create header group
    const headerGroup = /*#__PURE__*/React.createElement(ColumnGroup, null, /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Column, {
      header: "Procedimiento",
      rowSpan: 2
    }), Array.from(doctors).map(doctor => /*#__PURE__*/React.createElement(Column, {
      key: doctor,
      header: doctor,
      colSpan: 3
    })), /*#__PURE__*/React.createElement(Column, {
      header: "Total General",
      rowSpan: 2
    })), /*#__PURE__*/React.createElement(Row, null, Array.from(doctors).flatMap(doctor => [/*#__PURE__*/React.createElement(Column, {
      key: `${doctor}_count`,
      header: "Copago"
    }), /*#__PURE__*/React.createElement(Column, {
      key: `${doctor}_amount`,
      header: "Particular"
    }), /*#__PURE__*/React.createElement(Column, {
      key: `${doctor}_avg`,
      header: "Seguro"
    })])));
    return /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, tableLoading ? /*#__PURE__*/React.createElement("div", {
      className: "flex justify-content-center align-items-center",
      style: {
        height: "200px",
        marginLeft: "800px"
      }
    }, /*#__PURE__*/React.createElement(ProgressSpinner, null)) : /*#__PURE__*/React.createElement(DataTable, {
      headerColumnGroup: headerGroup,
      value: displayData,
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
    }, procedureColumns.map((col, i) => {
      return /*#__PURE__*/React.createElement(Column, {
        key: i,
        field: col.field,
        header: col.header,
        body: col.body,
        style: col.style,
        headerStyle: col.headerStyle
      });
    })));
  };
  const generateDoctorsCountTable = (isReturnData = false) => {
    if (!reportData || reportData.length === 0) {
      return /*#__PURE__*/React.createElement("div", {
        className: "flex justify-content-center align-items-center",
        style: {
          height: "200px"
        }
      }, /*#__PURE__*/React.createElement("span", null, "No hay datos disponibles"));
    }

    // Process data and group by procedure and doctor
    const procedureDoctorCounts = {};
    const doctors = new Set();
    const procedureSet = new Set();
    reportData.forEach(entry => {
      const doctor = entry.billing_doctor;
      doctors.add(doctor);
      entry.billed_procedure?.forEach(proc => {
        const procedureName = proc.product?.name;
        procedureSet.add(procedureName);
        if (!procedureDoctorCounts[procedureName]) {
          procedureDoctorCounts[procedureName] = {};
        }
        if (!procedureDoctorCounts[procedureName][doctor]) {
          procedureDoctorCounts[procedureName][doctor] = {
            amount: 0,
            avg: 0
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
    const doctorTotals = {};
    Array.from(doctors).forEach(doctor => {
      doctorTotals[doctor] = {
        amount: 0,
        avg: 0,
        total: 0
      };
      Array.from(procedureSet).forEach(proc => {
        const doctorData = procedureDoctorCounts[proc]?.[doctor] || {
          count: 0,
          amount: 0,
          avg: 0
        };
        doctorTotals[doctor].amount += doctorData.amount;
        doctorTotals[doctor].avg += doctorData.avg;
        doctorTotals[doctor].total += doctorData.amount; // Sum counts for total
      });
    });

    // Prepare table data
    const tableData = Array.from(procedureSet).map(proc => {
      const row = {
        procedure: proc
      };
      let rowTotal = 0;
      Array.from(doctors).forEach(doctor => {
        const doctorData = procedureDoctorCounts[proc]?.[doctor] || {
          count: 0,
          amount: 0,
          avg: 0
        };
        row[`${doctor}_amount`] = doctorData.amount;
        row[`${doctor}_avg`] = doctorData.avg;
        rowTotal += doctorData.amount; // Sum counts for row total
      });
      row["total"] = rowTotal;
      return row;
    });

    // Add totals row
    const totalsRow = {
      procedure: "TOTALES",
      isTotal: true,
      style: {
        fontWeight: "bold",
        backgroundColor: "#f8f9fa"
      }
    };
    Array.from(doctors).forEach(doctor => {
      totalsRow[`${doctor}_amount`] = doctorTotals[doctor].amount;
      totalsRow[`${doctor}_avg`] = doctorTotals[doctor].avg;
    });
    totalsRow["total"] = Array.from(doctors).reduce((sum, doctor) => sum + doctorTotals[doctor].total, 0);
    const displayData = isReturnData ? tableData : [...tableData, totalsRow];
    if (isReturnData) {
      return tableData;
    }

    // Create columns for the table
    const procedureColumns = [{
      field: "procedure",
      header: "Procedimiento",
      style: createColumnStyle("left", "200px"),
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal ? "bold" : "normal",
          fontSize: rowData.isTotal ? "1.1em" : "inherit",
          ...rowData.style
        }
      }, rowData.procedure)
    }, ...Array.from(doctors).flatMap(doctor => [{
      field: `${doctor}_amount`,
      header: "Particular",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal ? "bold" : "normal",
          fontSize: rowData.isTotal ? "1.1em" : "inherit"
        }
      }, rowData[`${doctor}_amount`] || "0"),
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right")
    }, {
      field: `${doctor}_avg`,
      header: "Seguro",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal ? "bold" : "normal",
          fontSize: rowData.isTotal ? "1.1em" : "inherit"
        }
      }, rowData[`${doctor}_avg`] || "0"),
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right")
    }]), {
      field: "total",
      header: "Total General",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal ? "bold" : "normal",
          fontSize: rowData.isTotal ? "1.1em" : "inherit"
        }
      }, rowData.total),
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right")
    }];

    // Create header group (same as generateDoctorsTable)
    const headerGroup = /*#__PURE__*/React.createElement(ColumnGroup, null, /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Column, {
      header: "Procedimiento",
      rowSpan: 2
    }), Array.from(doctors).map(doctor => /*#__PURE__*/React.createElement(Column, {
      key: doctor,
      header: doctor,
      colSpan: 2
    })), /*#__PURE__*/React.createElement(Column, {
      header: "Total General",
      rowSpan: 2
    })), /*#__PURE__*/React.createElement(Row, null, Array.from(doctors).flatMap(doctor => [/*#__PURE__*/React.createElement(Column, {
      key: `${doctor}_amount`,
      header: "Particular"
    }), /*#__PURE__*/React.createElement(Column, {
      key: `${doctor}_avg`,
      header: "Seguro"
    })])));
    return /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, tableLoading ? /*#__PURE__*/React.createElement("div", {
      className: "flex justify-content-center align-items-center",
      style: {
        height: "200px",
        marginLeft: "800px"
      }
    }, /*#__PURE__*/React.createElement(ProgressSpinner, null)) : /*#__PURE__*/React.createElement(DataTable, {
      headerColumnGroup: headerGroup,
      value: displayData,
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
    }, procedureColumns.map((col, i) => {
      return /*#__PURE__*/React.createElement(Column, {
        key: i,
        field: col.field,
        header: col.header,
        body: col.body,
        style: col.style,
        headerStyle: col.headerStyle
      });
    })));
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
    }, ...Array.from(doctors).flatMap(doctor => [{
      field: `${doctor}_amount`,
      header: "Particular",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal ? "bold" : "normal",
          fontSize: rowData.isTotal ? "1em" : "inherit"
        }
      }, rowData[doctor] || "0"),
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right")
    }, {
      field: `${doctor}_avg`,
      header: "Seguro",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal ? "bold" : "normal",
          fontSize: rowData.isTotal ? "1em" : "inherit"
        }
      }, rowData[doctor] || "0"),
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right")
    }]), {
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

    // Create header group with the new subheaders
    const headerGroup = /*#__PURE__*/React.createElement(ColumnGroup, null, /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Column, {
      header: "Entidad",
      rowSpan: 2
    }), Array.from(doctors).map(doctor => /*#__PURE__*/React.createElement(Column, {
      key: doctor,
      header: doctor,
      colSpan: 2
    })), /*#__PURE__*/React.createElement(Column, {
      header: "Total",
      rowSpan: 2
    })), /*#__PURE__*/React.createElement(Row, null, Array.from(doctors).flatMap(doctor => [/*#__PURE__*/React.createElement(Column, {
      key: `${doctor}_amount`,
      header: "Particular"
    }), /*#__PURE__*/React.createElement(Column, {
      key: `${doctor}_avg`,
      header: "Seguro"
    })])));
    return /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, tableLoading ? /*#__PURE__*/React.createElement("div", {
      className: "flex justify-content-center align-items-center",
      style: {
        height: "200px"
      }
    }, /*#__PURE__*/React.createElement(ProgressSpinner, null)) : /*#__PURE__*/React.createElement(DataTable, {
      headerColumnGroup: headerGroup,
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
        if (!doctorDateCounts[doctor][date]) {
          doctorDateCounts[doctor][date] = {
            particular: 0,
            seguro: 0
          };
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
    const dateTotals = {};
    sortedDates.forEach(date => {
      dateTotals[date] = {
        particular: 0,
        seguro: 0
      };
      Array.from(doctors).forEach(doctor => {
        const counts = doctorDateCounts[doctor]?.[date] || {
          particular: 0,
          seguro: 0
        };
        dateTotals[date].particular += counts.particular;
        dateTotals[date].seguro += counts.seguro;
      });
    });

    // Prepare table data
    const tableData = Array.from(doctors).map(doctor => {
      const row = {
        doctor
      };
      sortedDates.forEach(date => {
        const counts = doctorDateCounts[doctor]?.[date] || {
          particular: 0,
          seguro: 0
        };
        row[`${date}_particular`] = counts.particular;
        row[`${date}_seguro`] = counts.seguro;
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
      totalsRow[`${date}_particular`] = dateTotals[date].particular;
      totalsRow[`${date}_seguro`] = dateTotals[date].seguro;
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
    }, ...sortedDates.flatMap(date => [{
      field: `${date}_particular`,
      header: "Particular",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal ? "bold" : "normal",
          fontSize: rowData.isTotal ? "1em" : "inherit"
        }
      }, rowData[`${date}_particular`] || "0"),
      style: createColumnStyle("center"),
      headerStyle: createColumnStyle("center")
    }, {
      field: `${date}_seguro`,
      header: "Seguro",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal ? "bold" : "normal",
          fontSize: rowData.isTotal ? "1em" : "inherit"
        }
      }, rowData[`${date}_seguro`] || "0"),
      style: createColumnStyle("center"),
      headerStyle: createColumnStyle("center")
    }]), {
      field: "total",
      header: "Total",
      body: rowData => {
        const total = sortedDates.reduce((sum, date) => {
          return sum + (rowData[`${date}_particular`] || 0) + (rowData[`${date}_seguro`] || 0);
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

    // Create header group with the new subheaders
    const headerGroup = /*#__PURE__*/React.createElement(ColumnGroup, null, /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Column, {
      header: "Profesional",
      rowSpan: 2
    }), sortedDates.map(date => /*#__PURE__*/React.createElement(Column, {
      key: date,
      header: date,
      colSpan: 2
    })), /*#__PURE__*/React.createElement(Column, {
      header: "Total",
      rowSpan: 2
    })), /*#__PURE__*/React.createElement(Row, null, sortedDates.flatMap(date => [/*#__PURE__*/React.createElement(Column, {
      key: `${date}_particular`,
      header: "Particular"
    }), /*#__PURE__*/React.createElement(Column, {
      key: `${date}_seguro`,
      header: "Seguro"
    })])));
    return /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, tableLoading ? /*#__PURE__*/React.createElement("div", {
      className: "flex justify-content-center align-items-center",
      style: {
        height: "200px"
      }
    }, /*#__PURE__*/React.createElement(ProgressSpinner, null)) : /*#__PURE__*/React.createElement(DataTable, {
      headerColumnGroup: headerGroup,
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
  const generateTableProductivity = (isReturnData = false) => {
    console.log("reportData", reportData);
    if (!reportData || reportData.length === 0) {
      return /*#__PURE__*/React.createElement("div", {
        className: "flex justify-content-center align-items-center",
        style: {
          height: "200px"
        }
      }, /*#__PURE__*/React.createElement("span", null, "No hay datos disponibles"));
    }
    const doctorTemplate = node => /*#__PURE__*/React.createElement("strong", null, node.data.doctor);
    const ordersTemplate = node => /*#__PURE__*/React.createElement("strong", null, node.data.countAppointments);
    const datesTemplate = node => /*#__PURE__*/React.createElement("strong", null, node.data.date);
    const proceduresInvoicedTemplate = node => /*#__PURE__*/React.createElement("strong", null, node.data.counrProceduresInvoiced);
    const averageTemplate = node => node.data.isLeaf ? /*#__PURE__*/React.createElement("span", {
      style: {
        paddingLeft: "30px",
        color: node.data.average === "unInvoiced" ? "red" : "green"
      }
    }, node.data.average == "unInvoiced" ? "No facturado" : "Facturado") : /*#__PURE__*/React.createElement("strong", null, node.data.average);
    return /*#__PURE__*/React.createElement("div", {
      className: "border-top border-translucent"
    }, loading ? /*#__PURE__*/React.createElement("div", {
      className: "text-center p-5"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-spinner pi-spin",
      style: {
        fontSize: "2rem"
      }
    }), /*#__PURE__*/React.createElement("p", null, "Cargando datos...")) : /*#__PURE__*/React.createElement("div", {
      id: "purchasersSellersTable"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, /*#__PURE__*/React.createElement(TreeTable, {
      value: treeNodes,
      expandedKeys: keys,
      loading: tableLoading,
      onToggle: e => setKeys(e.value),
      scrollable: true,
      scrollHeight: "600px"
    }, /*#__PURE__*/React.createElement(Column, {
      field: "profesional",
      header: "Profesional",
      body: doctorTemplate,
      expander: true
    }), /*#__PURE__*/React.createElement(Column, {
      field: "date",
      header: "Fecha cita",
      body: datesTemplate
    }), /*#__PURE__*/React.createElement(Column, {
      field: "countAppointments",
      header: "Ordenes",
      body: ordersTemplate
    }), /*#__PURE__*/React.createElement(Column, {
      field: "proceduresInvoiced",
      header: "servicios facturados",
      body: proceduresInvoicedTemplate
    }), /*#__PURE__*/React.createElement(Column, {
      field: "average",
      header: "Productividad %",
      body: averageTemplate
    }))), /*#__PURE__*/React.createElement("div", {
      className: "row align-items-center justify-content-between pe-0 fs-9 mt-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-auto d-flex"
    }, /*#__PURE__*/React.createElement("p", {
      className: "mb-0 d-none d-sm-block me-3 fw-semibold text-body"
    }, "Mostrando ", treeNodes.length, " Productividad")))));
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
  }, "Procedimientos $")), /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: `nav-link ${activeTab === "doctors-count-tab" ? "active" : ""}`,
    id: "doctors-count-tab",
    onClick: () => handleTabChange("doctors-count-tab"),
    role: "tab"
  }, "Procedimientos #")), /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: `nav-link ${activeTab === "precios-entidad-tab" ? "active" : ""}`,
    id: "precios-entidad-tab",
    onClick: () => handleTabChange("precios-entidad-tab"),
    role: "tab"
  }, "Entidades $")), /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: `nav-link ${activeTab === "conteo-entidad-tab" ? "active" : ""}`,
    id: "conteo-entidad-tab",
    onClick: () => handleTabChange("conteo-entidad-tab"),
    role: "tab"
  }, "Entidades #")), /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: `nav-link ${activeTab === "consultas-tab" ? "active" : ""}`,
    id: "consultas-tab",
    onClick: () => handleTabChange("consultas-tab"),
    role: "tab"
  }, "Consultas")), /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: `nav-link ${activeTab === "productivity-tab" ? "active" : ""}`,
    id: "productivity-tab",
    onClick: () => handleTabChange("productivity-tab"),
    role: "tab"
  }, "Productividad"))), /*#__PURE__*/React.createElement("div", {
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
    className: `tab-pane fade ${activeTab === "doctors-count-tab" ? "show active" : ""}`,
    id: "tab-doctors-count",
    role: "tabpanel",
    "aria-labelledby": "doctors-count-tab"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mb-3"
  }, /*#__PURE__*/React.createElement(ExportButtonExcel, {
    onClick: handleExportProceduresCount,
    loading: exporting.proceduresCount,
    disabled: !reportData || reportData.length === 0
  }), /*#__PURE__*/React.createElement(ExportButtonPDF, {
    onClick: () => exportToPDF("doctors-count-tab"),
    loading: exporting.proceduresCount,
    disabled: !reportData || reportData.length === 0
  })), generateDoctorsCountTable()), /*#__PURE__*/React.createElement("div", {
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
  })), generateConsultationsTable()), /*#__PURE__*/React.createElement("div", {
    className: `tab-pane fade ${activeTab === "productivity-tab" ? "show active" : ""}`,
    id: "tab-productivity",
    role: "tabpanel",
    "aria-labelledby": "productivity-tab"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mb-3"
  }, /*#__PURE__*/React.createElement(ExportButtonExcel, {
    onClick: handleExportConsultations,
    loading: exporting.consultations,
    disabled: !reportData || reportData.length === 0
  }), /*#__PURE__*/React.createElement(ExportButtonPDF, {
    onClick: () => exportToPDF("productivity-tab"),
    loading: exporting.procedures,
    disabled: !reportData || reportData.length === 0
  })), generateTableProductivity()))))))));
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