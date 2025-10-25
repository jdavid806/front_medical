import React from "react";
const PatientInsuranceInfo = ({
  patient
}) => /*#__PURE__*/React.createElement("div", {
  className: "card mb-3 shadow-sm"
}, /*#__PURE__*/React.createElement("div", {
  className: "card-header bg-light py-2"
}, /*#__PURE__*/React.createElement("h3", {
  className: "card-title mb-0 fs-6"
}, /*#__PURE__*/React.createElement("i", {
  className: "fas fa-shield-alt me-2"
}), "Seguridad Social")), /*#__PURE__*/React.createElement("div", {
  className: "card-body p-2"
}, /*#__PURE__*/React.createElement("div", {
  className: "row gx-1 gy-1"
}, /*#__PURE__*/React.createElement("div", {
  className: "col-md-8 d-flex"
}, /*#__PURE__*/React.createElement("span", {
  className: "fw-bold small me-1 mt-1"
}, "Aseguradora:"), /*#__PURE__*/React.createElement("span", null, patient.social_security?.entity?.name || "No especificada")), /*#__PURE__*/React.createElement("div", {
  className: "col-md-6 d-flex"
}, /*#__PURE__*/React.createElement("span", {
  className: "fw-bold small me-1 mt-1"
}, "Ars y tipo de regimen:"), /*#__PURE__*/React.createElement("span", null, patient.social_security?.affiliate_type || "No especificada")))));
export default PatientInsuranceInfo;