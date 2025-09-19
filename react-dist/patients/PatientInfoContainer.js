import React from 'react';
import { PatientInfo } from "./PatientInfo.js";
import { usePatient } from "./hooks/usePatient.js";
export const PatientInfoContainer = ({
  patientId,
  hideEditButton = false
}) => {
  const {
    patient,
    fetchPatient
  } = usePatient(patientId);
  return patient ? /*#__PURE__*/React.createElement(PatientInfo, {
    requestRefresh: () => {
      fetchPatient();
    },
    patient: patient,
    hideEditButton: hideEditButton
  }) : /*#__PURE__*/React.createElement("p", null, "Cargando...");
};