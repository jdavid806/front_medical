import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { ConveniosList } from "./ConveniosList.js";
import { useConvenios } from "../hooks/useConvenios.js";
export function ConveniosView() {
  const toast = useRef(null);
  const {
    convenios,
    conveniosDisponibles,
    loading,
    error,
    crearConvenio,
    cancelarConvenio
  } = useConvenios(toast);
  const conveniosActivos = convenios.filter(c => c.convenioActivo);
  return /*#__PURE__*/React.createElement("div", {
    className: "container mt-4"
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), loading && /*#__PURE__*/React.createElement(ProgressSpinner, null), error && /*#__PURE__*/React.createElement(Message, {
    severity: "error",
    text: error
  }), !loading && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h4", {
    className: "mt-3 mb-2"
  }, "Convenios Activos"), conveniosActivos.length > 0 ? /*#__PURE__*/React.createElement(ConveniosList, {
    clinicas: conveniosActivos,
    onCrear: crearConvenio,
    onCancelar: cancelarConvenio
  }) : /*#__PURE__*/React.createElement(Message, {
    severity: "info",
    text: "No hay convenios activos"
  }), /*#__PURE__*/React.createElement("h4", {
    className: "mt-4 mb-2"
  }, "Aliados de la red MedicalSoft+ Disponibles"), conveniosDisponibles.length > 0 ? /*#__PURE__*/React.createElement(ConveniosList, {
    clinicas: conveniosDisponibles,
    onCrear: crearConvenio,
    onCancelar: cancelarConvenio
  }) : /*#__PURE__*/React.createElement(Message, {
    severity: "info",
    text: "No hay aliados disponibles para convenios"
  })));
}