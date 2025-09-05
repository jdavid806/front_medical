import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import { ConveniosList } from "./ConveniosList.js";
import { useConvenios } from "../hooks/useConvenios.js";
export function ConveniosView() {
  const {
    clinicas,
    loading,
    error,
    crearConvenio,
    cancelarConvenio
  } = useConvenios();
  return /*#__PURE__*/React.createElement("div", {
    className: "container mt-4"
  }, loading && /*#__PURE__*/React.createElement(ProgressSpinner, null), error && /*#__PURE__*/React.createElement(Message, {
    severity: "error",
    text: error
  }), !loading && /*#__PURE__*/React.createElement(ConveniosList, {
    clinicas: clinicas,
    onCrear: crearConvenio,
    onCancelar: cancelarConvenio
  }));
}