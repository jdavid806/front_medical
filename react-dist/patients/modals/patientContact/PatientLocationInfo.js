import React from "react";
const PatientLocationInfo = ({
  patient
}) => /*#__PURE__*/React.createElement("div", {
  className: "card mb-3 shadow-sm"
}, /*#__PURE__*/React.createElement("div", {
  className: "card-header bg-light py-2"
}, /*#__PURE__*/React.createElement("h3", {
  className: "card-title mb-0 fs-6"
}, /*#__PURE__*/React.createElement("i", {
  className: "fas fa-map-marker-alt me-2"
}), "Ubicaci\xF3n y Residencia")), /*#__PURE__*/React.createElement("div", {
  className: "card-body p-2"
}, /*#__PURE__*/React.createElement("div", {
  className: "row gx-2 gy-1"
}, /*#__PURE__*/React.createElement("div", {
  className: "col-md-6"
}, /*#__PURE__*/React.createElement("div", {
  className: "d-flex align-items-center mb-1"
}, /*#__PURE__*/React.createElement("span", {
  className: "fw-bold small me-1",
  style: {
    minWidth: "35px"
  }
}, "Pa\xEDs:"), /*#__PURE__*/React.createElement("span", null, patient?.country_id)), /*#__PURE__*/React.createElement("div", {
  className: "d-flex align-items-center mb-1"
}, /*#__PURE__*/React.createElement("span", {
  className: "fw-bold small me-1",
  style: {
    minWidth: "105px"
  }
}, "Departamento:"), /*#__PURE__*/React.createElement("span", null, patient.department_id))), /*#__PURE__*/React.createElement("div", {
  className: "col-md-6"
}, /*#__PURE__*/React.createElement("div", {
  className: "d-flex align-items-center mb-1"
}, /*#__PURE__*/React.createElement("span", {
  className: "fw-bold small me-1",
  style: {
    minWidth: "55px"
  }
}, "Ciudad:"), /*#__PURE__*/React.createElement("span", null, patient.city_id)), /*#__PURE__*/React.createElement("div", {
  className: "d-flex align-items-center mb-1"
}, /*#__PURE__*/React.createElement("span", {
  className: "fw-bold small me-1",
  style: {
    minWidth: "95px"
  }
}, "Nacionalidad:"), /*#__PURE__*/React.createElement("span", null, patient.nationality))), /*#__PURE__*/React.createElement("div", {
  className: "col-12"
}, /*#__PURE__*/React.createElement("div", {
  className: "d-flex align-items-center mb-1"
}, /*#__PURE__*/React.createElement("span", {
  className: "fw-bold small me-1",
  style: {
    minWidth: "60px"
  }
}, "Direcci\xF3n:"), /*#__PURE__*/React.createElement("span", null, patient.address))))));
export default PatientLocationInfo;