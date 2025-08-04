import React from "react";
import { Patient } from "../../../models/models";

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
        <div className="col-md-4 d-flex">
          <span className="fw-bold small me-1">EPS:</span>
          <span>{patient.social_security?.eps || "No especificada"}</span>
        </div>

        <div className="col-md-4 d-flex">
          <span className="fw-bold small me-1">AFP:</span>
          <span>{patient.social_security?.afp || "No especificada"}</span>
        </div>

        <div className="col-md-4 d-flex">
          <span className="fw-bold small me-1">ARL:</span>
          <span>{patient.social_security?.arl || "No especificada"}</span>
        </div>
      </div>
    </div>
  </div>
);

export default PatientInsuranceInfo;
