import React from 'react';
const PatientBreadcrumb = ({
  patient,
  loading
}) => {
  if (loading) {
    return /*#__PURE__*/React.createElement("nav", {
      "aria-label": "breadcrumb",
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("ol", {
      className: "breadcrumb"
    }, /*#__PURE__*/React.createElement("li", {
      className: "breadcrumb-item"
    }, /*#__PURE__*/React.createElement("a", {
      href: "/patients"
    }, "Pacientes")), /*#__PURE__*/React.createElement("li", {
      className: "breadcrumb-item active",
      "aria-current": "page"
    }, "Cargando...")));
  }
  if (!patient) {
    return /*#__PURE__*/React.createElement("nav", {
      "aria-label": "breadcrumb",
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("ol", {
      className: "breadcrumb"
    }, /*#__PURE__*/React.createElement("li", {
      className: "breadcrumb-item"
    }, /*#__PURE__*/React.createElement("a", {
      href: "/patients"
    }, "Pacientes")), /*#__PURE__*/React.createElement("li", {
      className: "breadcrumb-item active",
      "aria-current": "page"
    }, "Paciente no encontrado")));
  }
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": "breadcrumb",
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("ol", {
    className: "breadcrumb"
  }, /*#__PURE__*/React.createElement("li", {
    className: "breadcrumb-item"
  }, /*#__PURE__*/React.createElement("a", {
    href: "/patients"
  }, "Pacientes")), /*#__PURE__*/React.createElement("li", {
    className: "breadcrumb-item active",
    "aria-current": "page"
  }, /*#__PURE__*/React.createElement("a", {
    href: "configConsentimientos"
  }, "Consentimientos")), /*#__PURE__*/React.createElement("li", {
    className: "breadcrumb-item"
  }, /*#__PURE__*/React.createElement("a", {
    href: `/patients/${patient.id}`
  }, patient.first_name, " ", patient.last_name))));
};
export default PatientBreadcrumb;