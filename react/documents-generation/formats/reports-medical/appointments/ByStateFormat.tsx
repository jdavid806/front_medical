import React from "react";

interface AppointmentsVisualizationProps {
  appointments: any[];
  state: string;
  dateRange: [Date | null, Date | null];
}

export const ByStateFormat: React.FC<AppointmentsVisualizationProps> = ({
  appointments,
  state,
  dateRange
}) => {
  if (!appointments || appointments.length === 0) {
    return (
      <div
        className="flex justify-content-center align-items-center"
        style={{ height: "200px" }}
      >
        <span>No hay citas en el estado {state}</span>
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

  return (
    <div className="appointments-visualization">
      {/* Header con información del reporte - Similar al de exportación PDF */}
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
          Reporte de Citas - {state}
        </h1>

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
            <strong>Fecha de inicio:</strong> {formatDate(dateRange[0])}
          </div>
          <div>
            <strong>Fecha de fin:</strong> {formatDate(dateRange[1])}
          </div>
        </div>
      </div>

      {/* Tabla de citas - Estilo similar al de exportación PDF */}
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
              Paciente
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
              Documento
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
              Ciudad
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
              Especialista
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
              Producto
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
              Fecha y Hora
            </th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td
                style={{
                  padding: "10px 8px",
                  borderBottom: "1px solid #eee",
                  textAlign: "left",
                  border: "1px solid #dee2e6",
                }}
              >
                {`${appointment.patient.first_name} ${appointment.patient.last_name}`}
              </td>
              <td
                style={{
                  padding: "10px 8px",
                  borderBottom: "1px solid #eee",
                  textAlign: "left",
                  border: "1px solid #dee2e6",
                }}
              >
                {appointment.patient.document_number || "N/A"}
              </td>
              <td
                style={{
                  padding: "10px 8px",
                  borderBottom: "1px solid #eee",
                  textAlign: "left",
                  border: "1px solid #dee2e6",
                }}
              >
                {appointment.patient.city_id || "N/A"}
              </td>
              <td
                style={{
                  padding: "10px 8px",
                  borderBottom: "1px solid #eee",
                  textAlign: "left",
                  border: "1px solid #dee2e6",
                }}
              >
                {appointment.assigned_user_availability?.user
                  ? `${
                      appointment.assigned_user_availability.user.first_name || ""
                    } ${
                      appointment.assigned_user_availability.user.last_name || ""
                    }`
                  : "N/A"}
              </td>
              <td
                style={{
                  padding: "10px 8px",
                  borderBottom: "1px solid #eee",
                  textAlign: "left",
                  border: "1px solid #dee2e6",
                }}
              >
                {appointment.assigned_user_availability?.user?.specialty
                  ?.name || "N/A"}
              </td>
              <td
                style={{
                  padding: "10px 8px",
                  borderBottom: "1px solid #eee",
                  textAlign: "left",
                  border: "1px solid #dee2e6",
                }}
              >
                {appointment.product.name || "N/A"}
              </td>
              <td
                style={{
                  padding: "10px 8px",
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
  );
};