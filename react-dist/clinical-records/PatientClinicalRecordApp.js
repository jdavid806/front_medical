import React from "react";
import { PrimeReactProvider } from "primereact/api";
import { useSpecializables } from "../specializables/hooks/useSpecializables.js";
import { useEffect } from "react";
import { useState } from "react";
import { useClinicalRecordTypes } from "../clinical-record-types/hooks/useClinicalRecordTypes.js";
import { useClinicalRecords } from "./hooks/useClinicalRecords.js";
import { PatientClinicalRecordsTable } from "./components/PatientClinicalRecordsTable.js";
import UserManager from "../../services/userManager.js";
const specialtyId = new URLSearchParams(window.location.search).get("especialidad");
const patientId = new URLSearchParams(window.location.search).get("patient_id") || new URLSearchParams(window.location.search).get("id") || "";
const appointmentId = new URLSearchParams(window.location.search).get("appointment_id") || "";
export const PatientClinicalRecordApp = () => {
  const {
    specializables
  } = useSpecializables();
  const {
    clinicalRecordTypes
  } = useClinicalRecordTypes();
  const {
    clinicalRecords
  } = useClinicalRecords(patientId);
  const [tableClinicalRecords, setTableClinicalRecords] = useState([]);
  const [specialtyClinicalRecords, setSpecialtyClinicalRecords] = useState([]);
  useEffect(() => {
    if (specializables && clinicalRecordTypes) {
      const specialtyClinicalRecordIds = specializables.filter(record => record.specialty_id === specialtyId && ["Historia Clínica", "clinical_record"].includes(record.specializable_type)).map(record => record.specializable_id.toString());
      const filteredClinicalRecords = clinicalRecordTypes.filter(record => specialtyClinicalRecordIds.includes(record.id.toString()));
      setSpecialtyClinicalRecords(filteredClinicalRecords);
      setTableClinicalRecords(clinicalRecords.filter(record => specialtyClinicalRecordIds.includes(record.clinical_record_type_id.toString())));
    }
  }, [specializables, clinicalRecordTypes, clinicalRecords]);
  useEffect(() => {
    if (specializables) {
      const specialtyClinicalRecordIds = specializables.filter(record => record.specialty_id === specialtyId && record.specializable_type === "Historia Clínica").map(record => record.specializable_id.toString());
      setTableClinicalRecords(clinicalRecords.filter(record => specialtyClinicalRecordIds.includes(record.clinical_record_type_id.toString())));
    }
  }, [specializables, clinicalRecords]);
  const printClinicalRecord = (id, title) => {
    //@ts-ignore
    crearDocumento(id, "Impresion", "Consulta", "Completa", title);
  };
  const downloadClinicalRecord = (id, title) => {
    //@ts-ignore
    crearDocumento(id, "Descarga", "Consulta", "Completa", title);
  };
  const shareClinicalRecord = (id, type, title, patient_id) => {
    switch (type) {
      case "whatsapp":
        //@ts-ignore
        enviarDocumento(id, "Descarga", "Consulta", "Completa", patient_id, UserManager.getUser().id, title);
        break;
      default:
        break;
    }
  };
  const seeDetail = (id, clinicalRecordType) => {
    window.location.href = `detalleConsulta?clinicalRecordId=${id}&patient_id=${patientId}&tipo_historia=${clinicalRecordType}&especialidad=${specialtyId}`;
  };
  const nombreEspecialidad = new URLSearchParams(window.location.search).get("especialidad");
  return /*#__PURE__*/React.createElement(PrimeReactProvider, null, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "mb-0"
  }, "Historias Cl\xEDnicas - ", nombreEspecialidad)), /*#__PURE__*/React.createElement("div", {
    className: "dropdown"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary dropdown-toggle",
    type: "button",
    id: "dropdownMenuButton",
    "data-bs-toggle": "dropdown",
    "aria-expanded": "false"
  }, "Crear Historia Cl\xEDnica"), /*#__PURE__*/React.createElement("ul", {
    className: "dropdown-menu",
    "aria-labelledby": "dropdownMenuButton"
  }, specialtyClinicalRecords.map(record => /*#__PURE__*/React.createElement("li", {
    key: record.id
  }, /*#__PURE__*/React.createElement("a", {
    className: "dropdown-item",
    href: `consultas?patient_id=${patientId}&especialidad=${specialtyId}&tipo_historia=${record.key_}&appointment_id=${appointmentId}`
  }, "Crear ", record.name)))))))), /*#__PURE__*/React.createElement("div", {
    className: "row mt-4"
  }, /*#__PURE__*/React.createElement(PatientClinicalRecordsTable, {
    records: tableClinicalRecords,
    onSeeDetail: seeDetail,
    onPrintItem: printClinicalRecord,
    onDownloadItem: downloadClinicalRecord,
    onShareItem: shareClinicalRecord
  })));
};