import React from "react";

export const ByEntityFormat: React.FC<any> = ({
  mainNode,
  dateRange,
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

  return (
    <div style={{ 
            marginBottom: "2rem",
            border: "1px solid #ddd",
            padding: "1rem"
          }}>
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
        `}
      </style>

      <div className="print-container">
        {/* Encabezado con estilo similar al primer componente */}
        <div className="user-header">
          <h2 style={{ margin: 0 }}>Facturación por entidad</h2>
        </div>

        {/* Tabla de resumen */}
        <div style={{ marginBottom: "20px", marginTop: "20px" }}>
          <table className="summary-table mr-3">
            <tbody>
              <tr>
                <td style={{ padding: "8px 0" }}>
                  <strong>Facturador:</strong>
                </td>
                <td style={{ padding: "8px 0" }}>
                  {mainNode.biller}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0" }}>
                  <strong># factura</strong>
                </td>
                <td style={{ padding: "8px 0" }}>
                  {mainNode.invoice_code}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "4px" }}>
                  <strong>Entidad:</strong>
                </td>
                <td style={{ padding: "8px 0" }}>
                  {mainNode.entity.name}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0" }}>
                  <strong>Neto a pagar:</strong>
                </td>
                <td style={{ padding: "8px 0" }}>
                  {formatCurrency(mainNode.total_amount)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0" }}>
                  <strong>Monto pagado:</strong>
                </td>
                <td style={{ padding: "8px 0" }}>
                  {formatCurrency(mainNode.paid_amount)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0" }}>
                  <strong>Fecha de elaboración:</strong>
                </td>
                <td style={{ padding: "8px 0" }}>
                  {formatDate(mainNode.elaboration_date, true)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0" }}>
                  <strong>Fecha de vencimiento:</strong>
                </td>
                <td style={{ padding: "8px 0" }}>
                  {mainNode.due_date}
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
                Paciente
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
                Código de factura
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
                Productos
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
                Fecha de creación
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
                Fecha de vencimiento
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
                Entidad
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
                Código entidad
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
                Estado
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
                Monto
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
                Monto restante
              </th>
            </tr>
          </thead>
          <tbody>
            {mainNode.invoice_linked.map((item, index) => (
              <tr key={index}>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  {item.patient_full_name ?? ""}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  {item.invoice_code ?? ""}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  {item.products ?? ""}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  {formatDate(item.created_at, true) ?? ""}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  {item.due_date  ?? ""}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  {item.entity.name ?? ""}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "right",
                  }}
                >
                  {item.entity.entity_code ?? ""}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "right",
                  }}
                >
                  {item.status ?? ""}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "right",
                  }}
                >
                  {formatCurrency(item?.total_amount || 0)}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "right",
                  }}
                >
                  {formatCurrency(item.remaining_amount || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
