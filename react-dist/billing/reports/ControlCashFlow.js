import React, { useState, useEffect } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { exportToExcel } from "../../accounting/utils/ExportToExcelOptions.js";
import { formatDate as formatDateUtils } from "../../../services/utilidades.js";
import { generatePDFFromHTML } from "../../../funciones/funcionesJS/exportPDF.js";
import { useCompany } from "../../hooks/useCompany.js"; // Import your services
import { productService, userService, patientService, billingService, entityService } from "../../../services/api/index.js";
import { Card } from "primereact/card";
export const ControlCashFlow = () => {
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
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  // Pagination state
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  // Export loading state
  const [exporting, setExporting] = useState({
    excel: false,
    pdf: false
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
        await loadData(defaultFilters, true);
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setLoading(false);
      }
    };
    initializeData();
  }, []);
  const loadData = async (filterParams = {}, useAlternateService = true) => {
    try {
      setTableLoading(true);
      // Use the cash flow service specifically
      const data = await billingService.getCashFlowReport(filterParams);
      setReportData(data);
      return data;
    } catch (error) {
      console.error("Error loading cash control data:", error);
      throw error;
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
      await loadData(filterParams, true);
      setFirst(0); // Reset to first page when filtering
    } catch (error) {
      console.error("Error filtering data:", error);
    }
  };
  const formatDate = date => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const handleDataExport = dataExport => {
    const dataFilter = dataExport.map(item => {
      return {
        procedimiento: item?.invoice.details.map(detail => detail.product.name).join(","),
        codigo_entidad: item?.authorization_number,
        copago: item?.invoice?.type === "entity" ? formatCurrency(item?.invoice?.total_amount) : formatCurrency(0),
        particular: item?.invoice?.type === "public" ? formatCurrency(item?.invoice?.total_amount) : formatCurrency(0),
        monto_autorizado: item?.entity_authorized_amount,
        fecha: formatDateUtils(item?.created_at),
        ingresos: formatCurrency(parseInt(item?.invoice?.total_amount) + (parseInt(item?.entity_authorized_amount) || 0) || 0),
        salidas: item?.invoice?.status === "canceled" ? formatCurrency(item?.invoice?.total_amount || 0) : formatCurrency(0)
      };
    });
    return dataFilter;
  };
  const exportCashControlToExcel = async () => {
    try {
      setExporting({
        ...exporting,
        excel: true
      });
      const dataExport = handleDataExport(reportData);
      exportToExcel({
        data: dataExport,
        fileName: `Control_caja_${formatDateUtils(new Date())}`
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    } finally {
      setExporting({
        ...exporting,
        excel: false
      });
    }
  };
  const exportCashFlowToPDF = () => {
    try {
      setExporting({
        ...exporting,
        pdf: true
      });
      const dataExport = reportData;

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
          </style>
      
          <table>
            <thead>
              ${headers}
            </thead>
            <tbody>
              ${dataExport.reduce((acc, rowData) => acc + `
                <tr>
                  <td>${rowData?.invoice?.details.length <= 1 ? rowData?.invoice?.details[0]?.product?.name || "" : "Laboratorio"}</td>
                  <td>${rowData?.authorization_number || ""}</td>
                  <td>${rowData?.invoice?.type === "entity" ? formatCurrency(rowData?.invoice?.total_amount || 0) : formatCurrency(0)}</td>
                  <td>${rowData?.invoice?.type === "public" ? formatCurrency(rowData?.invoice?.total_amount || 0) : formatCurrency(0)}</td>
                  <td>${formatCurrency(rowData?.entity_authorized_amount || 0)}</td>
                  <td>${formatDateUtils(rowData.created_at)}</td>
                  <td class="right">${formatCurrency((parseInt(rowData?.invoice?.total_amount) || 0) + (parseInt(rowData?.entity_authorized_amount) || 0))}</td>
                  <td class="right">${rowData?.invoice?.status === "canceled" ? formatCurrency(rowData?.invoice?.total_amount || 0) : formatCurrency(0)}</td>
                </tr>
              `, "")}
            </tbody>
          </table>`;
      const configPDF = {
        name: "Control_de_caja"
      };
      generatePDFFromHTML(table, company, configPDF);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
    } finally {
      setExporting({
        ...exporting,
        pdf: false
      });
    }
  };
  const generateCashControlTable = () => {
    if (!reportData || reportData.length === 0) {
      return /*#__PURE__*/React.createElement("div", {
        className: "flex justify-content-center align-items-center",
        style: {
          height: "200px"
        }
      }, /*#__PURE__*/React.createElement("span", null, "No hay datos disponibles"));
    }
    const cashControlColumns = [{
      field: "procedure",
      header: "Procedimiento",
      body: rowData => rowData?.invoice?.details.length <= 1 ? rowData?.invoice?.details[0].product.name : "Laboratorio"
    }, {
      field: "cod_entity",
      header: "Codigo Entidad",
      body: rowData => rowData?.authorization_number
    }, {
      field: "copayment",
      header: "Copago",
      body: rowData => rowData?.invoice?.type === "entity" ? formatCurrency(rowData?.invoice?.total_amount) : formatCurrency(0)
    }, {
      field: "authorized_amount_user",
      header: "Particular",
      body: rowData => rowData?.invoice?.type === "public" ? formatCurrency(rowData?.invoice?.total_amount) : formatCurrency(0)
    }, {
      field: "entity_authorized_amount",
      header: "Monto autorizado",
      body: rowData => formatCurrency(rowData?.entity_authorized_amount || 0)
    }, {
      field: "date",
      header: "Fecha",
      style: createColumnStyle("left", "150px"),
      body: rowData => formatDateUtils(rowData.created_at)
    }, {
      field: "income",
      header: "Ingresos",
      style: createColumnStyle("right"),
      body: rowData => formatCurrency(parseInt(rowData?.invoice?.total_amount) + (parseInt(rowData?.entity_authorized_amount) || 0) || 0)
    }, {
      field: "outflows",
      header: "Salidas",
      style: createColumnStyle("right"),
      body: rowData => rowData?.invoice?.status === "canceled" ? formatCurrency(rowData?.invoice?.total_amount || 0) : formatCurrency(0)
    }];
    return /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, tableLoading ? /*#__PURE__*/React.createElement("div", {
      className: "flex justify-content-center align-items-center",
      style: {
        height: "200px"
      }
    }, /*#__PURE__*/React.createElement(ProgressSpinner, null)) : /*#__PURE__*/React.createElement(DataTable, {
      value: reportData,
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
    }, cashControlColumns.map((col, i) => /*#__PURE__*/React.createElement(Column, {
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
    className: "pb-9"
  }, loading ? /*#__PURE__*/React.createElement("div", {
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
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de B\xFAsqueda",
    className: "mb-3"
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
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "row gy-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-xxl-12"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mb-3"
  }, /*#__PURE__*/React.createElement(Button, {
    tooltip: "Exportar a excel",
    tooltipOptions: {
      position: "top"
    },
    onClick: exportCashControlToExcel,
    className: "p-button-success",
    disabled: !reportData || reportData.length === 0 || exporting.excel,
    loading: exporting.excel
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-excel"
  })), /*#__PURE__*/React.createElement(Button, {
    tooltip: "Exportar a PDF",
    tooltipOptions: {
      position: "top"
    },
    onClick: exportCashFlowToPDF,
    className: "p-button-secondary",
    disabled: !reportData || reportData.length === 0 || exporting.pdf,
    loading: exporting.pdf
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-pdf"
  }))), generateCashControlTable()))))));
};