import React from 'react';
import { useAdmisionsCurrentMonth } from "./hooks/useAdmisionsCurrentMonth.js";
import { Toast } from 'primereact/toast';
export const AdmissionsSummaryCard = () => {
  const handleViewAdmissions = () => {
    window.location.href = 'citasControl';
  };
  const {
    admisionCount,
    fetchAdmisionCurrentMonth,
    toast: ErrorAdmisions
  } = useAdmisionsCurrentMonth();
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: ErrorAdmisions
  }), /*#__PURE__*/React.createElement("div", {
    className: "card dashboard-card",
    style: {
      backgroundColor: 'var(--phoenix-info)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-hospital-user ml-2"
  }), " Admisiones"), /*#__PURE__*/React.createElement("div", {
    className: "card-content"
  }, /*#__PURE__*/React.createElement("h3", {
    id: "admissionsActiveCount"
  }, admisionCount?.admissions_count), /*#__PURE__*/React.createElement("span", {
    className: "text-span-descripcion"
  }, "Admisiones este mes")), /*#__PURE__*/React.createElement("div", {
    className: "card-button"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-phoenix-secondary me-1 mb-1",
    type: "button",
    onClick: handleViewAdmissions
  }, /*#__PURE__*/React.createElement("span", {
    className: "fas fa-plus-circle"
  }), " Nueva Admisi\xF3n")))));
};