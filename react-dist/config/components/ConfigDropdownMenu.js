import React, { useState } from "react";
export const ConfigDropdownMenu = ({
  title,
  onItemClick
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const items = [{
    text: 'Entidad',
    target: '#modalEntidad'
  }, {
    text: 'Procedimiento',
    target: '#modalNuevoProcedimiento'
  }, {
    text: 'Vendedor',
    target: '#modalNuevoVendedor'
  }, {
    text: 'Impuesto Cargo',
    target: '#modalNuevoImpuesto'
  }, {
    text: 'Metodo de Pago',
    target: '#modalNuevoMetodoPago'
  }, {
    text: 'Impuesto Retencion',
    target: '#modalNuevoImpuestoRetencion'
  }, {
    text: 'Centro de Costo',
    target: '#addCostsCenter'
  }, {
    text: 'Usuario',
    target: '#modalNuevoUsuario'
  }, {
    text: 'Especialidad médica',
    target: '#modalUserSpecialty'
  }, {
    text: 'Rol de usuario',
    target: '#modalUserRole'
  }, {
    text: 'Horario de atención',
    target: '#modalCreateUserOpeningHour'
  }, {
    text: 'Precio',
    target: '#modalPrice'
  }, {
    text: 'Consentimientos',
    target: '#modalConsent'
  }, {
    text: 'Mensajería masiva',
    target: '#newMessage'
  }, {
    text: 'Plantilla',
    target: '#modalBasicTemplate'
  }];
  const handleClick = (e, item) => {
    onItemClick(e, item);
    setIsOpen(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "dropdown"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary dropdown-toggle",
    type: "button",
    id: "dropdownMenuButton1",
    "data-bs-toggle": "dropdown",
    "aria-expanded": isOpen,
    onClick: () => setIsOpen(!isOpen)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus"
  }), " \xA0 ", title), /*#__PURE__*/React.createElement("ul", {
    className: "dropdown-menu",
    "aria-labelledby": "dropdownMenuButton1"
  }, items.map((item, index) => /*#__PURE__*/React.createElement("li", {
    key: index
  }, /*#__PURE__*/React.createElement("a", {
    className: "dropdown-item",
    "data-bs-toggle": "modal",
    "data-bs-target": item.target,
    onClick: e => handleClick(e, item)
  }, item.text)))));
};