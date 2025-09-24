import React from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
export const EmpresaConfig = () => {
  return /*#__PURE__*/React.createElement(Card, {
    title: "Datos de la Empresa"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-fluid grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "nombre"
  }, "Nombre de la Empresa"), /*#__PURE__*/React.createElement(InputText, {
    id: "nombre",
    placeholder: "Ingrese el nombre de la empresa"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "rif"
  }, "RIF"), /*#__PURE__*/React.createElement(InputText, {
    id: "rif",
    placeholder: "Ingrese el RIF"
  }))));
};