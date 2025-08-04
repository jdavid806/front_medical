import React, { useState } from "react";
import { useCashControlReport } from "./hooks/useCashControlReport.js";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import { useUsersForSelect } from "../users/hooks/useUsersForSelect.js";
import { useEffect } from "react";
import { exportCierresCajaToExcel } from "./excel/exportCashControlToExcel.js";
import { generatePDFFromHTML } from "../../funciones/funcionesJS/exportPDF.js";
import { useCompany } from "../hooks/useCompany.js";
export const CierreCaja = () => {
  const {
    cashControlReportItems,
    fetchCashControlReport,
    loading
  } = useCashControlReport();
  const {
    users
  } = useUsersForSelect();
  const {
    company
  } = useCompany();

  // Estado para controlar qué cierres están expandidos
  const [cierresExpandidos, setCierresExpandidos] = useState({});
  const [selectedWhoDeliversIds, setSelectedWhoDeliversIds] = useState([]);
  const [selectedWhoValidateIds, setSelectedWhoValidateIds] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  // Función para alternar la expansión de un cierre
  const toggleCierre = id => {
    setCierresExpandidos({
      ...cierresExpandidos,
      [id]: !cierresExpandidos[id]
    });
  };

  // Formatear dinero en formato local
  const formatoDinero = cantidad => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(cantidad);
  };

  // Obtener fecha formateada
  const obtenerFechaFormateada = fechaStr => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };
  const handleExportExcel = () => {
    exportCierresCajaToExcel({
      cierres: cashControlReportItems,
      fileName: "Mis_Cierres",
      sheetName: "Reporte Diario"
    });
  };
  const handleExportPDF = () => {
    if (!cashControlReportItems || cashControlReportItems.length === 0) return;

    // Generar la tabla HTML para el PDF
    const tableHTML = generateCierresTableHTML(cashControlReportItems);
    const configPDF = {
      name: "Cierre_de_Caja"
    };
    generatePDFFromHTML(tableHTML, company, configPDF);
  };
  const generateCierresTableHTML = cierres => {
    const normalizeMethodName = name => {
      const lower = name.toLowerCase();
      if (lower.includes("efectivo")) return "Efectivo";
      if (lower.includes("tarjeta") || lower.includes("crédito") || lower.includes("débito")) {
        return lower.includes("débito") ? "Tarjeta Débito" : "Tarjeta Crédito";
      }
      if (lower.includes("depósito") || lower.includes("transferencia")) return "Depósito";
      return name;
    };

    // 2. Agrupar datos por cajera y método de pago normalizado
    const datosPorCajera = {};
    const metodosPago = new Set();
    let totalGeneral = 0;
    cierres.forEach(cierre => {
      if (!cierre.who_delivers_name) return;
      if (!datosPorCajera[cierre.who_delivers_name]) {
        datosPorCajera[cierre.who_delivers_name] = {};
      }
      cierre.details?.forEach(detalle => {
        if (!detalle.payment_method_name || !detalle.total_received) return;
        const metodo = normalizeMethodName(detalle.payment_method_name);
        metodosPago.add(metodo);
        datosPorCajera[cierre.who_delivers_name][metodo] = (datosPorCajera[cierre.who_delivers_name][metodo] || 0) + (parseFloat(detalle.total_received) || 0);
        totalGeneral += parseFloat(detalle.total_received) || 0;
      });
    });

    // 3. Ordenar métodos de pago
    const metodosPagoArray = Array.from(metodosPago).sort((a, b) => {
      const order = ["Efectivo", "Tarjeta Crédito", "Tarjeta Débito", "Depósito"];
      return order.indexOf(a) - order.indexOf(b);
    });

    // 4. Calcular totales por método de pago
    const totalesPorMetodo = {};
    metodosPagoArray.forEach(metodo => {
      totalesPorMetodo[metodo] = Object.values(datosPorCajera).reduce((sum, cajera) => sum + (cajera[metodo] || 0), 0);
    });
    const totalBHD = cierres.reduce((sum, cierre) => {
      return sum + (cierre.details?.reduce((detailSum, detalle) => {
        if (detalle.payment_method_name?.includes("BHD")) {
          return detailSum + (parseFloat(detalle.total_received) || 0);
        }
        return detailSum;
      }, 0) || 0);
    }, 0);
    const totalDepositos = totalesPorMetodo["Depósito"] || 0;
    const totalOtrosBancos = totalDepositos - totalBHD;
    return `
          <style>
      body {
        font-family: Arial, sans-serif;
        font-size: 12px;
        color: #333;
        margin: 0;
        padding: 15px;
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
        border-bottom: 2px solid #424a51;
        padding-bottom: 10px;
      }
      .company-name {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 5px;
      }
      .report-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 5px;
        color: #424a51;
      }
      .report-date {
        font-size: 12px;
        color: #666;
      }
      .section {
        margin-bottom: 25px;
      }
      .section-title {
        background-color: #424a51;
        color: white;
        padding: 8px 12px;
        font-weight: bold;
        margin-bottom: 15px;
        border-radius: 4px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      th {
        background-color: #424a51;
        color: white;
        padding: 10px;
        text-align: left;
        font-weight: normal;
      }
      td {
        padding: 10px;
        border: 1px solid #ddd;
      }
      .text-right {
        text-align: right;
      }
      .text-center {
        text-align: center;
      }
      .text-bold {
        font-weight: bold;
      }
      .total-row {
        background-color: #f8f9fa;
      }
      .grand-total {
        background-color: #e9ecef;
        font-weight: bold;
      }
      .summary-table {
        width: 50%;
        margin: 20px auto;
      }
      .summary-table td {
        padding: 12px;
      }
    </style>
         <div class="header">
      <div class="company-name">${company?.name || "Establecimiento"}</div>
      <div class="report-title">REPORTE DE CIERRE DE CAJA</div>
      <div class="report-date">Generado el: ${new Date().toLocaleDateString("es-MX")}</div>
    </div>

    <div class="section">
      <div class="section-title">DETALLE POR FACTURADOR</div>
      <table>
        <thead>
          <tr>
            <th>FACTURADOR</th>
            ${metodosPagoArray.map(metodo => `
              <th class="text-right">${metodo.toUpperCase()}</th>
            `).join("")}
            <th class="text-right">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(datosPorCajera).map(([cajera, metodos]) => {
      const totalCajera = Object.values(metodos).reduce((sum, monto) => sum + (monto || 0), 0);
      return `
              <tr>
                <td>${cajera}</td>
                ${metodosPagoArray.map(metodo => `
                  <td class="text-right">${formatoDinero(metodos[metodo] || 0)}</td>
                `).join("")}
                <td class="text-right text-bold">${formatoDinero(totalCajera)}</td>
              </tr>
            `;
    }).join("")}
          <tr class="grand-total">
            <td class="text-bold">TOTAL GENERAL</td>
            ${metodosPagoArray.map(metodo => `
              <td class="text-right text-bold">${formatoDinero(totalesPorMetodo[metodo] || 0)}</td>
            `).join("")}
            <td class="text-right text-bold">${formatoDinero(totalGeneral)}</td>
          </tr>
        </tbody>
      </table>
    </div>

     <div class="section">
      <div class="section-title">RESUMEN GENERAL</div>
      <table class="summary-table">
        <tbody>
          <tr class="grand-total">
            <td class="text-bold">TOTAL INGRESOS:</td>
            <td class="text-right text-bold">${formatoDinero(totalGeneral)}</td>
          </tr>
          <tr class="grand-total">
            <td class="text-bold">TOTAL EFECTIVO:</td>
            <td class="text-right text-bold">${formatoDinero(totalesPorMetodo["Efectivo"] || 0)}</td>
          </tr>
          <tr class="grand-total">
            <td class="text-bold">TOTAL BHD:</td>
            <td class="text-right text-bold">${formatoDinero(totalBHD)}</td>
          </tr>
      
        </tbody>
      </table>
    </div>
  `;
  };
  useEffect(() => {
    fetchCashControlReport({
      whoDeliversIds: selectedWhoDeliversIds,
      whoValidateIds: selectedWhoValidateIds,
      startDate: selectedDate?.[0]?.toISOString() || null,
      endDate: selectedDate?.[1]?.toISOString() || null
    });
  }, [selectedWhoDeliversIds, selectedWhoValidateIds, selectedDate]);
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-center align-items-center h-100 bg-light rounded-3 p-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "spinner-border text-primary",
      role: "status"
    }, /*#__PURE__*/React.createElement("span", {
      className: "visually-hidden"
    }, "Cargando...")));
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "accordion mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion-item"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "accordion-header",
    id: "filters"
  }, /*#__PURE__*/React.createElement("button", {
    className: "accordion-button collapsed",
    type: "button",
    "data-bs-toggle": "collapse",
    "data-bs-target": "#filtersCollapse",
    "aria-expanded": "false",
    "aria-controls": "filtersCollapse"
  }, "Filtros")), /*#__PURE__*/React.createElement("div", {
    id: "filtersCollapse",
    className: "accordion-collapse collapse",
    "aria-labelledby": "filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-grow-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "rangoFechasCitas",
    className: "form-label"
  }, "Rango de fechas"), /*#__PURE__*/React.createElement(Calendar, {
    id: "rangoFechasCitas",
    name: "rangoFechaCitas",
    selectionMode: "range",
    dateFormat: "dd/mm/yy",
    value: selectedDate,
    onChange: e => setSelectedDate(e.value),
    className: "w-100",
    placeholder: "Seleccione un rango"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "who_delivers_ids",
    className: "form-label"
  }, "Entregado por"), /*#__PURE__*/React.createElement(MultiSelect, {
    inputId: "who_delivers_ids",
    options: users,
    optionLabel: "label",
    optionValue: "external_id",
    filter: true,
    placeholder: "Filtrar por usuario",
    className: "w-100",
    value: selectedWhoDeliversIds,
    onChange: e => setSelectedWhoDeliversIds(e.value),
    showClear: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "who_validate_ids",
    className: "form-label"
  }, "Validado por"), /*#__PURE__*/React.createElement(MultiSelect, {
    inputId: "who_validate_ids",
    options: users,
    optionLabel: "label",
    optionValue: "external_id",
    filter: true,
    placeholder: "Filtrar por usuario",
    className: "w-100",
    value: selectedWhoValidateIds,
    onChange: e => setSelectedWhoValidateIds(e.value),
    showClear: true
  }))))))))), /*#__PURE__*/React.createElement("div", {
    className: "card shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "btn-group"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleExportExcel,
    className: "btn btn-success btn-sm",
    disabled: !cashControlReportItems || cashControlReportItems.length === 0
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-file-excel me-2"
  }), "Exportar a Excel"), /*#__PURE__*/React.createElement("button", {
    onClick: handleExportPDF,
    className: "btn btn-danger btn-sm",
    disabled: !cashControlReportItems || cashControlReportItems.length === 0
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-file-pdf me-2"
  }), "Exportar a PDF"))), /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, "Cierre de Caja")), /*#__PURE__*/React.createElement("div", {
    className: "list-group list-group-flush"
  }, !cashControlReportItems || cashControlReportItems.length === 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center align-items-center h-100 bg-light rounded-3 p-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-muted text-center mb-0"
  }, "No hay datos de cierre disponibles"))), cashControlReportItems.map(cierre => /*#__PURE__*/React.createElement("div", {
    key: cierre.id,
    className: "list-group-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center cursor-pointer flex-wrap gap-2",
    onClick: () => toggleCierre(cierre.id)
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-calendar-alt text-primary me-3"
  }), /*#__PURE__*/React.createElement("span", {
    className: "fw-medium"
  }, obtenerFechaFormateada(cierre.created_at))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-4 flex-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-3 justify-content-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-end",
    style: {
      width: "150px",
      maxWidth: "150px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-muted small mb-0"
  }, "Total Recibido"), /*#__PURE__*/React.createElement("p", {
    className: "fw-bold text-success mb-0"
  }, "$ ", formatoDinero(cierre.total_received))), /*#__PURE__*/React.createElement("div", {
    className: "text-end",
    style: {
      width: "150px",
      maxWidth: "150px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-muted small mb-0"
  }, "Sobrante"), /*#__PURE__*/React.createElement("p", {
    className: `fw-bold mb-0 ${cierre.remaining_amount >= 0 ? "text-success" : "text-danger"}`
  }, "$ ", formatoDinero(cierre.remaining_amount)))), /*#__PURE__*/React.createElement("div", {
    className: "text-end",
    style: {
      width: "200px",
      maxWidth: "200px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-muted small mb-0"
  }, "Entregado por"), /*#__PURE__*/React.createElement("p", {
    className: "fw-medium mb-0",
    style: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, cierre.who_delivers_name)), /*#__PURE__*/React.createElement("div", {
    className: "text-end",
    style: {
      width: "200px",
      maxWidth: "200px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-muted small mb-0"
  }, "Validado por"), /*#__PURE__*/React.createElement("p", {
    className: "fw-medium mb-0",
    style: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, cierre.who_validate_name)), /*#__PURE__*/React.createElement("i", {
    className: `fas ${cierresExpandidos[cierre.id] ? "fa-chevron-up" : "fa-chevron-down"} text-muted`
  }))), cierresExpandidos[cierre.id] && /*#__PURE__*/React.createElement("div", {
    className: "mt-3 ps-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-light rounded p-3 mb-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "h6 fw-medium mb-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-credit-card text-muted me-1"
  }), " ", "Detalle por M\xE9todo de Pago"), /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/React.createElement("table", {
    className: "tables table-bordered mb-0"
  }, /*#__PURE__*/React.createElement("thead", {
    className: "bg-light"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "text-start small fw-medium"
  }, "M\xE9todo de Pago"), /*#__PURE__*/React.createElement("th", {
    className: "text-end small fw-medium"
  }, "Esperado"), /*#__PURE__*/React.createElement("th", {
    className: "text-end small fw-medium"
  }, "Recibido"), /*#__PURE__*/React.createElement("th", {
    className: "text-end small px-2 fw-medium"
  }, "Diferencia"))), /*#__PURE__*/React.createElement("tbody", null, cierre.details && cierre.details.map(detalle => /*#__PURE__*/React.createElement("tr", {
    key: detalle.id
  }, /*#__PURE__*/React.createElement("td", {
    className: "text-start small px-2"
  }, detalle.payment_method_name), /*#__PURE__*/React.createElement("td", {
    className: "text-end small"
  }, "$ ", formatoDinero(detalle.total_expected)), /*#__PURE__*/React.createElement("td", {
    className: "text-end small fw-medium text-success"
  }, "$ ", formatoDinero(detalle.total_received)), /*#__PURE__*/React.createElement("td", {
    className: `text-end small px-2 fw-medium ${detalle.remaining_amount >= 0 ? "text-success" : "text-danger"}`
  }, "$ ", formatoDinero(detalle.remaining_amount))))), /*#__PURE__*/React.createElement("tfoot", {
    className: "bg-light"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    className: "text-start small fw-medium"
  }, "Total"), /*#__PURE__*/React.createElement("td", {
    className: "text-end small fw-medium"
  }, "$ ", formatoDinero(cierre.total_expected)), /*#__PURE__*/React.createElement("td", {
    className: "text-end small fw-medium text-success"
  }, "$ ", formatoDinero(cierre.total_received)), /*#__PURE__*/React.createElement("td", {
    className: `text-end small fw-medium ${cierre.remaining_amount >= 0 ? "text-success" : "text-danger"}`
  }, "$ ", formatoDinero(cierre.remaining_amount)))))))))))));
};