import React from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
export function ConveniosList({
  clinicas,
  onCrear,
  onCancelar
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-wrap gap-3"
  }, clinicas.map(clinica => /*#__PURE__*/React.createElement(Card, {
    key: clinica.id,
    title: clinica.nombre,
    className: "shadow-sm",
    style: {
      width: "250px"
    }
  }, clinica.convenioActivo ? /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar Convenio",
    icon: "pi pi-times",
    className: "p-button-danger w-100",
    onClick: () => onCancelar(clinica.id)
  }) : /*#__PURE__*/React.createElement(Button, {
    label: "Crear Convenio",
    icon: "pi pi-check",
    className: "p-button-success w-100",
    onClick: () => onCrear(clinica.id)
  }))));
}