import React, { useState } from 'react';
import UserTable from "./UserTable.js";
import UserFormModal from "./UserFormModal.js";
export const UserApp = () => {
  const [showUserFormModal, setShowUserFormModal] = useState(false);
  const handleSubmit = e => {
    e.preventDefault();
    console.log(e.currentTarget);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(Array.from(formData.entries()));
    console.log(data);
  };
  const handleOpenUserFormModal = () => {
    setShowUserFormModal(true);
  };
  const handleHideUserFormModal = () => {
    setShowUserFormModal(false);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "mb-1"
  }, "Usuarios"), /*#__PURE__*/React.createElement("div", {
    className: "text-end mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dropdown"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary dropdown-toggle",
    type: "button",
    id: "dropdownMenuButton1",
    "data-bs-toggle": "dropdown",
    "aria-expanded": "false"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus"
  }), " \xA0 Nuevo"), /*#__PURE__*/React.createElement("ul", {
    className: "dropdown-menu",
    "aria-labelledby": "dropdownMenuButton1"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    className: "dropdown-item",
    "data-bs-toggle": "modal",
    "data-bs-target": "#modalEntidad"
  }, "Entidad")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    className: "dropdown-item",
    "data-bs-toggle": "modal",
    "data-bs-target": "#modalNuevoProcedimiento"
  }, "Procedimiento")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    className: "dropdown-item",
    "data-bs-toggle": "modal",
    "data-bs-target": "#modalNuevoVendedor"
  }, "Vendedor")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    className: "dropdown-item",
    "data-bs-toggle": "modal",
    "data-bs-target": "#modalNuevoImpuesto"
  }, "Impuesto Cargo")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    className: "dropdown-item",
    "data-bs-toggle": "modal",
    "data-bs-target": "#modalNuevoMetodoPago"
  }, "Metodo de Pago")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    className: "dropdown-item",
    "data-bs-toggle": "modal",
    "data-bs-target": "#modalNuevoImpuestoRetencion"
  }, "Impuesto Retencion")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    className: "dropdown-item",
    "data-bs-toggle": "modal",
    "data-bs-target": "#addCostsCenter"
  }, "Centro de Costo")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    className: "dropdown-item",
    onClick: handleOpenUserFormModal
  }, "Usuario")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    className: "dropdown-item",
    "data-bs-toggle": "modal",
    "data-bs-target": "#modalUserSpecialty"
  }, "Especialidad m\xE9dica")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    className: "dropdown-item",
    "data-bs-toggle": "modal",
    "data-bs-target": "#modalUserRole"
  }, "Rol de usuario")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    className: "dropdown-item",
    "data-bs-toggle": "modal",
    "data-bs-target": "#modalCreateUserOpeningHour"
  }, "Horario de atenci\xF3n")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    className: "dropdown-item",
    "data-bs-toggle": "modal",
    "data-bs-target": "#modalPrice"
  }, "Precio")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    className: "dropdown-item",
    "data-bs-toggle": "modal",
    "data-bs-target": "#modalConsent"
  }, "Consentimientos")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    className: "dropdown-item",
    "data-bs-toggle": "modal",
    "data-bs-target": "#newMessage"
  }, "Mensajer\xEDa masiva")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    className: "dropdown-item",
    "data-bs-toggle": "modal",
    "data-bs-target": "#modalBasicTemplate"
  }, "Plantilla")))))), /*#__PURE__*/React.createElement(UserTable, null), /*#__PURE__*/React.createElement(UserFormModal, {
    show: showUserFormModal,
    handleSubmit: handleSubmit,
    onHide: handleHideUserFormModal
  }));
};