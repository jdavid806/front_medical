import React from "react";
const PatientCompanions = ({
  patient
}) => /*#__PURE__*/React.createElement("div", {
  className: "card mb-3 shadow-sm"
}, /*#__PURE__*/React.createElement("div", {
  className: "card-header bg-light py-2"
}, /*#__PURE__*/React.createElement("h3", {
  className: "card-title mb-0 fs-6"
}, /*#__PURE__*/React.createElement("i", {
  className: "fas fa-users me-2"
}), "Acompa\xF1antes")), /*#__PURE__*/React.createElement("div", {
  className: "card-body p-2"
}, patient.companions?.length > 0 ? /*#__PURE__*/React.createElement("div", {
  className: "row gx-2 gy-2"
}, patient.companions.map((companion, index) => /*#__PURE__*/React.createElement("div", {
  className: "col-md-6 mb-2",
  key: `companion-${index}`
}, /*#__PURE__*/React.createElement("div", {
  className: "card h-100"
}, /*#__PURE__*/React.createElement("div", {
  className: "card-body p-2"
}, /*#__PURE__*/React.createElement("div", {
  className: "d-flex justify-content-between align-items-center mb-1"
}, /*#__PURE__*/React.createElement("h1", {
  className: "mb-0 fw-bold fs-8"
}, companion.first_name, " ", companion.last_name)), /*#__PURE__*/React.createElement("div", {
  className: "d-flex align-items-center mb-1"
}, /*#__PURE__*/React.createElement("span", {
  className: "fw-bold small me-1",
  style: {
    minWidth: "80px"
  }
}, "Parentesco:"), /*#__PURE__*/React.createElement("span", null, companion.pivot?.relationship)), /*#__PURE__*/React.createElement("div", {
  className: "d-flex align-items-center mb-1"
}, /*#__PURE__*/React.createElement("span", {
  className: "fw-bold small me-1",
  style: {
    minWidth: "80px"
  }
}, "Documento:"), /*#__PURE__*/React.createElement("span", null, companion.document_number)), /*#__PURE__*/React.createElement("div", {
  className: "d-flex align-items-center mb-1"
}, /*#__PURE__*/React.createElement("span", {
  className: "fw-bold small me-1",
  style: {
    minWidth: "80px"
  }
}, "WhatsApp:"), /*#__PURE__*/React.createElement("span", null, companion.mobile)), companion.email && /*#__PURE__*/React.createElement("div", {
  className: "d-flex align-items-center"
}, /*#__PURE__*/React.createElement("span", {
  className: "fw-bold small me-1",
  style: {
    minWidth: "80px"
  }
}, "Correo:"), /*#__PURE__*/React.createElement("span", null, companion.email))))))) : /*#__PURE__*/React.createElement("p", {
  className: "text-muted mb-0 small"
}, "No hay acompa\xF1antes registrados")));
export default PatientCompanions;