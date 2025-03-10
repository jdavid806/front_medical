// AddFieldModal.tsx
import React from 'react';
import { CustomModal } from "../../CustomModal.js";
export const AddFieldModal = ({
  show,
  newFieldData,
  onHide,
  onSubmit,
  onFieldDataChange
}) => /*#__PURE__*/React.createElement(CustomModal, {
  show: show,
  onHide: onHide,
  title: "Agregar Nuevo Campo"
}, /*#__PURE__*/React.createElement("div", {
  className: "modal-body"
}, /*#__PURE__*/React.createElement("div", {
  className: "mb-3"
}, /*#__PURE__*/React.createElement("label", {
  className: "form-label"
}, "Tipo de Campo"), /*#__PURE__*/React.createElement("select", {
  className: "form-select",
  value: newFieldData.type,
  onChange: e => onFieldDataChange({
    ...newFieldData,
    type: e.target.value
  })
}, /*#__PURE__*/React.createElement("option", {
  value: "text"
}, "Texto"), /*#__PURE__*/React.createElement("option", {
  value: "textarea"
}, "\xC1rea de Texto"), /*#__PURE__*/React.createElement("option", {
  value: "select"
}, "Selecci\xF3n"), /*#__PURE__*/React.createElement("option", {
  value: "checkbox"
}, "Checkbox"))), /*#__PURE__*/React.createElement("div", {
  className: "mb-3"
}, /*#__PURE__*/React.createElement("label", {
  className: "form-label"
}, "Etiqueta"), /*#__PURE__*/React.createElement("input", {
  type: "text",
  className: "form-control",
  value: newFieldData.label,
  onChange: e => onFieldDataChange({
    ...newFieldData,
    label: e.target.value
  })
})), newFieldData.type === 'select' && /*#__PURE__*/React.createElement("div", {
  className: "mb-3"
}, /*#__PURE__*/React.createElement("label", {
  className: "form-label"
}, "Opciones (separadas por comas)"), /*#__PURE__*/React.createElement("input", {
  type: "text",
  className: "form-control",
  value: newFieldData.options,
  onChange: e => onFieldDataChange({
    ...newFieldData,
    options: e.target.value
  })
}))), /*#__PURE__*/React.createElement("div", {
  className: "modal-footer"
}, /*#__PURE__*/React.createElement("button", {
  type: "button",
  className: "btn btn-secondary",
  onClick: onHide
}, "Cancelar"), /*#__PURE__*/React.createElement("button", {
  type: "button",
  className: "btn btn-primary",
  onClick: onSubmit
}, "Guardar")));