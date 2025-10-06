import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
const CitasHoy = () => {
  const [citas, setCitas] = useState([]);
  useEffect(() => {
    // Replace this with actual data fetching from your API or data source
    const data = [{
      "Nombre": "Juan Pérez",
      "Numero de documento": "108574152",
      "Fecha Consulta": "2025-10-18",
      "Hora Consulta": "08:00 AM",
      "Profesional asignado": "Camilo Villacorte",
      "Entidad": "Entidad 1",
      "Estado": "Pendiente"
    }];
    setCitas(data);
  }, []);
  const header = "Citas de Hoy";
  return /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: citas,
    header: header
  }, /*#__PURE__*/React.createElement(Column, {
    field: "Nombre",
    header: "Nombre"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "Numero de documento",
    header: "N\xFAmero de Documento"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "Fecha Consulta",
    header: "Fecha Consulta"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "Hora Consulta",
    header: "Hora Consulta"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "Profesional asignado",
    header: "Profesional Asignado"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "Entidad",
    header: "Entidad"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "Estado",
    header: "Estado"
  })));
};
export default CitasHoy;