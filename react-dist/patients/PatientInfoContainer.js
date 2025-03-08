import React from 'react';
import { PatientInfo } from "./PatientInfo.js";
import { usePatient } from "./hooks/usePatient.js";
export const PatientInfoContainer = ({
  patientId
}) => {
  const {
    patient
  } = usePatient(patientId);
  return patient ? /*#__PURE__*/React.createElement(PatientInfo, {
    patient: patient
  }) : /*#__PURE__*/React.createElement("p", null, "Cargando...");
};