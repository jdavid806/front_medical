import React, { useState } from 'react';
import PrescriptionTable from "../prescriptions/components/PrescriptionTable.js";
import PrescriptionModal from "./components/PrescriptionModal.js";
import { usePrescription } from "./hooks/usePrescription.js";
export const PrescriptionApp = () => {
  const {
    createPrescription
  } = usePrescription();
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const handleSubmit = data => {
    createPrescription(data);
  };
  const handleOpenPrescriptionModal = () => {
    setShowPrescriptionModal(true);
  };
  const handleHidePrescriptionModal = () => {
    setShowPrescriptionModal(false);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "mb-1"
  }, "Recetas"), /*#__PURE__*/React.createElement("div", {
    className: "text-end mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: ""
  }, /*#__PURE__*/React.createElement("a", {
    className: "btn btn-primary",
    onClick: handleOpenPrescriptionModal
  }, "Nueva Receta")))), /*#__PURE__*/React.createElement(PrescriptionTable, null), /*#__PURE__*/React.createElement(PrescriptionModal, {
    show: showPrescriptionModal,
    handleSubmit: handleSubmit,
    onHide: handleHidePrescriptionModal
  }));
};