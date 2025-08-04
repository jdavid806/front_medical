import React, { useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { Accordion, AccordionTab } from "primereact/accordion";
import { exportToExcel } from "../accounting/utils/ExportToExcelOptions.js";
import { generatePDFFromHTML } from "../../funciones/funcionesJS/exportPDF.js";
import { useCompany } from "../hooks/useCompany.js"; // Import your services
import { appointmentService } from "../../services/api/index.js";
import { appointmentStatesByKeyTwo } from "../../services/commons.js";
export const Appointments = () => {
  // Set default date range (last 5 days)
  const today = new Date();
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(today.getDate() - 5);

  // State for filters
  const [dateRange, setDateRange] = useState([fiveDaysAgo, today]);
  const [reportData, setReportData] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const {
    company,
    setCompany,
    fetchCompany
  } = useCompany();
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await loadData();
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setLoading(false);
      }
    };
    initializeData();
  }, []);
  const loadData = async (filterParams = {}) => {
    setTableLoading(true);
    try {
      const response = await appointmentService.appointmentsWithFilters(filterParams);
      const data = response.data || response;
      if (!Array.isArray(data)) {
        throw new Error("La respuesta no es un array de citas");
      }
      const processedData = handlerDataAppointments(data);
      setReportData(processedData);

      // Agrupar datos por estado
      const grouped = {};
      processedData.forEach(appointment => {
        if (!grouped[appointment.state]) {
          grouped[appointment.state] = [];
        }
        grouped[appointment.state].push(appointment);
      });
      setGroupedData(grouped);
    } catch (error) {
      console.error("Error loading report data:", error);
    } finally {
      setTableLoading(false);
    }
  };
  const handleFilter = async () => {
    try {
      const filterParams = {
        start_date: dateRange[0] ? formatDate(dateRange[0]) : "",
        end_date: dateRange[1] ? formatDate(dateRange[1]) : ""
      };
      await loadData(filterParams);
    } catch (error) {
      console.error("Error filtering data:", error);
    }
  };
  const formatDate = date => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };
  const handlerDataAppointments = data => {
    return data.map(item => {
      const state = appointmentStatesByKeyTwo[item.appointment_state?.name];
      return {
        ...item,
        state: (typeof state === "object" ? state.CONSULTATION : state) ?? "Sin estado"
      };
    });
  };
  const handleExportExcel = state => {
    const dataToExport = groupedData[state].map(item => ({
      Estado: item.state,
      Paciente: `${item.patient.first_name} ${item.patient.last_name}`,
      Documento: item.patient.document_number,
      Ciudad: item.patient.city_id,
      Producto: item.product_id,
      Fecha: new Date(item.created_at).toLocaleDateString("es-DO")
    }));
    exportToExcel({
      data: dataToExport,
      fileName: `Citas_${state.replace(/ /g, "_")}_${new Date().toISOString().slice(0, 10)}`
    });
  };
  function handleExportPDF(state) {
    const dataExport = groupedData[state].map(item => ({
      state: item.state,
      patient: `${item.patient.first_name} ${item.patient.last_name}`,
      document_number: item.patient.document_number,
      city: item.patient.city_id,
      productt: item.product_id,
      date: new Date(item.created_at).toLocaleDateString("es-DO")
    }));
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
              <th>Estado</th>
              <th>Paciente</th>
              <th>Documento</th>
              <th>Ciudad</th>
              <th>Producto</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            ${dataExport.reduce((acc, item) => acc + `
              <tr>
                <td>${item.state ?? ""}</td>
                <td>${item.patient ?? ""}</td>
                <td>${item.document_number ?? ""}</td>
                <td>${item.city ?? ""}</td>
                <td>${item.product ?? ""}</td>
                <td>${item.date}</td>
              </tr>
            `, "")}
          </tbody>
        </table>`;
    const configPDF = {
      name: "Citas - " + state
    };
    generatePDFFromHTML(table, company, configPDF);
  }
  const dateTemplate = rowData => {
    return new Date(rowData.created_at).toLocaleDateString("es-DO");
  };
  const headerTemplate = (state, count) => {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-center w-full p-4"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, state), " - Total: ", count)), /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      style: {
        marginLeft: "10px"
      },
      className: "p-button-rounded p-button-success p-button-sm",
      onClick: e => {
        e.stopPropagation();
        e.preventDefault();
        handleExportExcel(state);
      },
      tooltip: `Exportar ${state} a Excel`,
      tooltipOptions: {
        position: "right"
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-file-excel"
    })), /*#__PURE__*/React.createElement(Button, {
      style: {
        marginLeft: "10px"
      },
      className: "p-button-rounded p-button-secondary p-button-sm",
      onClick: e => {
        e.stopPropagation();
        e.preventDefault();
        handleExportPDF(state);
      },
      tooltip: `Exportar ${state} a PDF`,
      tooltipOptions: {
        position: "right"
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-file-pdf"
    }))));
  };
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex justify-content-center align-items-center",
      style: {
        height: "50vh",
        marginLeft: "950px",
        marginTop: "100px"
      }
    }, /*#__PURE__*/React.createElement(ProgressSpinner, null));
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
  }, "Reporte de Citas por Estado"), /*#__PURE__*/React.createElement("div", {
    className: "card border border-light mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Rango de fechas"), /*#__PURE__*/React.createElement(Calendar, {
    value: dateRange,
    onChange: e => setDateRange(e.value),
    selectionMode: "range",
    readOnlyInput: true,
    dateFormat: "dd/mm/yy",
    placeholder: "Seleccione un rango",
    className: "w-full",
    showIcon: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end mt-3"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Filtrar",
    icon: "pi pi-filter",
    onClick: handleFilter,
    loading: tableLoading,
    className: "p-button-primary"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, tableLoading ? /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-center align-items-center",
    style: {
      height: "200px",
      marginLeft: "950px",
      marginTop: "100px"
    }
  }, /*#__PURE__*/React.createElement(ProgressSpinner, null)) : Object.keys(groupedData).length > 0 ? /*#__PURE__*/React.createElement(Accordion, {
    activeIndex: activeIndex,
    onTabChange: e => setActiveIndex(e.index)
  }, Object.entries(groupedData).map(([state, appointments]) => /*#__PURE__*/React.createElement(AccordionTab, {
    key: state,
    header: headerTemplate(state, appointments.length)
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: appointments,
    emptyMessage: `No hay citas en estado ${state}`,
    className: "p-datatable-sm p-datatable-striped",
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25]
  }, /*#__PURE__*/React.createElement(Column, {
    field: "patient.first_name",
    header: "Paciente",
    body: data => `${data.patient.first_name} ${data.patient.last_name}`,
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "patient.document_number",
    header: "Documento",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "patient.city_id",
    header: "Ciudad",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "product_id",
    header: "Producto",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "created_at",
    header: "Fecha",
    body: dateTemplate,
    sortable: true
  }))))) : /*#__PURE__*/React.createElement("p", null, "No hay datos para mostrar")))));
};