import React from "react";
import { genders, maritalStatus } from "../../../../services/commons.js";
const PatientGeneralData = ({
  patient
}) => /*#__PURE__*/React.createElement("div", {
  className: "card mb-3 shadow-sm"
}, /*#__PURE__*/React.createElement("div", {
  className: "card-header bg-light py-2"
}, /*#__PURE__*/React.createElement("h3", {
  className: "card-title mb-0 fs-6"
}, /*#__PURE__*/React.createElement("i", {
  className: "fas fa-user me-2"
}), "Informaci\xF3n Personal")), /*#__PURE__*/React.createElement("div", {
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
    minWidth: "100px"
  }
}, "Tipo documento:"), /*#__PURE__*/React.createElement("span", null, patient.document_type)), /*#__PURE__*/React.createElement("div", {
  className: "d-flex align-items-center mb-1"
}, /*#__PURE__*/React.createElement("span", {
  className: "fw-bold small me-1",
  style: {
    minWidth: "70px"
  }
}, "Nombres:"), /*#__PURE__*/React.createElement("span", null, patient.first_name, " ", patient.middle_name)), /*#__PURE__*/React.createElement("div", {
  className: "d-flex align-items-center mb-1"
}, /*#__PURE__*/React.createElement("span", {
  className: "fw-bold small me-1",
  style: {
    minWidth: "60px"
  }
}, "G\xE9nero:"), /*#__PURE__*/React.createElement("span", null, genders[patient.gender]))), /*#__PURE__*/React.createElement("div", {
  className: "col-md-6"
}, /*#__PURE__*/React.createElement("div", {
  className: "d-flex align-items-center mb-1"
}, /*#__PURE__*/React.createElement("span", {
  className: "fw-bold small me-1",
  style: {
    minWidth: "100px"
  }
}, "N\xB0 documento:"), /*#__PURE__*/React.createElement("span", null, patient.document_number)), /*#__PURE__*/React.createElement("div", {
  className: "d-flex align-items-center mb-1"
}, /*#__PURE__*/React.createElement("span", {
  className: "fw-bold small me-1",
  style: {
    minWidth: "70px"
  }
}, "Apellidos:"), /*#__PURE__*/React.createElement("span", null, patient.last_name, " ", patient.second_last_name)), /*#__PURE__*/React.createElement("div", {
  className: "d-flex align-items-center mb-1"
}, /*#__PURE__*/React.createElement("span", {
  className: "fw-bold small me-1",
  style: {
    minWidth: "100px"
  }
}, "Fecha Nacimiento:"), /*#__PURE__*/React.createElement("span", null, patient.date_of_birth))), /*#__PURE__*/React.createElement("div", {
  className: "col-md-6"
}, /*#__PURE__*/React.createElement("div", {
  className: "d-flex align-items-center mb-1"
}, /*#__PURE__*/React.createElement("span", {
  className: "fw-bold small me-1",
  style: {
    minWidth: "85px"
  }
}, "Estado Civil:"), /*#__PURE__*/React.createElement("span", null, maritalStatus[patient.civil_status]))), /*#__PURE__*/React.createElement("div", {
  className: "col-md-6"
}, /*#__PURE__*/React.createElement("div", {
  className: "d-flex align-items-center mb-1"
}, /*#__PURE__*/React.createElement("span", {
  className: "fw-bold small me-1",
  style: {
    minWidth: "40px"
  }
}, "Etnia:"), /*#__PURE__*/React.createElement("span", null, patient.ethnicity))), /*#__PURE__*/React.createElement("div", {
  className: "col-md-6"
}, /*#__PURE__*/React.createElement("div", {
  className: "d-flex align-items-center mb-1"
}, /*#__PURE__*/React.createElement("span", {
  className: "fw-bold small me-1",
  style: {
    minWidth: "80px"
  }
}, "WhatsApp:"), /*#__PURE__*/React.createElement("span", null, patient.validated_data?.whatsapp))), /*#__PURE__*/React.createElement("div", {
  className: "col-md-6"
}, /*#__PURE__*/React.createElement("div", {
  className: "d-flex align-items-center mb-1"
}, /*#__PURE__*/React.createElement("span", {
  className: "fw-bold small me-1",
  style: {
    minWidth: "55px"
  }
}, "Correo:"), /*#__PURE__*/React.createElement("span", null, patient.validated_data?.email))))));
export default PatientGeneralData;