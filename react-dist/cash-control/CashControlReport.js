import React, { useState } from 'react';
import { useCashControlReport } from "./hooks/useCashControlReport.js";
export const CierreCaja = () => {
  const {
    cashControlReportItems
  } = useCashControlReport();

  // Estado para controlar qué cierres están expandidos
  const [cierresExpandidos, setCierresExpandidos] = useState({});

  // Función para alternar la expansión de un cierre
  const toggleCierre = id => {
    setCierresExpandidos({
      ...cierresExpandidos,
      [id]: !cierresExpandidos[id]
    });
  };

  // Formatear dinero en formato local
  const formatoDinero = cantidad => {
    return cantidad.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN'
    });
  };

  // Obtener fecha formateada
  const obtenerFechaFormateada = fechaStr => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  if (!cashControlReportItems || cashControlReportItems.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-center align-items-center h-100 bg-light rounded-3 p-4"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-muted text-center mb-0"
    }, "No hay datos de cierre disponibles"));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "card shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, "Cierre de Caja")), /*#__PURE__*/React.createElement("div", {
    className: "list-group list-group-flush"
  }, cashControlReportItems.map(cierre => /*#__PURE__*/React.createElement("div", {
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
    className: "text-end"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-muted small mb-0"
  }, "Total Recibido"), /*#__PURE__*/React.createElement("p", {
    className: "fw-bold text-success mb-0"
  }, formatoDinero(cierre.total_received))), /*#__PURE__*/React.createElement("div", {
    className: "text-end"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-muted small mb-0"
  }, "Sobrante"), /*#__PURE__*/React.createElement("p", {
    className: `fw-bold mb-0 ${cierre.remaining_amount >= 0 ? 'text-success' : 'text-danger'}`
  }, formatoDinero(cierre.remaining_amount)))), /*#__PURE__*/React.createElement("div", {
    className: "text-end"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-muted small mb-0"
  }, "Entregado por"), /*#__PURE__*/React.createElement("p", {
    className: "fw-medium mb-0"
  }, "Nombre del usuario entregador")), /*#__PURE__*/React.createElement("div", {
    className: "text-end"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-muted small mb-0"
  }, "Validado por"), /*#__PURE__*/React.createElement("p", {
    className: "fw-medium mb-0"
  }, "Nombre del usuario validador")), /*#__PURE__*/React.createElement("i", {
    className: `fas ${cierresExpandidos[cierre.id] ? 'fa-chevron-up' : 'fa-chevron-down'} text-muted`
  }))), cierresExpandidos[cierre.id] && /*#__PURE__*/React.createElement("div", {
    className: "mt-3 ps-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-light rounded p-3 mb-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "h6 fw-medium mb-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-credit-card text-muted me-1"
  }), " Detalle por M\xE9todo de Pago"), /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/React.createElement("table", {
    className: "table table-bordered mb-0"
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
  }, "Metodo de pago"), /*#__PURE__*/React.createElement("td", {
    className: "text-end small"
  }, formatoDinero(detalle.total_expected)), /*#__PURE__*/React.createElement("td", {
    className: "text-end small fw-medium text-success"
  }, formatoDinero(detalle.total_received)), /*#__PURE__*/React.createElement("td", {
    className: `text-end small px-2 fw-medium ${detalle.remaining_amount >= 0 ? 'text-success' : 'text-danger'}`
  }, formatoDinero(detalle.remaining_amount))))), /*#__PURE__*/React.createElement("tfoot", {
    className: "bg-light"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    className: "text-start small fw-medium"
  }, "Total"), /*#__PURE__*/React.createElement("td", {
    className: "text-end small fw-medium"
  }, formatoDinero(cierre.total_expected)), /*#__PURE__*/React.createElement("td", {
    className: "text-end small fw-medium text-success"
  }, formatoDinero(cierre.total_received)), /*#__PURE__*/React.createElement("td", {
    className: `text-end small fw-medium ${cierre.remaining_amount >= 0 ? 'text-success' : 'text-danger'}`
  }, formatoDinero(cierre.remaining_amount))))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-sm btn-outline-primary"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-print me-1"
  }), " Imprimir")))))));
};