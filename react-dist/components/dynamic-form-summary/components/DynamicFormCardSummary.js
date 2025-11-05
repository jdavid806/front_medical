import React from 'react';
import { FormFieldSummary } from "./FormFieldSummary.js";
export const DynamicFormCardSummary = ({
  card,
  formValues
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
}, /*#__PURE__*/React.createElement(FormFieldSummary, {
  field: field,
  formValues: formValues
}))))));