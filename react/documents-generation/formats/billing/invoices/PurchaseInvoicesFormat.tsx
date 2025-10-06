import React from "react";
import { statusInvoices } from "../../../../../services/commons";

interface DetalleFactura {
  cantidad: number;
  description: string;
  precioUnitario: number;
  tax: number;
}

interface Factura {
  numeroFactura: string;
  fecha: string;
  proveedor: string;
  tipoFactura: string;
  detalles: DetalleFactura[];
  monto: number;
  discuount: number;
  withholding_tax: number;
  tax: number;
  subtotal: number;
}

interface PrintInvoiceProps {
  invoice: Factura;
}

export const PurchaseInvoicesFormat: React.FC<PrintInvoiceProps> = ({
  invoice,
}) => {
  // Función para formatear currency (igual que en el primer componente)
  const formatCurrency = (value: number) => {
    const formatted = new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
    }).format(value);
    return formatted.replace("RD$", "$");
  };

  // Función para formatear fechas
  const formatDate = (
    date: Date | string,
    includeYear: boolean = false
  ): string => {
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

  return (
    <div
      style={{
        marginBottom: "2rem",
        border: "1px solid #ddd",
        padding: "1rem",
      }}
    >
      <style>
        {`
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

          .invoice-number {
            font-size: 16px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 15px;
            padding: 8px 0;
            border-bottom: 2px solid #e9ecef;
          }

          .seccion-final {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            align-items: flex-start;
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

          .totales-container {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e9ecef;
            width: 55%;
          }

          .fila-total {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 4px 0;
          }

          .etiqueta-total {
            font-weight: 500;
            color: #495057;
          }

          .valor-total {
            font-weight: 500;
            text-align: right;
            min-width: 120px;
          }

          .total-final {
            border-top: 2px solid #dee2e6;
            margin-top: 8px;
            padding-top: 8px;
            font-weight: 700;
            font-size: 14px;
            color: #2c3e50;
          }
        `}
      </style>

      <div className="print-container">
        {/* Encabezado con estilo similar al primer componente */}
        <div className="user-header">
          <h2 style={{ margin: 0 }}>Factura de compra</h2>
        </div>

        {/* Número de factura como subtítulo */}
        <div>
          <h3>Factura #: {invoice.numeroFactura}</h3>
        </div>

        {/* Tabla de resumen */}
        <div style={{ marginBottom: "20px", marginTop: "20px" }}>
          <table className="summary-table mr-3">
            <tbody>
              <tr>
                <td style={{ padding: "8px 0" }}>
                  <strong>Fecha:</strong>
                </td>
                <td style={{ padding: "8px 0" }}>
                  {formatDate(invoice.fecha, true)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0" }}>
                  <strong>Cliente:</strong>
                </td>
                <td style={{ padding: "8px 0" }}>{invoice.proveedor}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0" }}>
                  <strong>Estado:</strong>
                </td>
                <td style={{ padding: "8px 0" }}>
                  {statusInvoices[invoice.estado]}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tabla de detalles con gridlines como el primer componente */}
        <table>
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #dee2e6",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                Producto/Cuenta contable
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #dee2e6",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                Cantidad
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #dee2e6",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                Precio Unitario
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #dee2e6",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                Valor
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #dee2e6",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                Descuento
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #dee2e6",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                Impuesto
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #dee2e6",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.detalles.map((detail: any, index) => (
              <tr key={index}>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  {detail.productoNombre || "--"}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  {detail.cantidad}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "right",
                  }}
                >
                  {formatCurrency(detail.precioUnitario || 0)}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "right",
                  }}
                >
                  {formatCurrency(detail.precioUnitario * detail.cantidad)}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "right",
                  }}
                >
                  {detail.discount || 0}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "right",
                  }}
                >
                  {formatCurrency(detail.tax || 0)}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "right",
                  }}
                >
                  {formatCurrency(detail.total || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Sección final */}
        <div className="seccion-final">
          {/* <div className="info-qr">
            <div className="qr-image">[Código QR]</div>
          </div> */}

          <div className="total-container">
            <div style={{ marginBottom: "20px", marginTop: "20px" }}>
              <table className="summary-table mr-3">
                <tbody>
                  <tr>
                    <td style={{ padding: "8px 0" }}>
                      <strong>Subtotal:</strong>{" "}
                      {formatCurrency(invoice.subtotal)}
                    </td>
                    <td style={{ padding: "8px 0" }}>
                      <strong>Descuentos:</strong>{" "}
                      {formatCurrency(invoice.discuount)}
                    </td>
                    <td style={{ padding: "8px 0" }}>
                      <strong>Impuestos:</strong> {formatCurrency(invoice.tax)}
                    </td>
                    <td style={{ padding: "8px 0" }}>
                      <strong>Retenciones:</strong>{" "}
                      {formatCurrency(invoice.withholding_tax)}
                    </td>
                    <td style={{ padding: "8px 0" }}>
                      <strong>Total:</strong> {formatCurrency(invoice.monto)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
