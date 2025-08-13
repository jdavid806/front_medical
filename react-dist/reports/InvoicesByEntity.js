import React, { useState, useEffect } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
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
  const [activeTab, setActiveTab] = useState("byEntity-tab");
  const [treeData, setTreeData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const {
    company,
    setCompany,
    fetchCompany
  } = useCompany();
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
      prepareTreeData();
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
  const prepareTreeData = () => {
    const groupedByEntity = {};
    reportData.forEach(item => {
      const entity = item.admission?.patient?.social_security?.entity;
      const entityKey = entity?.id || "sin-entidad";
      const entityName = entity?.name || "Sin entidad";
      if (!groupedByEntity[entityKey]) {
        groupedByEntity[entityKey] = {
          key: `entity_${entityKey}`,
          data: {
            entidad: entityName,
            facturador: "",
            paciente: ` 0`,
            // Inicializar contador
            producto: ` 0`,
            // Inicializar contador
            numeroAutorizacion: "",
            montoPagado: 0,
            fechaVencimiento: ""
          },
          children: [],
          totalPacientes: 0,
          totalProductos: 0
        };
      }
      const facturador = item.user ? `${item.user.first_name} ${item.user.last_name}` : "-";
      const paciente = item.admission?.patient ? `${item.admission.patient.first_name} ${item.admission.patient.last_name}` : "-";
      const producto = item.admission?.appointment?.product?.name || "-";
      const montoPagado = parseFloat(item.admission.entity_authorized_amount) || 0;

      // Agregar factura como hijo
      groupedByEntity[entityKey].children.push({
        key: `invoice_${item.invoice.id}_${item.admission.id}`,
        data: {
          entidad: "",
          facturador: facturador,
          paciente: paciente,
          producto: producto,
          numeroAutorizacion: item.admission.authorization_number || "-",
          montoPagado: montoPagado,
          fechaVencimiento: item.invoice.due_date || "-"
        }
      });

      // Actualizar totales
      groupedByEntity[entityKey].totalPacientes++;
      groupedByEntity[entityKey].totalProductos++;
      groupedByEntity[entityKey].data.montoPagado += montoPagado;

      // Actualizar texto en nodo padre
      groupedByEntity[entityKey].data.paciente = ` ${groupedByEntity[entityKey].totalPacientes}`;
      groupedByEntity[entityKey].data.producto = ` ${groupedByEntity[entityKey].totalProductos}`;
    });
    const treeData = Object.values(groupedByEntity).sort((a, b) => a.data.entidad.localeCompare(b.data.entidad));
    setTreeData(treeData);
  };
  const amountBodyTemplate = node => {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: "bold"
      }
    }, formatCurrency(node.data.montoPagado));
  };
  const header = /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end"
  }, /*#__PURE__*/React.createElement("span", {
    className: "p-input-icon-left"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-search"
  }), /*#__PURE__*/React.createElement(InputText, {
    type: "search",
    onInput: e => setGlobalFilter(e.currentTarget.value),
    placeholder: "Buscar..."
  })));

  //Exportar excel
  const exportButtonTemplate = node => {
    if (node.children && node.children.length > 0) {
      return /*#__PURE__*/React.createElement("div", {
        className: "d-flex gap-2"
      }, /*#__PURE__*/React.createElement(Button, {
        className: "p-button-rounded p-button-success p-button-sm",
        onClick: e => {
          e.stopPropagation();
          handleExportEntity(node);
        },
        tooltip: "Exportar a Excel",
        tooltipOptions: {
          position: "top"
        }
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-file-excel"
      })), /*#__PURE__*/React.createElement(Button, {
        className: "p-button-rounded p-button-secondary p-button-sm",
        onClick: e => {
          e.stopPropagation();
          handleExportPDF(node);
        },
        tooltip: "Exportar a PDF",
        tooltipOptions: {
          position: "top"
        }
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-file-pdf"
      })));
    }
    return null;
  };
  const handleExportEntity = node => {
    const entityData = node.children.map(child => ({
      Entidad: node.data.entidad,
      Facturador: child.data.facturador,
      Paciente: child.data.paciente,
      Producto: child.data.producto,
      "Número Autorización": child.data.numeroAutorizacion,
      "Monto Pagado": child.data.montoPagado,
      "Fecha Vencimiento": child.data.fechaVencimiento
    }));
    exportToExcel({
      data: entityData,
      fileName: `Facturas_${node.data.entidad.replace(/[^a-zA-Z0-9]/g, "_")}`
    });
  };
  function handleExportPDF(node) {
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
          <th>Facturador</th>
          <th>Paciente</th>
          <th>Producto</th>
          <th>Número Autorización</th>
          <th>Monto Pagado</th>
          <th>Fecha Vencimiento</th>
        </tr>
      </thead>
      <tbody>
        ${node.children.reduce((acc, child) => acc + `
          <tr>
            <td>${child.data.facturador}</td>
            <td>${child.data.paciente}</td>
            <td>${child.data.producto}</td>
            <td>${child.data.numeroAutorizacion}</td>
            <td>${child.data.montoPagado}</td>
            <td>${child.data.fechaVencimiento}</td>
          </tr>
        `, '')}
      </tbody>
    </table>`;
    const configPDF = {
      name: node.data.entidad
    };
    generatePDFFromHTML(table, company, configPDF);
  }
  return /*#__PURE__*/React.createElement("main", {
    className: "main",
    id: "top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pb-9"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "mb-4"
  }, "Facturas por Entidad"), loading ? /*#__PURE__*/React.createElement("div", {
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
    className: `nav-link ${activeTab === "byEntity-tab" ? "active" : ""}`,
    id: "byEntity-tab",
    onClick: () => setActiveTab("byEntity-tab"),
    role: "tab"
  }, "Entidad"))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-xxl-12 tab-content mt-3",
    id: "myTabContent"
  }, /*#__PURE__*/React.createElement("div", {
    className: `tab-pane fade ${activeTab === "byEntity-tab" ? "show active" : ""}`,
    id: "tab-byEntity",
    role: "tabpanel",
    "aria-labelledby": "byEntity-tab"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, tableLoading ? /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-center align-items-center",
    style: {
      height: "200px",
      marginLeft: "950px",
      marginTop: "100px"
    }
  }, /*#__PURE__*/React.createElement(ProgressSpinner, null)) : /*#__PURE__*/React.createElement(TreeTable, {
    value: treeData,
    header: header,
    globalFilter: globalFilter,
    scrollable: true,
    scrollHeight: "400px",
    className: "p-treetable-sm",
    loading: tableLoading,
    showGridlines: true,
    stripedRows: true
  }, /*#__PURE__*/React.createElement(Column, {
    field: "entidad",
    header: "Entidad",
    expander: true,
    style: {
      minWidth: "200px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "facturador",
    header: "Facturador",
    style: {
      minWidth: "200px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "paciente",
    header: "Paciente",
    style: {
      minWidth: "150px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "producto",
    header: "Producto",
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
    field: "montoPagado",
    header: "Monto pagado",
    body: amountBodyTemplate,
    style: {
      minWidth: "150px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "fechaVencimiento",
    header: "Fecha vencimiento",
    style: {
      minWidth: "150px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    body: exportButtonTemplate,
    header: "Exportar",
    style: {
      width: "100px"
    }
  })))))))))));
};