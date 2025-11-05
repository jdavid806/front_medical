import React, { useState, useEffect } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Accordion, AccordionTab } from "primereact/accordion";
import { exportToExcel } from "../accounting/utils/ExportToExcelOptions.js";
import { generatePDFFromHTML } from "../../funciones/funcionesJS/exportPDF.js";
import { useCompany } from "../hooks/useCompany.js"; // Import your services
import { productService, userService, patientService, billingService, entityService } from "../../services/api/index.js";
export const InvoicesByEntity = () => {
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
  const [selectedEntity, setSelectedEntity] = useState(0);
  const [dateRange, setDateRange] = useState([fiveDaysAgo, today]);

  // State for report data
  const [reportData, setReportData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [activeTab, setActiveTab] = useState("byEntity");
  const [globalFilter, setGlobalFilter] = useState("");
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
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        // Load initial data
        await loadProcedures();
        await loadSpecialists();
        await loadPatients();
        await loadEntities();
        await loadData();
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setLoading(false);
      }
    };
    initializeData();
  }, []);
  useEffect(() => {
    if (reportData.length > 0) {
      prepareTableData();
    }
  }, [reportData]);
  const loadData = async (filterParams = {
    end_date: formatDate(today),
    start_date: formatDate(fiveDaysAgo)
  }) => {
    try {
      setTableLoading(true);
      const data = await billingService.getBillingReportByEntity(filterParams);
      setReportData(data);
    } catch (error) {
      console.error("Error loading report data:", error);
    } finally {
      setTableLoading(false);
    }
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
  const handleFilter = async () => {
    try {
      const filterParams = {
        end_date: dateRange[1] ? formatDate(dateRange[1]) : "",
        start_date: dateRange[0] ? formatDate(dateRange[0]) : ""
      };
      if (selectedPatients && selectedPatients.length > 0) filterParams.patient_ids = selectedPatients;
      if (selectedProcedures && selectedProcedures.length > 0) filterParams.product_ids = selectedProcedures;
      if (selectedSpecialists && selectedSpecialists.length > 0) filterParams.user_ids = selectedSpecialists;
      if (selectedEntity) filterParams.entity_id = selectedEntity;
      await loadData(filterParams);
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
  const formatCurrency = value => {
    const formatted = new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2
    }).format(value);
    return formatted;
  };
  const prepareTableData = () => {
    const flatData = [];
    reportData.forEach(item => {
      const entity = item.admission?.patient?.social_security?.entity;
      const entityName = entity?.name || "Sin entidad";
      const facturador = item.user ? `${item.user.first_name} ${item.user.last_name}` : "-";
      const paciente = item.admission?.patient ? `${item.admission.patient.first_name} ${item.admission.patient.last_name}` : "-";
      const producto = item.admission?.appointment?.product?.name || "-";
      const montoPagado = parseFloat(item.admission.entity_authorized_amount) || 0;
      flatData.push({
        id: item.invoice.id,
        entidad: entityName,
        facturador: facturador,
        paciente: paciente,
        producto: producto,
        numeroAutorizacion: item.admission.authorization_number || "-",
        montoPagado: montoPagado,
        fechaVencimiento: item.invoice.due_date || "-",
        invoiceCode: item.invoice.invoice_code || "-"
      });
    });

    // Ordenar por entidad
    const sortedData = flatData.sort((a, b) => a.entidad.localeCompare(b.entidad));
    setTableData(sortedData);
  };
  const amountBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: "bold"
      }
    }, formatCurrency(rowData.montoPagado));
  };
  const onPageChange = event => {
    setFirst(event.first);
    setRows(event.rows);
  };

  //Exportar excel para toda la entidad
  const handleExportEntity = () => {
    const entityData = tableData.map(item => ({
      Entidad: item.entidad,
      Facturador: item.facturador,
      Paciente: item.paciente,
      Producto: item.producto,
      "Número Autorización": item.numeroAutorizacion,
      "Código de factura": item.invoiceCode,
      "ID": item.id,
      "Monto Pagado": item.montoPagado,
      "Fecha Vencimiento": item.fechaVencimiento
    }));
    exportToExcel({
      data: entityData,
      fileName: `Facturas_por_Entidad`
    });
  };

  //Exportar PDF para toda la entidad
  function handleExportPDF() {
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
          <th>Entidad</th>
          <th>Facturador</th>
          <th>Paciente</th>
          <th>Producto</th>
          <th>Número Autorización</th>
          <th>Código de factura</th>
          <th>ID</th>
          <th>Monto Pagado</th>
          <th>Fecha Vencimiento</th>
        </tr>
      </thead>
      <tbody>
        ${tableData.reduce((acc, item) => acc + `
          <tr>
            <td>${item.entidad}</td>
            <td>${item.facturador}</td>
            <td>${item.paciente}</td>
            <td>${item.producto}</td>
            <td>${item.numeroAutorizacion}</td>
            <td>${item.invoiceCode}</td>
            <td>${item.id}</td>
            <td>${item.montoPagado}</td>
            <td>${item.fechaVencimiento}</td>
          </tr>
        `, "")}
      </tbody>
    </table>`;
    const configPDF = {
      name: "Facturas_por_Entidad"
    };
    generatePDFFromHTML(table, company, configPDF);
  }
  return /*#__PURE__*/React.createElement("main", {
    className: "main",
    id: "top"
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
  }, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "400px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body h-100 w-100 d-flex flex-column",
    style: {
      marginTop: "-40px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "tabs-professional-container mt-4"
  }, /*#__PURE__*/React.createElement(Accordion, null, /*#__PURE__*/React.createElement(AccordionTab, {
    header: "Filtros"
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
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end m-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Filtrar",
    icon: "pi pi-filter",
    onClick: handleFilter,
    className: "p-button-primary"
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "tabs-header"
  }, /*#__PURE__*/React.createElement("button", {
    className: `tab-item ${activeTab === "byEntity" ? "active" : ""}`,
    onClick: () => setActiveTab("byEntity")
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-building"
  }), "Entidad")), /*#__PURE__*/React.createElement("div", {
    className: "tabs-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: `tab-panel ${activeTab === "byEntity" ? "active" : ""}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mb-4"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-success",
    onClick: handleExportEntity,
    tooltip: "Exportar a Excel",
    tooltipOptions: {
      position: "top"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-excel me-2"
  }), "Excel"), /*#__PURE__*/React.createElement(Button, {
    className: "p-button-secondary",
    onClick: handleExportPDF,
    tooltip: "Exportar a PDF",
    tooltipOptions: {
      position: "top"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-pdf me-2"
  }), "PDF")), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, tableLoading ? /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-center align-items-center",
    style: {
      height: "200px",
      marginLeft: "950px",
      marginTop: "100px"
    }
  }, /*#__PURE__*/React.createElement(ProgressSpinner, null)) : /*#__PURE__*/React.createElement(DataTable, {
    value: tableData,
    loading: tableLoading,
    scrollable: true,
    scrollHeight: "400px",
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
    globalFilter: globalFilter,
    header: /*#__PURE__*/React.createElement("div", {
      className: "flex justify-content-between align-items-center"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-xl font-semibold"
    }, "Facturas por Entidad"), /*#__PURE__*/React.createElement("span", {
      className: "p-input-icon-left"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-search"
    }), /*#__PURE__*/React.createElement(InputText, {
      type: "search",
      onInput: e => setGlobalFilter(e.currentTarget.value),
      placeholder: "Buscar..."
    })))
  }, /*#__PURE__*/React.createElement(Column, {
    field: "entidad",
    header: "Entidad",
    sortable: true,
    style: {
      minWidth: "200px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "facturador",
    header: "Facturador",
    sortable: true,
    style: {
      minWidth: "200px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "paciente",
    header: "Paciente",
    sortable: true,
    style: {
      minWidth: "150px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "producto",
    header: "Producto",
    sortable: true,
    style: {
      minWidth: "200px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "numeroAutorizacion",
    header: "N\xFAmero autorizaci\xF3n",
    style: {
      minWidth: "200px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "invoiceCode",
    header: "C\xF3digo de factura",
    style: {
      minWidth: "150px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "id",
    header: "ID",
    style: {
      minWidth: "150px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "montoPagado",
    header: "Monto pagado",
    body: amountBodyTemplate,
    sortable: true,
    style: {
      minWidth: "150px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "fechaVencimiento",
    header: "Fecha vencimiento",
    style: {
      minWidth: "150px"
    }
  }))))))))))));
};