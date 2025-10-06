import React from "react";
import { statusInvoices } from "../../../../../services/commons.js";
export const PurchaseInvoicesFormat = ({
  invoice
}) => {
  console.log("invoice => ", invoice);
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

          .seccion-final {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
          }

          .info-qr {
            width: 40%;
          }

          .qr-image {
            width: 120px;
            height: 120px;
            background-color: #f0f0f0;
            border: 1px dashed #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
          }

          .codigo-seguridad {
            font-weight: bold;
            margin-bottom: 15px;
          }

          .totales {
            text-align: right;
            width: 65%;
          }

          .fila-total {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 5px;
          }

          .etiqueta-total {
            font-weight: bold;
            width: 150px;
          }

          .valor-total {
            width: 120px;
            text-align: right;
          }
        `), /*#__PURE__*/React.createElement("div", {
    className: "print-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "user-header"
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0
    }
  }, "Factura de compra")), /*#__PURE__*/React.createElement("div", {
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
  }, /*#__PURE__*/React.createElement("strong", null, "# Factura:")), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, invoice.numeroFactura)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Fecha:")), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, formatDate(invoice.fecha, true))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Cliente:")), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, invoice.proveedor)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Estado:")), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 0"
    }
  }, statusInvoices[invoice.estado]))))), /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "Producto/Cuenta contable"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "Cantidad"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "Precio Unitario"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "Valor"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "Descuento"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "Impuesto"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "Total"))), /*#__PURE__*/React.createElement("tbody", null, invoice.detalles.map((detail, index) => /*#__PURE__*/React.createElement("tr", {
    key: index
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "left"
    }
  }, detail.productoNombre || "--"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "left"
    }
  }, detail.cantidad), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "right"
    }
  }, formatCurrency(detail.precioUnitario || 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "right"
    }
  }, formatCurrency(detail.precioUnitario * detail.cantidad)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "right"
    }
  }, detail.discount || 0), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "right"
    }
  }, formatCurrency(detail.tax || 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "right"
    }
  }, formatCurrency(detail.total || 0)))))), /*#__PURE__*/React.createElement("div", {
    className: "seccion-final"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-qr"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qr-image"
  }, "[C\xF3digo QR]"), /*#__PURE__*/React.createElement("div", {
    className: "codigo-seguridad"
  }, "C\xF3digo de seguridad: S/DQdu")), /*#__PURE__*/React.createElement("div", {
    className: "totales"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fila-total"
  }, /*#__PURE__*/React.createElement("div", {
    className: "etiqueta-total"
  }, "Total:"), /*#__PURE__*/React.createElement("div", {
    className: "valor-total"
  }, formatCurrency(invoice.monto || 0)))))));
};