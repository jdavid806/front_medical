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
export const PatientClinicalRecordHistory = () => {
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
  useEffect(() => {
    if (specializables && clinicalRecordTypes) {
      const specialtyClinicalRecordIds = specializables.filter(record => record.specialty_id === specialtyId && ["Historia Clínica", "clinical_record"].includes(record.specializable_type)).map(record => record.specializable_id.toString());
      setTableClinicalRecords(clinicalRecords.filter(record => specialtyClinicalRecordIds.includes(record.clinical_record_type_id.toString())));
    }
  }, [specializables, clinicalRecordTypes, clinicalRecords]);
  useEffect(() => {
    if (specializables) {
      UserManager.onAuthChange((isAuthenticated, user, permissions, menus, role) => {
        if (role) {
          const specialtyClinicalRecordIds = specializables.filter(record => record.specialty_id === specialtyId && record.specializable_type === "Historia Clínica").map(record => record.specializable_id.toString());
          setTableClinicalRecords(clinicalRecords.filter(record => specialtyClinicalRecordIds.includes(record.clinical_record_type_id.toString()) || role.group == "ADMIN"));
        }
      });
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
        shareHistoryMessage(id, patient_id);
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
  }, "Historias Cl\xEDnicas - ", nombreEspecialidad))))), /*#__PURE__*/React.createElement("div", {
    className: "row mt-4"
  }, /*#__PURE__*/React.createElement(PatientClinicalRecordsTable, {
    records: tableClinicalRecords,
    onSeeDetail: seeDetail,
    onPrintItem: printClinicalRecord,
    onDownloadItem: downloadClinicalRecord,
    onShareItem: shareClinicalRecord
  })));
};