import React, { useState } from "react";
import { Button } from "primereact/button";
import PatientFormModal from "./modals/form/PatientFormModal.js";
import PatientGeneralData from "./patientContact/PatientGeneralData.js";
import PatientLocationInfo from "./patientContact/PatientLocationInfo.js";
import PatientCompanions from "./patientContact/PatientCompanions.js";
import PatientInsuranceInfo from "./patientContact/PatientInsuranceInfo.js";
export const PatientInfo = ({
  patient,
  requestRefresh,
  hideEditButton = false
}) => {
  const isDetailClinicalRecord = new URLSearchParams(window.location.search).get("clinicalRecordId");
  const [showEditModal, setShowEditModal] = useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "text-center mb-3 mt-3"
  }, !isDetailClinicalRecord && !hideEditButton && /*#__PURE__*/React.createElement(Button, {
    style: {
      maxWidth: "200px"
    },
    label: "Editar Paciente",
    onClick: () => setShowEditModal(true),
    className: "p-button-sm p-button-primary"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-pen-to-square me-2"
  }))), /*#__PURE__*/React.createElement(PatientGeneralData, {
    patient: patient
  }), /*#__PURE__*/React.createElement(PatientLocationInfo, {
    patient: patient
  }), /*#__PURE__*/React.createElement(PatientCompanions, {
    patient: patient
  }), /*#__PURE__*/React.createElement(PatientInsuranceInfo, {
    patient: patient
  }), /*#__PURE__*/React.createElement(PatientFormModal, {
    visible: showEditModal,
    onHide: () => setShowEditModal(false),
    onSuccess: () => {
      requestRefresh();
      setShowEditModal(false);
    },
    patientData: patient
  }));
};