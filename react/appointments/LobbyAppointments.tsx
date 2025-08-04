import React, { use, useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { useFetchAppointments } from "./hooks/useFetchAppointments";
import { appointmentService } from "../../services/api";
import { Panel } from "primereact/panel";
import { ScrollPanel } from "primereact/scrollpanel";
import { AppointmentTableItem } from "../models/models";
import { Paginator } from "primereact/paginator";

const appointmentStatesByKey: Record<string, string> = {
  Pendiente: "Pendiente",
  "En espera de consulta": "En espera de consulta",
  "En espera de examen": "En espera de examen",
  "En consulta": "En consulta",
  "Consulta Finalizada": "Consulta Finalizada",
  Cancelada: "Cancelada",
  Reprogramada: "Reprogramada",
};

// Definir colores directamente en el componente
const stateColors: Record<string, { backgroundColor: string; color: string }> =
  {
    Pendiente: { backgroundColor: "rgb(255, 239, 202)", color: "#000" }, // Amarillo
    "En espera de consulta": { backgroundColor: "#17A2B8", color: "#fff" }, // Azul claro
    "En espera de examen": { backgroundColor: "#6F42C1", color: "#fff" }, // Morado
    "En consulta": { backgroundColor: "#007BFF", color: "#fff" }, // Azul
    "Consulta Finalizada": { backgroundColor: "#28A745", color: "#fff" }, // Verde
    Cancelada: { backgroundColor: "#DC3545", color: "#fff" }, // Rojo
    Reprogramada: { backgroundColor: "#6610F2", color: "#fff" }, // Violeta
  };

export const LobbyAppointments: React.FC = () => {
  const getCustomFilters = () => {
    const today = new Date().toISOString().split("T")[0];
    return {
      sort: "-appointment_date,appointment_time",
      appointmentDate: today,
    };
  };
  const {
    appointments,
    handlePageChange,
    handleSearchChange,
    refresh,
    totalRecords,
    first,
    loading: loadingAppointments,
    perPage,
  } = useFetchAppointments(getCustomFilters);

  const groupedAppointments = appointments.reduce((acc, appointment) => {
    const stateKey = appointment.stateDescription;

    const stateLabel = appointmentStatesByKey[stateKey] || "Sin Cita";

    if (stateLabel !== "Sin Cita") {
      if (!acc[stateLabel]) acc[stateLabel] = [];
      acc[stateLabel].push(appointment);
    }
    return acc;
  }, {} as Record<string, typeof appointments>);

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ color: "#007BFF", marginBottom: "1rem" }}>Lista de Citas</h2>

      {Object.entries(groupedAppointments).map(
        ([stateLabel, stateAppointments]) => (
          <Panel
            key={stateLabel}
            header={stateLabel}
            toggleable
            collapsed
            className="mb-4"
          >
            <ScrollPanel style={{ maxHeight: "400px" }}>
              {/* Contenedor Flexbox para mejor alineación */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                  justifyContent: "center", // Centrar tarjetas en pantallas grandes
                  alignItems: "stretch", // Mantener misma altura en tarjetas
                }}
              >
                {stateAppointments?.map((appointment) => (
                  <Card
                    key={appointment.id}
                    title={
                      <h5>
                        <a href={`verPaciente?id=${appointment.patientId}`}>
                          {appointment.patientName}
                        </a>
                      </h5>
                    }
                    style={{
                      flex: "1 1 300px", // Las tarjetas ocupan el mismo ancho mínimo de 300px
                      maxWidth: "400px", // Evita que sean demasiado grandes
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                      padding: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <p>
                        <strong>Fecha:</strong> {appointment.date}
                      </p>
                      <p>
                        <strong>Hora:</strong> {appointment.time}
                      </p>
                      <p>
                        <strong>Doctor:</strong> {appointment.doctorName}
                      </p>
                    </div>
                    <Tag
                      value={stateLabel}
                      style={{
                        ...stateColors[stateLabel],
                        fontWeight: "bold",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        display: "inline-block",
                        fontSize: "14px",
                        alignSelf: "flex-start", // Asegura que la etiqueta no estire la tarjeta
                      }}
                    />
                  </Card>
                ))}
              </div>
            </ScrollPanel>
          </Panel>
        )
      )}
      <Paginator
        first={first}
        rows={perPage}
        rowsPerPageOptions={[10, 20, 30]}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
