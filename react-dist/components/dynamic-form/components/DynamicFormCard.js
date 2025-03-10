// FormCard.tsx
import React from 'react';
import { FormField } from "../../form-builder/components/FormField.js";
export const DynamicFormCard = ({
  card,
  formValues,
  onEditorChange,
  onInputChange
}) => /*#__PURE__*/React.createElement("div", {
  className: "col mb-3"
}, /*#__PURE__*/React.createElement("div", {
  className: "card h-100"
}, /*#__PURE__*/React.createElement("div", {
  className: "card-body"
}, /*#__PURE__*/React.createElement("div", {
  className: "d-flex flex-column mb-3 w-100"
}, /*#__PURE__*/React.createElement("h5", {
  className: "card-title"
}, card.title)), card.fields?.map((field, index) => /*#__PURE__*/React.createElement("div", {
  key: index,
  className: "d-flex flex-column mb-3 w-100"
}, /*#__PURE__*/React.createElement(FormField, {
  field: field,
  formValues: formValues,
  onEditorChange: onEditorChange,
  onInputChange: onInputChange
}))))));