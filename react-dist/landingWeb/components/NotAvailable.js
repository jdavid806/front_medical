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
  }, /*#__PURE__*/React.createElement("p", null, "Para consultas urgentes, cont\xE1ctenos a:", " ", /*#__PURE__*/React.createElement("strong", null, "info@empresa.com")))));
};