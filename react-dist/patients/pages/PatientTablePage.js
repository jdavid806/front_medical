import React from "react";
import { usePatients } from "../hooks/usePatients.js";
import { PatientTable } from "../PatientTable.js";
export const PatientTablePage = () => {
  const {
    patients
  } = usePatients();
  return /*#__PURE__*/React.createElement(PatientTable, {
    items: patients
  });
};