import React from "react";
import { Patient } from "../../models/models";

interface PatientInsuranceInfoProps {
  patient: Patient;
}

const PatientInsuranceInfo: React.FC<PatientInsuranceInfoProps> = ({
  patient,
}) => (
  <div className="card mb-3 shadow-sm">
    <div className="card-header bg-light py-2">
      <h3 className="card-title mb-0 fs-6">
        <i className="fas fa-shield-alt me-2"></i>
        Seguridad Social
      </h3>
    </div>
    <div className="card-body p-2">
      <div className="row gx-1 gy-1">
        <div className="col-md-8 d-flex">
          <span className="fw-bold small me-1 mt-1">Aseguradora:</span>
          <span>{patient.social_security?.entity?.name || "No especificada"}</span>
        </div>

        <div className="col-md-6 d-flex">
          <span className="fw-bold small me-1 mt-1">Ars y tipo de regimen:</span>
          <span>{patient.social_security?.affiliate_type || "No especificada"}</span>
        </div>
      </div>
    </div>
  </div>
);

export default PatientInsuranceInfo;
