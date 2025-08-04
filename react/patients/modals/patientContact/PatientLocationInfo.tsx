import React from "react";
import { Patient } from "../../../models/models";

interface PatientLocationInfoProps {
  patient: Patient;
}

const PatientLocationInfo: React.FC<PatientLocationInfoProps> = ({
  patient,
}) => (
  <div className="card mb-3 shadow-sm">
    <div className="card-header bg-light py-2">
      <h3 className="card-title mb-0 fs-6">
        <i className="fas fa-map-marker-alt me-2"></i>
        Ubicación y Residencia
      </h3>
    </div>
    <div className="card-body p-2">
      <div className="row gx-2 gy-1">
        <div className="col-md-6">
          <div className="d-flex align-items-center mb-1">
            <span className="fw-bold small me-1" style={{ minWidth: "35px" }}>
              País:
            </span>
            <span>{patient?.country_id}</span>
          </div>
          <div className="d-flex align-items-center mb-1">
            <span className="fw-bold small me-1" style={{ minWidth: "105px" }}>
              Departamento:
            </span>
            <span>{patient.department_id}</span>
          </div>
        </div>

        <div className="col-md-6">
          <div className="d-flex align-items-center mb-1">
            <span className="fw-bold small me-1" style={{ minWidth: "55px" }}>
              Ciudad:
            </span>
            <span>{patient.city_id}</span>
          </div>
          <div className="d-flex align-items-center mb-1">
            <span className="fw-bold small me-1" style={{ minWidth: "95px" }}>
              Nacionalidad:
            </span>
            <span>{patient.nationality}</span>
          </div>
        </div>

        <div className="col-12">
          <div className="d-flex align-items-center mb-1">
            <span className="fw-bold small me-1" style={{ minWidth: "60px" }}>
              Dirección:
            </span>
            <span>{patient.address}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PatientLocationInfo;
