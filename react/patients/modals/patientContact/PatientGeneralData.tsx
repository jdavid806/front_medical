import React from "react";
import { Patient } from "../../../models/models";
import { genders, maritalStatus } from "../../../../services/commons";

interface PatientGeneralDataProps {
  patient: Patient;
}

const PatientGeneralData: React.FC<PatientGeneralDataProps> = ({ patient }) => (
  <div className="card mb-3 shadow-sm">
    <div className="card-header bg-light py-2">
      <h3 className="card-title mb-0 fs-6">
        <i className="fas fa-user me-2"></i>
        Información Personal
      </h3>
    </div>
    <div className="card-body p-2">
      <div className="row gx-2 gy-1">
        <div className="col-md-6">
          <div className="d-flex align-items-center mb-1">
            <span className="fw-bold small me-1" style={{ minWidth: "100px" }}>
              Tipo documento:
            </span>
            <span>{patient.document_type}</span>
          </div>
          <div className="d-flex align-items-center mb-1">
            <span className="fw-bold small me-1" style={{ minWidth: "70px" }}>
              Nombres:
            </span>
            <span>
              {patient.first_name} {patient.middle_name}
            </span>
          </div>
          <div className="d-flex align-items-center mb-1">
            <span className="fw-bold small me-1" style={{ minWidth: "60px" }}>
              Género:
            </span>
            <span>{genders[patient.gender]}</span>
          </div>
        </div>

        <div className="col-md-6">
          <div className="d-flex align-items-center mb-1">
            <span className="fw-bold small me-1" style={{ minWidth: "100px" }}>
              N° documento:
            </span>
            <span>{patient.document_number}</span>
          </div>
          <div className="d-flex align-items-center mb-1">
            <span className="fw-bold small me-1" style={{ minWidth: "70px" }}>
              Apellidos:
            </span>
            <span>
              {patient.last_name} {patient.second_last_name}
            </span>
          </div>
          <div className="d-flex align-items-center mb-1">
            <span className="fw-bold small me-1" style={{ minWidth: "100px" }}>
              Fecha Nacimiento:
            </span>
            <span>{patient.date_of_birth}</span>
          </div>
        </div>

        <div className="col-md-6">
          <div className="d-flex align-items-center mb-1">
            <span className="fw-bold small me-1" style={{ minWidth: "85px" }}>
              Estado Civil:
            </span>
            <span>{maritalStatus[patient.civil_status]}</span>
          </div>
        </div>

        <div className="col-md-6">
          <div className="d-flex align-items-center mb-1">
            <span className="fw-bold small me-1" style={{ minWidth: "40px" }}>
              Etnia:
            </span>
            <span>{patient.ethnicity}</span>
          </div>
        </div>

        <div className="col-md-6">
          <div className="d-flex align-items-center mb-1">
            <span className="fw-bold small me-1" style={{ minWidth: "80px" }}>
              WhatsApp:
            </span>
            <span>{patient.validated_data?.whatsapp}</span>
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex align-items-center mb-1">
            <span className="fw-bold small me-1" style={{ minWidth: "55px" }}>
              Correo:
            </span>
            <span>{patient.validated_data?.email}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PatientGeneralData;
