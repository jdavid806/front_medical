import React from "react";
type Availability = {
  id: number;
  days_of_week: number[];
  start_time: string;
  end_time: string;
};

type NotAvailableProps = {
  availabilities: Availability[];
};

const dayNames: Record<number, string> = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  7: "Domingo",
};

export const NotAvailable: React.FC<NotAvailableProps> = ({ availabilities }) => {
  const formatDays = (days: number[]) => {
    // Ordenamos y convertimos a nombres
    return days.sort().map((d) => dayNames[d]).join(", ");
  };

  const formatHour = (time: string) => time.slice(0, 5); // "08:00"

  return (
    <div className="not-available-body">
      <div className="not-available-container">
        <div className="clock-icon">⏰</div>
        <h1>Nuestra página no está disponible en este horario</h1>
        <p>
          Lamentamos los inconvenientes, pero nuestro sitio web solo está
          disponible durante nuestro horario de atención.
        </p>

        <div className="horario">
          <h2>Horarios de atención:</h2>
          {availabilities.length > 0 ? (
            availabilities.map((a) => (
              <p key={a.id}>
                <strong>{formatDays(a.days_of_week)}</strong>:{" "}
                {formatHour(a.start_time)} - {formatHour(a.end_time)}
              </p>
            ))
          ) : (
            <p>No hay horarios configurados</p>
          )}
        </div>

        <p>Por favor, vuelva a visitarnos durante nuestro horario de funcionamiento.</p>

        <div className="contacto">
          <p>
            Para consultas urgentes, contáctenos a:{" "}
            <strong>info@empresa.com</strong>
          </p>
        </div>
      </div>

    </div>
  );
};
