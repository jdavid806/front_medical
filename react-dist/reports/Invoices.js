import React, { useState, useEffect } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { generatePDFFromHTML } from "../../funciones/funcionesJS/exportPDF.js";
import { useCompany } from "../hooks/useCompany.js"; // Import your services
import { productService, userService, patientService, billingService, entityService } from "../../services/api/index.js";
import { exportProceduresToExcel, exportEntitiesToExcel, exportPaymentsToExcel } from "./excel/ExcelInvoices.js";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
export const InvoicesReport = () => {
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

  // State for report data
  const [reportData, setReportData] = useState([]);
  const [activeTab, setActiveTab] = useState("procedures-tab");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const {
    company,
    setCompany,
    fetchCompany
  } = useCompany();

  // Pagination state
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [exporting, setExporting] = useState({
    procedures: false,
    entities: false,
    payments: false
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
      await exportProceduresToExcel(reportData);
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
  function exportToProceduresPDF(tab = "") {
    let dataExport = [];
    let namePDF = "";
    switch (tab) {
      case "procedures-tab":
        dataExport = generateProceduresTable(true);
        namePDF = "Procedimientos";
        break;
      case "entities-tab":
        dataExport = generateEntitiesTable(true);
        namePDF = "Entidades";
        break;
      case "payments-methods-tab":
        dataExport = generatePaymentsTable(true);
        namePDF = "Metodos_de_pago";
        break;
    }
    const headers = dataExport[0];
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
              ${Object.keys(headers).map(header => `<th>${header}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${dataExport.reduce((acc, child) => acc + `
              <tr>
                ${Object.keys(headers).map(header => `<td>${child[header]}</td>`).join("")}
              </tr>
            `, "")}
          </tbody>
        </table>`;
    const configPDF = {
      name: namePDF
    };
    generatePDFFromHTML(table, company, configPDF);
  }
  const handleExportEntities = async () => {
    try {
      setExporting({
        ...exporting,
        entities: true
      });
      await exportEntitiesToExcel(reportData);
    } catch (error) {
      console.error("Error exporting entities:", error);
      alert(error.message);
    } finally {
      setExporting({
        ...exporting,
        entities: false
      });
    }
  };
  const handleExportPayments = async () => {
    try {
      setExporting({
        ...exporting,
        payments: true
      });
      await exportPaymentsToExcel(reportData);
    } catch (error) {
      console.error("Error exporting payments:", error);
      alert(error.message);
    } finally {
      setExporting({
        ...exporting,
        payments: false
      });
    }
  };
  const formatDate = date => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const generateProceduresTable = (returnData = false) => {
    if (!reportData || reportData.length === 0) {
      return /*#__PURE__*/React.createElement("div", {
        className: "flex justify-content-center align-items-center",
        style: {
          height: "200px"
        }
      }, /*#__PURE__*/React.createElement("span", null, "No hay datos disponibles"));
    }
    const users = [...new Set(reportData.map(item => item.billing_user))];
    const procedures = [...new Set(reportData.flatMap(item => item.billed_procedure?.map(p => p.product.name) || []))];

    // Procesar datos para tener 3 métricas por usuario
    const tableRows = procedures.map(proc => {
      const row = {
        procedimiento: proc
      };
      let rowTotal = 0;
      users.forEach(user => {
        // Primera métrica: Cantidad
        const count = reportData.filter(item => item.billing_user === user).flatMap(item => item).filter(item => item.sub_type == "entity" && item.billed_procedure.some(p => p.product.name === proc)).reduce((sum, i) => sum + parseFloat(i.billed_procedure.filter(p => p.product.name === proc)[0]?.amount ?? 0), 0);

        // Segunda métrica: Monto total
        const amount = reportData.filter(item => item.billing_user === user).flatMap(item => item).filter(item => item.sub_type == "public" && item.billed_procedure.some(p => p.product.name === proc)).reduce((sum, i) => sum + parseFloat(i.billed_procedure.filter(p => p.product.name === proc)[0]?.amount ?? 0), 0);

        // Tercera métrica: Promedio
        const average = reportData.filter(item => item.billing_user === user).flatMap(item => item).filter(item => item.billed_procedure.some(p => p.product.name === proc)).reduce((sum, p) => sum + parseFloat(p.entity_authorized_amount), 0);
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
      style: {
        fontWeight: "bold",
        backgroundColor: "#f8f9fa"
      }
    };
    users.forEach(user => {
      footerData[`${user}_count`] = tableRows.reduce((sum, row) => sum + (row[`${user}_count`] || 0), 0);
      footerData[`${user}_amount`] = tableRows.reduce((sum, row) => sum + (row[`${user}_amount`] || 0), 0);
      footerData[`${user}_avg`] = tableRows.reduce((sum, row) => sum + (row[`${user}_avg`] || 0), 0);
    });
    footerData["total"] = tableRows.reduce((sum, row) => sum + (row.total || 0), 0);
    if (returnData) {
      return [...tableRows, footerData];
    }

    // Crear columnas para la tabla
    const procedureColumns = [{
      field: "procedimiento",
      header: "Procedimiento",
      style: createColumnStyle("left", "200px"),
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal || rowData.isFooter ? "bold" : "normal",
          fontSize: rowData.isTotal || rowData.isFooter ? "1.1em" : "inherit"
        }
      }, rowData.procedimiento),
      footer: "TOTALES",
      footerStyle: {
        fontWeight: "bold",
        textAlign: "left"
      }
    }, ...users.flatMap(user => [{
      field: `${user}_count`,
      header: "Copago",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal || rowData.isFooter ? "bold" : "normal",
          fontSize: rowData.isTotal || rowData.isFooter ? "1.1em" : "inherit"
        }
      }, rowData[`${user}_count`] || "-"),
      footer: () => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: "bold"
        }
      }, footerData[`${user}_count`]),
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right"),
      footerStyle: {
        fontWeight: "bold",
        textAlign: "right"
      }
    }, {
      field: `${user}_amount`,
      header: "Particular",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal || rowData.isFooter ? "bold" : "normal",
          fontSize: rowData.isTotal || rowData.isFooter ? "1.1em" : "inherit"
        }
      }, rowData[`${user}_amount`] ? formatCurrency(rowData[`${user}_amount`]) : "-"),
      footer: () => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: "bold"
        }
      }, formatCurrency(footerData[`${user}_amount`])),
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right"),
      footerStyle: {
        fontWeight: "bold",
        textAlign: "right"
      }
    }, {
      field: `${user}_avg`,
      header: "Monto autorizado",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal || rowData.isFooter ? "bold" : "normal",
          fontSize: rowData.isTotal || rowData.isFooter ? "1.1em" : "inherit"
        }
      }, rowData[`${user}_avg`] ? formatCurrency(rowData[`${user}_avg`]) : "-"),
      footer: () => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: "bold"
        }
      }, formatCurrency(footerData[`${user}_avg`])),
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right"),
      footerStyle: {
        fontWeight: "bold",
        textAlign: "right"
      }
    }]), {
      field: "total",
      header: "Total General",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal || rowData.isFooter ? "bold" : "normal",
          fontSize: rowData.isTotal || rowData.isFooter ? "1.1em" : "inherit"
        }
      }, formatCurrency(rowData.total)),
      footer: () => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: "bold"
        }
      }, formatCurrency(footerData.total)),
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right"),
      footerStyle: {
        fontWeight: "bold",
        textAlign: "right"
      }
    }];

    // Crear grupo de encabezados
    const headerGroup = /*#__PURE__*/React.createElement(ColumnGroup, null, /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Column, {
      header: "Procedimiento",
      rowSpan: 2
    }), users.map(user => /*#__PURE__*/React.createElement(Column, {
      key: user,
      header: user,
      colSpan: 3
    })), /*#__PURE__*/React.createElement(Column, {
      header: "Total General",
      rowSpan: 2
    })), /*#__PURE__*/React.createElement(Row, null, users.flatMap(user => [/*#__PURE__*/React.createElement(Column, {
      key: `${user}_count`,
      header: "Copago"
    }), /*#__PURE__*/React.createElement(Column, {
      key: `${user}_amount`,
      header: "Particular"
    }), /*#__PURE__*/React.createElement(Column, {
      key: `${user}_avg`,
      header: "Monto autorizado"
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
      value: tableRows,
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
      currentPageReportTemplate: "Mostrando {first} a {last} de {totalRecords} registros",
      footerColumnGroup: /*#__PURE__*/React.createElement(ColumnGroup, null, /*#__PURE__*/React.createElement(Row, null, procedureColumns.map((col, index) => /*#__PURE__*/React.createElement(Column, {
        key: `footer-${index}`,
        footer: col.footer,
        footerStyle: col.footerStyle
      }))))
    }, procedureColumns.map((col, i) => {
      return /*#__PURE__*/React.createElement(Column, {
        key: i,
        field: col.field,
        header: col.header,
        body: col.body,
        style: col.style,
        headerStyle: col.headerStyle,
        footer: col.footer,
        footerStyle: col.footerStyle
      });
    })));
  };
  const generateProceduresCountTable = (returnData = false) => {
    if (!reportData || reportData.length === 0) {
      return /*#__PURE__*/React.createElement("div", {
        className: "flex justify-content-center align-items-center",
        style: {
          height: "200px"
        }
      }, /*#__PURE__*/React.createElement("span", null, "No hay datos disponibles"));
    }
    const users = [...new Set(reportData.map(item => item.billing_user))];
    const procedures = [...new Set(reportData.flatMap(item => item.billed_procedure?.map(p => p.product.name) || []))];

    // Procesar datos para conteos
    const tableRows = procedures.map(proc => {
      const row = {
        procedimiento: proc
      };
      let rowTotal = 0;
      users.forEach(user => {
        // Conteo para Particular
        const countParticular = reportData.filter(item => item.billing_user === user).flatMap(item => item).filter(item => item.sub_type == "public" && item.billed_procedure.some(p => p.product.name === proc)).length;

        // Conteo para Monto Autorizado
        const countAutorizado = reportData.filter(item => item.billing_user === user).flatMap(item => item).filter(item => item.billed_procedure.some(p => p.product.name === proc)).length;
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
      style: {
        fontWeight: "bold",
        backgroundColor: "#f8f9fa"
      }
    };
    users.forEach(user => {
      footerData[`${user}_particular`] = tableRows.reduce((sum, row) => sum + (row[`${user}_particular`] || 0), 0);
      footerData[`${user}_autorizado`] = tableRows.reduce((sum, row) => sum + (row[`${user}_autorizado`] || 0), 0);
    });
    footerData["total"] = tableRows.reduce((sum, row) => sum + (row.total || 0), 0);
    if (returnData) {
      return [...tableRows, footerData];
    }

    // Crear columnas para la tabla
    const procedureColumns = [{
      field: "procedimiento",
      header: "Procedimiento",
      style: createColumnStyle("left", "200px"),
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal || rowData.isFooter ? "bold" : "normal",
          fontSize: rowData.isTotal || rowData.isFooter ? "1.1em" : "inherit"
        }
      }, rowData.procedimiento),
      footer: "TOTALES",
      footerStyle: {
        fontWeight: "bold",
        textAlign: "left"
      }
    }, ...users.flatMap(user => [{
      field: `${user}_particular`,
      header: "Particular",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal || rowData.isFooter ? "bold" : "normal",
          fontSize: rowData.isTotal || rowData.isFooter ? "1.1em" : "inherit"
        }
      }, rowData[`${user}_particular`] || "-"),
      footer: () => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: "bold"
        }
      }, footerData[`${user}_particular`]),
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right"),
      footerStyle: {
        fontWeight: "bold",
        textAlign: "right"
      }
    }, {
      field: `${user}_autorizado`,
      header: "Monto autorizado",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal || rowData.isFooter ? "bold" : "normal",
          fontSize: rowData.isTotal || rowData.isFooter ? "1.1em" : "inherit"
        }
      }, rowData[`${user}_autorizado`] || "-"),
      footer: () => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: "bold"
        }
      }, footerData[`${user}_autorizado`]),
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right"),
      footerStyle: {
        fontWeight: "bold",
        textAlign: "right"
      }
    }]), {
      field: "total",
      header: "Total General",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal || rowData.isFooter ? "bold" : "normal",
          fontSize: rowData.isTotal || rowData.isFooter ? "1.1em" : "inherit"
        }
      }, rowData.total),
      footer: () => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: "bold"
        }
      }, footerData.total),
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right"),
      footerStyle: {
        fontWeight: "bold",
        textAlign: "right"
      }
    }];

    // Crear grupo de encabezados
    const headerGroup = /*#__PURE__*/React.createElement(ColumnGroup, null, /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Column, {
      header: "Procedimiento",
      rowSpan: 2
    }), users.map(user => /*#__PURE__*/React.createElement(Column, {
      key: user,
      header: user,
      colSpan: 2
    })), /*#__PURE__*/React.createElement(Column, {
      header: "Total General",
      rowSpan: 2
    })), /*#__PURE__*/React.createElement(Row, null, users.flatMap(user => [/*#__PURE__*/React.createElement(Column, {
      key: `${user}_particular`,
      header: "Particular"
    }), /*#__PURE__*/React.createElement(Column, {
      key: `${user}_autorizado`,
      header: "Monto autorizado"
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
      value: tableRows,
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
      currentPageReportTemplate: "Mostrando {first} a {last} de {totalRecords} registros",
      footerColumnGroup: /*#__PURE__*/React.createElement(ColumnGroup, null, /*#__PURE__*/React.createElement(Row, null, procedureColumns.map((col, index) => /*#__PURE__*/React.createElement(Column, {
        key: `footer-${index}`,
        footer: col.footer,
        footerStyle: col.footerStyle
      }))))
    }, procedureColumns.map((col, i) => {
      return /*#__PURE__*/React.createElement(Column, {
        key: i,
        field: col.field,
        header: col.header,
        body: col.body,
        style: col.style,
        headerStyle: col.headerStyle,
        footer: col.footer,
        footerStyle: col.footerStyle
      });
    })));
  };
  const generateEntitiesTable = (isReturnData = false) => {
    if (!reportData || reportData.length === 0 || !reportData.some(item => item.insurance)) {
      return /*#__PURE__*/React.createElement("div", {
        className: "flex justify-content-center align-items-center",
        style: {
          height: "200px"
        }
      }, /*#__PURE__*/React.createElement("span", null, "No hay datos disponibles"));
    }
    const filteredData = reportData.filter(item => item.insurance);
    const entities = new Set();
    const billingUsers = new Set();

    // Objeto para agrupar por tipo (copago o autorizado)
    const groupedData = {};
    const totals = {};
    filteredData.forEach(entry => {
      const {
        billing_user,
        insurance,
        billed_procedure,
        sub_type
      } = entry;
      const insuranceName = insurance?.name;
      entities.add(insuranceName);
      billingUsers.add(billing_user);
      if (!groupedData[insuranceName]) {
        groupedData[insuranceName] = {};
      }
      if (!groupedData[insuranceName][billing_user]) {
        groupedData[insuranceName][billing_user] = {
          copago: 0,
          autorizado: 0
        };
      }
      if (!totals[billing_user]) {
        totals[billing_user] = {
          copago: 0,
          autorizado: 0
        };
      }
      billed_procedure?.forEach(proc => {
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
    const tableData = Array.from(entities).map(entity => {
      const row = {
        entity
      };
      let rowTotalCopago = 0;
      let rowTotalAutorizado = 0;
      Array.from(billingUsers).forEach(user => {
        row[`${user}_copago`] = groupedData[entity][user].copago || 0;
        row[`${user}_autorizado`] = groupedData[entity][user].autorizado || 0;
        rowTotalCopago += row[`${user}_copago`];
        rowTotalAutorizado += row[`${user}_autorizado`];
      });
      row["total_copago"] = rowTotalCopago;
      row["total_autorizado"] = rowTotalAutorizado;
      row["total_general"] = rowTotalCopago + rowTotalAutorizado;
      return row;
    });

    // Crear columnas para la tabla
    const entityColumns = [{
      field: "entity",
      header: "Entidad",
      style: createColumnStyle("left", "200px"),
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal ? "bold" : "normal",
          fontSize: rowData.isTotal ? "1.1em" : "inherit"
        }
      }, rowData.entity),
      footer: "TOTALES",
      footerStyle: {
        fontWeight: "bold",
        textAlign: "left"
      }
    }, ...Array.from(billingUsers).flatMap(user => [{
      field: `${user}_copago`,
      header: "Copago",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal ? "bold" : "normal"
        }
      }, formatCurrency(rowData[`${user}_copago`])),
      footer: () => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: "bold"
        }
      }, formatCurrency(totals[user].copago)),
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right"),
      footerStyle: {
        fontWeight: "bold",
        textAlign: "right"
      }
    }, {
      field: `${user}_autorizado`,
      header: "Monto autorizado",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal ? "bold" : "normal"
        }
      }, formatCurrency(rowData[`${user}_autorizado`])),
      footer: () => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: "bold"
        }
      }, formatCurrency(totals[user].autorizado)),
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right"),
      footerStyle: {
        fontWeight: "bold",
        textAlign: "right"
      }
    }]), {
      field: "total_general",
      header: "Total General",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: rowData.isTotal ? "bold" : "normal"
        }
      }, formatCurrency(rowData.total_general)),
      footer: () => {
        const grandTotal = Object.values(totals).reduce((acc, {
          copago,
          autorizado
        }) => acc + copago + autorizado, 0);
        return /*#__PURE__*/React.createElement("span", {
          style: {
            fontWeight: "bold"
          }
        }, formatCurrency(grandTotal));
      },
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right"),
      footerStyle: {
        fontWeight: "bold",
        textAlign: "right"
      }
    }];

    // Crear grupo de encabezados
    const headerGroup = /*#__PURE__*/React.createElement(ColumnGroup, null, /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Column, {
      header: "Entidad",
      rowSpan: 2
    }), Array.from(billingUsers).map(user => /*#__PURE__*/React.createElement(Column, {
      key: user,
      header: user,
      colSpan: 2
    })), /*#__PURE__*/React.createElement(Column, {
      header: "Total General",
      rowSpan: 2
    })), /*#__PURE__*/React.createElement(Row, null, Array.from(billingUsers).flatMap(user => [/*#__PURE__*/React.createElement(Column, {
      key: `${user}_copago`,
      header: "Copago"
    }), /*#__PURE__*/React.createElement(Column, {
      key: `${user}_autorizado`,
      header: "Monto autorizado"
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
      currentPageReportTemplate: "Mostrando {first} a {last} de {totalRecords} registros",
      footerColumnGroup: /*#__PURE__*/React.createElement(ColumnGroup, null, /*#__PURE__*/React.createElement(Row, null, entityColumns.map((col, index) => /*#__PURE__*/React.createElement(Column, {
        key: `footer-${index}`,
        footer: col.footer,
        footerStyle: col.footerStyle
      }))))
    }, entityColumns.map((col, i) => /*#__PURE__*/React.createElement(Column, {
      key: i,
      field: col.field,
      header: col.header,
      body: col.body,
      style: col.style,
      headerStyle: col.headerStyle,
      footer: col.footer,
      footerStyle: col.footerStyle
    }))));
  };
  const generatePaymentsTable = (isReturnData = false) => {
    if (!reportData || reportData.length === 0 || !reportData.some(item => item.payment_methods && item.payment_methods.length > 0)) {
      return /*#__PURE__*/React.createElement("div", {
        className: "flex justify-content-center align-items-center",
        style: {
          height: "200px"
        }
      }, /*#__PURE__*/React.createElement("span", null, "No hay datos disponibles"));
    }
    const paymentMethods = new Set();
    const billingUsers = new Set();

    // Objeto para agrupar por tipo (copago, particular o autorizado)
    const groupedData = {};
    const totals = {};
    reportData.forEach(entry => {
      const {
        billing_user,
        payment_methods,
        sub_type
      } = entry;
      billingUsers.add(billing_user);
      payment_methods?.forEach(pm => {
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
            autorizado: 0
          };
        }
        if (!totals[billing_user]) {
          totals[billing_user] = {
            copago: 0,
            particular: 0,
            autorizado: 0
          };
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
    const tableData = Array.from(paymentMethods).map(method => {
      const row = {
        method
      };
      let rowTotal = 0;
      Array.from(billingUsers).forEach(user => {
        row[`${user}_copago`] = groupedData[method][user].copago || 0;
        row[`${user}_particular`] = groupedData[method][user].particular || 0;
        row[`${user}_autorizado`] = groupedData[method][user].autorizado || 0;
        rowTotal += row[`${user}_copago`] + row[`${user}_particular`] + row[`${user}_autorizado`];
      });
      row["total"] = rowTotal;
      return row;
    });

    // Calcular total general
    const grandTotal = tableData.reduce((sum, row) => sum + (row.total || 0), 0);
    if (isReturnData) {
      return tableData;
    }

    // Crear columnas para la tabla
    const paymentColumns = [{
      field: "method",
      header: "Método de Pago",
      style: createColumnStyle("left", "200px"),
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: "normal"
        }
      }, rowData.method),
      footer: "TOTALES",
      footerStyle: {
        fontWeight: "bold",
        textAlign: "left"
      }
    }, ...Array.from(billingUsers).flatMap(user => [{
      field: `${user}_copago`,
      header: "Copago",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: "normal"
        }
      }, formatCurrency(rowData[`${user}_copago`])),
      footer: () => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: "bold"
        }
      }, formatCurrency(totals[user].copago)),
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right"),
      footerStyle: {
        fontWeight: "bold",
        textAlign: "right"
      }
    }, {
      field: `${user}_particular`,
      header: "Particular",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: "normal"
        }
      }, formatCurrency(rowData[`${user}_particular`])),
      footer: () => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: "bold"
        }
      }, formatCurrency(totals[user].particular)),
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right"),
      footerStyle: {
        fontWeight: "bold",
        textAlign: "right"
      }
    }, {
      field: `${user}_autorizado`,
      header: "Monto autorizado",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: "normal"
        }
      }, formatCurrency(rowData[`${user}_autorizado`])),
      footer: () => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: "bold"
        }
      }, formatCurrency(totals[user].autorizado)),
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right"),
      footerStyle: {
        fontWeight: "bold",
        textAlign: "right"
      }
    }]), {
      field: "total",
      header: "Total General",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: "normal"
        }
      }, formatCurrency(rowData.total)),
      footer: () => /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: "bold"
        }
      }, formatCurrency(grandTotal)),
      style: createColumnStyle("right"),
      headerStyle: createColumnStyle("right"),
      footerStyle: {
        fontWeight: "bold",
        textAlign: "right"
      }
    }];

    // Crear grupo de encabezados
    const headerGroup = /*#__PURE__*/React.createElement(ColumnGroup, null, /*#__PURE__*/React.createElement(Row, null, /*#__PURE__*/React.createElement(Column, {
      header: "M\xE9todo de Pago",
      rowSpan: 2
    }), Array.from(billingUsers).map(user => /*#__PURE__*/React.createElement(Column, {
      key: user,
      header: user,
      colSpan: 3
    })), /*#__PURE__*/React.createElement(Column, {
      header: "Total General",
      rowSpan: 2
    })), /*#__PURE__*/React.createElement(Row, null, Array.from(billingUsers).flatMap(user => [/*#__PURE__*/React.createElement(Column, {
      key: `${user}_copago`,
      header: "Copago"
    }), /*#__PURE__*/React.createElement(Column, {
      key: `${user}_particular`,
      header: "Particular"
    }), /*#__PURE__*/React.createElement(Column, {
      key: `${user}_autorizado`,
      header: "Monto autorizado"
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
      currentPageReportTemplate: "Mostrando {first} a {last} de {totalRecords} registros",
      footerColumnGroup: /*#__PURE__*/React.createElement(ColumnGroup, null, /*#__PURE__*/React.createElement(Row, null, paymentColumns.map((col, index) => /*#__PURE__*/React.createElement(Column, {
        key: `footer-${index}`,
        footer: col.footer,
        footerStyle: col.footerStyle
      }))))
    }, paymentColumns.map((col, i) => /*#__PURE__*/React.createElement(Column, {
      key: i,
      field: col.field,
      header: col.header,
      body: col.body,
      style: col.style,
      headerStyle: col.headerStyle,
      footer: col.footer,
      footerStyle: col.footerStyle
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
  }, "Facturas"), loading ? /*#__PURE__*/React.createElement("div", {
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
    className: "\r ",
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
    className: `nav-link ${activeTab === "procedures-tab" ? "active" : ""}`,
    id: "procedures-tab",
    onClick: () => setActiveTab("procedures-tab"),
    role: "tab"
  }, "Procedimientos $")), /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: `nav-link ${activeTab === "procedures-count-tab" ? "active" : ""}`,
    id: "procedures-count-tab",
    onClick: () => setActiveTab("procedures-count-tab"),
    role: "tab"
  }, "Procedimientos #")), /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: `nav-link ${activeTab === "entities-tab" ? "active" : ""}`,
    id: "entities-tab",
    onClick: () => setActiveTab("entities-tab"),
    role: "tab"
  }, "Entidades")), /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: `nav-link ${activeTab === "paymentsMethods-tab" ? "active" : ""}`,
    id: "paymentsMethods-tab",
    onClick: () => setActiveTab("paymentsMethods-tab"),
    role: "tab"
  }, "M\xE9todos de pago"))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-xxl-12 tab-content mt-3",
    id: "myTabContent"
  }, /*#__PURE__*/React.createElement("div", {
    className: `tab-pane fade ${activeTab === "procedures-tab" ? "show active" : ""}`,
    id: "tab-procedures",
    role: "tabpanel",
    "aria-labelledby": "procedures-tab"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mb-2"
  }, /*#__PURE__*/React.createElement(ExportButtonExcel, {
    onClick: handleExportProcedures,
    loading: exporting.procedures,
    disabled: !reportData || reportData.length === 0
  }), /*#__PURE__*/React.createElement(ExportButtonPDF, {
    onClick: () => exportToProceduresPDF("procedures-tab"),
    loading: exporting.procedures,
    disabled: !reportData || reportData.length === 0
  })), generateProceduresTable()), /*#__PURE__*/React.createElement("div", {
    className: `tab-pane fade ${activeTab === "procedures-count-tab" ? "show active" : ""}`,
    id: "tab-procedures-count",
    role: "tabpanel",
    "aria-labelledby": "procedures-count-tab"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mb-2"
  }, /*#__PURE__*/React.createElement(ExportButtonPDF, {
    onClick: () => exportToProceduresPDF("procedures-count-tab"),
    loading: exporting.procedures,
    disabled: !reportData || reportData.length === 0
  })), generateProceduresCountTable()), /*#__PURE__*/React.createElement("div", {
    className: `tab-pane fade ${activeTab === "entities-tab" ? "show active" : ""}`,
    id: "tab-entities",
    role: "tabpanel",
    "aria-labelledby": "entities-tab"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mb-2"
  }, /*#__PURE__*/React.createElement(ExportButtonExcel, {
    onClick: handleExportEntities,
    loading: exporting.entities,
    disabled: !reportData || reportData.length === 0 || !reportData.some(item => item.insurance)
  }), /*#__PURE__*/React.createElement(ExportButtonPDF, {
    onClick: () => exportToProceduresPDF("entities-tab"),
    loading: exporting.entities,
    disabled: !reportData || reportData.length === 0 || !reportData.some(item => item.insurance)
  })), generateEntitiesTable()), /*#__PURE__*/React.createElement("div", {
    className: `tab-pane fade ${activeTab === "paymentsMethods-tab" ? "show active" : ""}`,
    id: "tab-paymentsMethods",
    role: "tabpanel",
    "aria-labelledby": "paymentsMethods-tab"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mb-2"
  }, /*#__PURE__*/React.createElement(ExportButtonExcel, {
    onClick: handleExportPayments,
    loading: exporting.payments,
    disabled: !reportData || reportData.length === 0 || !reportData.some(item => item.payment_methods && item.payment_methods.length > 0)
  }), /*#__PURE__*/React.createElement(ExportButtonPDF, {
    onClick: () => exportToProceduresPDF("payments-methods-tab"),
    loading: exporting.payments,
    disabled: !reportData || reportData.length === 0 || !reportData.some(item => item.payment_methods && item.payment_methods.length > 0)
  })), generatePaymentsTable()))))))));
};
const ExportButtonExcel = ({
  onClick,
  loading = false,
  disabled = false
}) => {
  return /*#__PURE__*/React.createElement(Button, {
    tooltip: "Exportar a excel",
    tooltipOptions: {
      position: "top"
    },
    icon: "pi pi-file-excel",
    onClick: onClick,
    className: "p-button-success",
    loading: loading,
    disabled: disabled
  }, " ", /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-excel"
  }, " "));
};
const ExportButtonPDF = ({
  onClick,
  loading = false,
  disabled = false
}) => {
  return /*#__PURE__*/React.createElement(Button, {
    tooltip: "Exportar a excel",
    tooltipOptions: {
      position: "top"
    },
    onClick: onClick,
    className: "p-button-secondary",
    loading: loading,
    disabled: disabled
  }, " ", /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-pdf"
  }, " "));
};