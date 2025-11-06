import React from "react";
import { getAge } from "../../../../../services/utilidades";
import { genders } from "../../../../../services/commons.js";

export const Diagnosis: React.FC<any> = ({ data, dateRange }) => {
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
        `}
      </style>

      <div className="print-container">
        {/* Encabezado con estilo similar al primer componente */}

        <div
          style={{
            position: "relative",
            textAlign: "center",
            marginBottom: "2rem",
            padding: "1.5rem",
            backgroundColor: "#f8f9fa",
            border: "1px solid #dee2e6",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "15px",
              fontSize: "12px",
              color: "#495057",
            }}
          >
            <strong>Generado el:</strong> {formatDate(new Date(), true)}
          </div>

          <h1
            style={{
              color: "#2c3e50",
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            Reporte de diagnosticos
          </h1>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "3rem",
              fontSize: "16px",
              color: "#575e64ff",
            }}
          ></div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "3rem",
              fontSize: "14px",
              color: "#6c757d",
            }}
          >
            <div>
              <strong>Fecha inicio:</strong> {formatDate(dateRange[0], true)}
            </div>
            <div>
              <strong>Fecha fin:</strong> {formatDate(dateRange[1], true)}
            </div>
          </div>
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
                N° Documento
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
                Edad
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
                Genero
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
                Motivo de cita
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
                Fecha de cita
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
                Especialista
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
                Especialidad
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
                Diagnostico
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item: any, index: any) => (
              <tr key={index}>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  {`${
                    item?.appointment?.patient?.first_name?.toLowerCase() ??
                    ""
                  } ${
                    item?.appointment?.patient?.middle_name?.toLowerCase() ??
                    ""
                  } ${
                    item?.appointment?.patient?.last_name?.toLowerCase() ??
                    ""
                  } ${
                    item?.appointment?.patient?.second_last_name?.toLowerCase() ??
                    ""
                  }`}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  {item.appointment?.patient?.document_number ?? ""}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  {getAge(item?.appointment?.patient?.date_of_birth) ?? ""}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  {genders[item?.appointment?.patient?.gender] ?? "Sin iniciar"}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  {item.appointment?.consultation_type ?? ""}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  {item.appointment?.appointment_date +
                    ", " +
                    item.appointment?.appointment_time}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  {`${
                    item?.appointment?.user_availability?.user?.first_name ?? ""
                  } ${
                    item?.appointment?.user_availability?.user?.middle_name ??
                    ""
                  } ${
                    item?.appointment?.user_availability?.user?.last_name ?? ""
                  } ${
                    item?.appointment?.user_availability?.user
                      ?.second_last_name ?? ""
                  }`}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  {item.appointment?.user_availability?.user?.specialty?.name ?? "--"}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  {((item?.diagnosis_main ?? "-") + "-" + (item?.cie11_description?.toLowerCase() ?? "-")) || "--"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
