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
  className: "col-md-4 d-flex"
}, /*#__PURE__*/React.createElement("span", {
  className: "fw-bold small me-1"
}, "EPS:"), /*#__PURE__*/React.createElement("span", null, patient.social_security?.eps || "No especificada")), /*#__PURE__*/React.createElement("div", {
  className: "col-md-4 d-flex"
}, /*#__PURE__*/React.createElement("span", {
  className: "fw-bold small me-1"
}, "AFP:"), /*#__PURE__*/React.createElement("span", null, patient.social_security?.afp || "No especificada")), /*#__PURE__*/React.createElement("div", {
  className: "col-md-4 d-flex"
}, /*#__PURE__*/React.createElement("span", {
  className: "fw-bold small me-1"
}, "ARL:"), /*#__PURE__*/React.createElement("span", null, patient.social_security?.arl || "No especificada")))));
export default PatientInsuranceInfo;