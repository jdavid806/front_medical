import React from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
export function ConveniosList({
  clinicas,
  onCrear,
  onCancelar
}) {
  const [selectedModule, setSelectedModule] = useState({});
  const modules = [{
    label: "Farmacia",
    value: "farmacia"
  }, {
    label: "Laboratorio",
    value: "laboratorio"
  }, {
    label: "Urgencias",
    value: "urgencias"
  }];
  const tenantA = 1; // fijo por ahora, luego se puede obtener del contexto de login

  return /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-wrap gap-3"
  }, clinicas.map(clinica => /*#__PURE__*/React.createElement(Card, {
    key: clinica.id,
    title: clinica.nombre,
    className: "shadow-sm",
    style: {
      width: "280px"
    }
  }, clinica.convenioActivo ? /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar Convenio",
    icon: "pi pi-times",
    className: "p-button-danger w-100",
    onClick: () => onCancelar(clinica.idConvenio)
  }) : /*#__PURE__*/React.createElement("div", {
    className: "flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement(Dropdown, {
    value: selectedModule[clinica.id],
    options: modules,
    onChange: e => setSelectedModule({
      ...selectedModule,
      [clinica.id]: e.value
    }),
    placeholder: "Seleccione m\xF3dulo",
    className: "w-100 mb-2"
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Crear Convenio",
    icon: "pi pi-check",
    className: "p-button-success w-100",
    disabled: !selectedModule[clinica.id],
    onClick: () => onCrear(clinica.id, selectedModule[clinica.id])
  })))));
}