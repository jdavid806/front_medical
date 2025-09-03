import React from "react";
export const ByEntityFormat = ({
  mainNode,
  dateRange
}) => {
  // Función para formatear currency (igual que en el primer componente)
  const formatCurrency = value => {
    const formatted = new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2
    }).format(value);
    return formatted.replace("RD$", "$");
  };

  // Función para formatear fechas
  const formatDate = (date, includeYear = false) => {
    // Implementa tu lógica de formato de fecha aquí
    if (typeof date === "string") {
      date = new Date(date);
    }
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    if (includeYear) {
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return `${day}/${month}`;
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "2rem",
      border: "1px solid #ddd",
      padding: "1rem"
    }
  }, /*#__PURE__*/React.createElement("style", null, `
          @media print {
            body * {
              visibility: hidden;
            }
            .print-container, .print-container * {
              visibility: visible;
            }
            .print-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .user-table-container {
              page-break-inside: avoid;
            }
          }
          
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 25px;
            font-size: 12px;
          }
          th { 
            color: white; 
            padding: 10px; 
            text-align: left;
            border: 1px solid #dee2e6;
            font-weight: bold;
          }
          td { 
            padding: 10px 8px; 
            border: 1px solid #dee2e6;
          }
          
          .summary-table {
            width: 100%; 
            border-collapse: collapse; 
            font-size: 13px;
            margin-bottom: 20px;
          }
          
          .summary-table td {
            padding: 8px 0;
            border-bottom: none;
          }
          
          .currency {
            text-align: right;
          }
          
          .user-header {
            text-align: center; 
            margin-bottom: 1rem; 
            background-color: #424a51; 
            color: white; 
            padding: 10px;
            border-radius: 4px;
          }
        `), /*#__PURE__*/React.createElement("div", {
    className: "print-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "user-header"
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0
    }
  }, "Facturaci\xF3n por entidad")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "20px",
      marginTop: "20px"
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "summary-table mr-3"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Facturador:")), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, mainNode.biller)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "# factura")), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, mainNode.invoice_code)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "4px"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Entidad:")), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, mainNode.entity.name)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Neto a pagar:")), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, formatCurrency(mainNode.total_amount))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Monto pagado:")), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, formatCurrency(mainNode.paid_amount))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Fecha de elaboraci\xF3n:")), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, formatDate(mainNode.elaboration_date, true))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Fecha de vencimiento:")), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, mainNode.due_date))))), /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "Paciente"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "C\xF3digo de factura"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "Productos"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "Fecha de creaci\xF3n"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "Fecha de vencimiento"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "Entidad"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "C\xF3digo entidad"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "Estado"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "Monto"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "Monto restante"))), /*#__PURE__*/React.createElement("tbody", null, mainNode.invoice_linked.map((item, index) => /*#__PURE__*/React.createElement("tr", {
    key: index
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "left"
    }
  }, item.patient_full_name ?? ""), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "left"
    }
  }, item.invoice_code ?? ""), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "left"
    }
  }, item.products ?? ""), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "left"
    }
  }, formatDate(item.created_at, true) ?? ""), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "left"
    }
  }, item.due_date ?? ""), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "left"
    }
  }, item.entity.name ?? ""), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "right"
    }
  }, item.entity.entity_code ?? ""), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "right"
    }
  }, item.status ?? ""), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "right"
    }
  }, formatCurrency(item?.total_amount || 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "right"
    }
  }, formatCurrency(item.remaining_amount || 0))))))));
};