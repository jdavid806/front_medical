import React from "react";

interface SpecialtyDoctorEntry {
  specialty: string;
  doctorName: string;
  count: number;
  appointments: any[];
}

interface AppointmentsSpecialtyDoctorVisualizationProps {
  entries: SpecialtyDoctorEntry[];
  state: string;
  dateRange: [Date | null, Date | null];
}

export const SummaryFormat: React.FC<AppointmentsSpecialtyDoctorVisualizationProps> = ({
  entries,
  state,
  dateRange
}) => {
  if (!entries || entries.length === 0) {
    return (
      <div
        className="flex justify-content-center align-items-center"
        style={{ height: "200px" }}
      >
        <span>No hay datos disponibles para el estado {state}</span>
      </div>
    );
  }

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const dateTemplate = (rowData: any) => {
    return (
      new Date(rowData.created_at).toLocaleDateString("es-DO") +
      ", " +
      (rowData.appointment_time || "")
    );
  };

  // Calcular total de citas para este estado
  const totalAppointments = entries.reduce((sum, entry) => sum + entry.count, 0);

  return (
    <div className="appointments-specialty-doctor-visualization">
      {/* Header con información del reporte */}
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
        {/* Fecha de generación */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "15px",
            fontSize: "12px",
            color: "#495057",
          }}
        >
          <strong>Generado el:</strong> {formatDate(new Date())}
        </div>

        <h1
          style={{
            color: "#2c3e50",
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Reporte de Citas por Especialidad y Médico
        </h1>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "3rem",
            fontSize: "14px",
            color: "#6c757d",
            flexWrap: "wrap",
          }}
        >
          <div>
            <strong>Estado:</strong> {state}
          </div>
          <div>
            <strong>Fecha de inicio:</strong> {formatDate(dateRange[0])}
          </div>
          <div>
            <strong>Fecha de fin:</strong> {formatDate(dateRange[1])}
          </div>
          <div>
            <strong>Total citas:</strong> {totalAppointments}
          </div>
        </div>
      </div>

      {/* Tabla resumen por especialidad y médico */}
      <div
        className="state-container"
        style={{
          marginBottom: "3rem",
          border: "1px solid #ddd",
          padding: "1.5rem",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            backgroundColor: "#424a51",
            color: "white",
            padding: "15px",
            borderRadius: "4px",
            fontSize: "18px",
          }}
        >
          Estado: {state} - Total: {totalAppointments} citas
        </h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "12px",
            marginBottom: "2rem",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "12px",
                  backgroundColor: "rgb(66, 74, 81)",
                  color: "white",
                  fontWeight: "normal",
                  border: "1px solid #dee2e6",
                }}
              >
                Especialidad
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "12px",
                  backgroundColor: "rgb(66, 74, 81)",
                  color: "white",
                  fontWeight: "normal",
                  border: "1px solid #dee2e6",
                }}
              >
                Médico
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "12px",
                  backgroundColor: "rgb(66, 74, 81)",
                  color: "white",
                  fontWeight: "normal",
                  border: "1px solid #dee2e6",
                }}
              >
                Cantidad
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index}>
                <td
                  style={{
                    padding: "10px 8px",
                    borderBottom: "1px solid #eee",
                    textAlign: "left",
                    border: "1px solid #dee2e6",
                  }}
                >
                  {entry.specialty}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    borderBottom: "1px solid #eee",
                    textAlign: "left",
                    border: "1px solid #dee2e6",
                  }}
                >
                  {entry.doctorName}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    borderBottom: "1px solid #eee",
                    textAlign: "center",
                    border: "1px solid #dee2e6",
                    fontWeight: "bold",
                  }}
                >
                  {entry.count}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}>
              <td
                colSpan={2}
                style={{
                  padding: "12px 8px",
                  textAlign: "right",
                  border: "1px solid #dee2e6",
                }}
              >
                Total {state}:
              </td>
              <td
                style={{
                  padding: "12px 8px",
                  textAlign: "center",
                  border: "1px solid #dee2e6",
                }}
              >
                {totalAppointments}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Tablas detalladas para cada combinación especialidad-médico */}
        {entries.map((entry, entryIndex) => (
          <div
            key={entryIndex}
            className="specialty-doctor-container"
            style={{
              marginBottom: "2rem",
              padding: "1rem",
              border: "1px solid #e9ecef",
              borderRadius: "6px",
              backgroundColor: "#f8f9fa",
            }}
          >
            <h3
              style={{
                textAlign: "center",
                marginBottom: "1rem",
                color: "#2c3e50",
                fontSize: "16px",
                padding: "10px",
                backgroundColor: "#e9ecef",
                borderRadius: "4px",
              }}
            >
              {entry.specialty} - Dr. {entry.doctorName} ({entry.count} citas)
            </h3>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "11px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      backgroundColor: "rgb(66, 74, 81)",
                      color: "white",
                      fontWeight: "normal",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    Paciente
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      backgroundColor: "rgb(66, 74, 81)",
                      color: "white",
                      fontWeight: "normal",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    Documento
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      backgroundColor: "rgb(66, 74, 81)",
                      color: "white",
                      fontWeight: "normal",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    Ciudad
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      backgroundColor: "rgb(66, 74, 81)",
                      color: "white",
                      fontWeight: "normal",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    Producto
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      backgroundColor: "rgb(66, 74, 81)",
                      color: "white",
                      fontWeight: "normal",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    Fecha y Hora
                  </th>
                </tr>
              </thead>
              <tbody>
                {entry.appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td
                      style={{
                        padding: "8px 6px",
                        borderBottom: "1px solid #eee",
                        textAlign: "left",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {`${appointment.patient.first_name} ${appointment.patient.last_name}`}
                    </td>
                    <td
                      style={{
                        padding: "8px 6px",
                        borderBottom: "1px solid #eee",
                        textAlign: "left",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {appointment.patient.document_number || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "8px 6px",
                        borderBottom: "1px solid #eee",
                        textAlign: "left",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {appointment.patient.city_id || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "8px 6px",
                        borderBottom: "1px solid #eee",
                        textAlign: "left",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {appointment.product_id || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "8px 6px",
                        borderBottom: "1px solid #eee",
                        textAlign: "left",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {dateTemplate(appointment)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};