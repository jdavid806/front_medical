import React, { useState } from "react";
import { Patient } from "../models/models";
import { Button } from "primereact/button";
import PatientFormModal from "./modals/form/PatientFormModal";
import PatientGeneralData from "./patientContact/PatientGeneralData";
import PatientLocationInfo from "./patientContact/PatientLocationInfo";
import PatientCompanions from "./patientContact/PatientCompanions";
import PatientInsuranceInfo from "./patientContact/PatientInsuranceInfo";

interface PatientInfoProps {
  patient: Patient;
  requestRefresh: () => void;
  hideEditButton?: boolean;
}

export const PatientInfo: React.FC<PatientInfoProps> = ({
  patient,
  requestRefresh,
  hideEditButton = false,
}) => {
  const isDetailClinicalRecord = new URLSearchParams(
    window.location.search
  ).get("clinicalRecordId");
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <div className="text-center mb-3 mt-3">
        {!isDetailClinicalRecord && !hideEditButton && (
          <Button
            style={{ maxWidth: "200px" }}
            label="Editar Paciente"
            onClick={() => setShowEditModal(true)}
            className="p-button-sm p-button-primary"
          >
            <i className="fa-solid fa-pen-to-square me-2"></i>
          </Button>
        )}
      </div>
      <PatientGeneralData patient={patient} />
      <PatientLocationInfo patient={patient} />
      <PatientCompanions patient={patient} />
      <PatientInsuranceInfo patient={patient} />
      <PatientFormModal
        visible={showEditModal}
        onHide={() => setShowEditModal(false)}
        onSuccess={() => {
          requestRefresh();
          setShowEditModal(false);
        }}
        patientData={patient}
      />
    </>
  );
};