import React from "react";
const dayNames = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  7: "Domingo"
};
export const NotAvailable = ({
  availabilities
}) => {
  const formatDays = days => {
    // Ordenamos y convertimos a nombres
    return days.sort().map(d => dayNames[d]).join(", ");
  };
  const formatHour = time => time.slice(0, 5); // "08:00"

  return /*#__PURE__*/React.createElement("div", {
    className: "not-available-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "not-available-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "clock-icon"
  }, "\u23F0"), /*#__PURE__*/React.createElement("h1", null, "Nuestra p\xE1gina no est\xE1 disponible en este horario"), /*#__PURE__*/React.createElement("p", null, "Lamentamos los inconvenientes, pero nuestro sitio web solo est\xE1 disponible durante nuestro horario de atenci\xF3n."), /*#__PURE__*/React.createElement("div", {
    className: "horario"
  }, /*#__PURE__*/React.createElement("h2", null, "Horarios de atenci\xF3n:"), availabilities.length > 0 ? availabilities.map(a => /*#__PURE__*/React.createElement("p", {
    key: a.id
  }, /*#__PURE__*/React.createElement("strong", null, formatDays(a.days_of_week)), ":", " ", formatHour(a.start_time), " - ", formatHour(a.end_time))) : /*#__PURE__*/React.createElement("p", null, "No hay horarios configurados")), /*#__PURE__*/React.createElement("p", null, "Por favor, vuelva a visitarnos durante nuestro horario de funcionamiento."), /*#__PURE__*/React.createElement("div", {
    className: "contacto"
  }, /*#__PURE__*/React.createElement("p", null, "Para consultas urgentes, cont\xE1ctenos a:", " ", /*#__PURE__*/React.createElement("strong", null, "info@empresa.com")))), /*#__PURE__*/React.createElement("style", {
    jsx: true
  }, `
        .not-available-body {
          background-color: #f8f9fa;
          color: #333;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
        }

        .not-available-container {
          text-align: center;
          max-width: 600px;
          padding: 40px;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
        }

        .clock-icon {
          font-size: 64px;
          margin-bottom: 20px;
          color: #6c757d;
        }

        h1 {
          font-size: 28px;
          margin-bottom: 15px;
          color: #495057;
          font-weight: 500;
        }

        p {
          font-size: 18px;
          line-height: 1.6;
          margin-bottom: 25px;
          color: #6c757d;
        }

        .horario {
          background-color: #f1f3f5;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          font-size: 16px;
        }

        .horario h2 {
          font-size: 18px;
          margin-bottom: 8px;
          color: #495057;
        }

        .horario p {
          margin-bottom: 8px;
          font-size: 16px;
        }

        .contacto {
          margin-top: 25px;
          font-size: 16px;
          color: #6c757d;
        }
      `));
};