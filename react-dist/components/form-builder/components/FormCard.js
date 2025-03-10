// FormCard.tsx
import React from 'react';
import { FormField } from "./FormField.js";
export const FormCard = ({
  card,
  formValues,
  onDeleteCard,
  onAddField,
  onDeleteField,
  onEditorChange,
  onInputChange
}) => /*#__PURE__*/React.createElement("div", {
  className: "col mb-3"
}, /*#__PURE__*/React.createElement("div", {
  className: "card h-100"
}, /*#__PURE__*/React.createElement("div", {
  className: "card-body"
}, /*#__PURE__*/React.createElement("div", {
  className: "d-flex p-2 align-self-start cursor-pointer"
}, /*#__PURE__*/React.createElement("div", {
  className: "text-danger",
  onClick: () => onDeleteCard(card.id)
}, /*#__PURE__*/React.createElement("i", {
  className: "fas fa-trash"
}))), /*#__PURE__*/React.createElement("div", {
  className: "d-flex flex-column mb-3 w-100"
}, /*#__PURE__*/React.createElement("h5", {
  className: "card-title"
}, card.title)), card.fields?.map((field, fieldIndex) => /*#__PURE__*/React.createElement("div", {
  className: "d-flex",
  key: fieldIndex
}, /*#__PURE__*/React.createElement("div", {
  className: "d-flex p-2 align-self-start cursor-pointer"
}, /*#__PURE__*/React.createElement("div", {
  className: "text-danger",
  onClick: () => onDeleteField(field.id)
}, /*#__PURE__*/React.createElement("i", {
  className: "fas fa-trash"
}))), /*#__PURE__*/React.createElement("div", {
  className: "d-flex flex-column mb-3 w-100"
}, /*#__PURE__*/React.createElement(FormField, {
  field: field,
  formValues: formValues,
  onEditorChange: onEditorChange,
  onInputChange: onInputChange
})))), /*#__PURE__*/React.createElement("button", {
  type: "button",
  className: "btn btn-primary btn-sm mt-2",
  onClick: () => onAddField(card)
}, "Agregar Campo"))));