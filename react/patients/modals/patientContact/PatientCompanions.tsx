import React from "react";
import { Patient } from "../../../models/models";

interface PatientCompanionsProps {
  patient: Patient;
}

const PatientCompanions: React.FC<PatientCompanionsProps> = ({ patient }) => (
  <div className="card mb-3 shadow-sm">
    <div className="card-header bg-light py-2">
      <h3 className="card-title mb-0 fs-6">
        <i className="fas fa-users me-2"></i>
        Acompañantes
      </h3>
    </div>
    <div className="card-body p-2">
      {patient.companions?.length > 0 ? (
        <div className="row gx-2 gy-2">
          {patient.companions.map((companion, index) => (
            <div className="col-md-6 mb-2" key={`companion-${index}`}>
              <div className="card h-100">
                <div className="card-body p-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h1 className="mb-0 fw-bold fs-8">
                      {companion.first_name} {companion.last_name}
                    </h1>
                  </div>

                  <div className="d-flex align-items-center mb-1">
                    <span
                      className="fw-bold small me-1"
                      style={{ minWidth: "80px" }}
                    >
                      Parentesco:
                    </span>
                    <span>{companion.pivot?.relationship}</span>
                  </div>

                  <div className="d-flex align-items-center mb-1">
                    <span
                      className="fw-bold small me-1"
                      style={{ minWidth: "80px" }}
                    >
                      Documento:
                    </span>
                    <span>{companion.document_number}</span>
                  </div>

                  <div className="d-flex align-items-center mb-1">
                    <span
                      className="fw-bold small me-1"
                      style={{ minWidth: "80px" }}
                    >
                      WhatsApp:
                    </span>
                    <span>{companion.mobile}</span>
                  </div>

                  {companion.email && (
                    <div className="d-flex align-items-center">
                      <span
                        className="fw-bold small me-1"
                        style={{ minWidth: "80px" }}
                      >
                        Correo:
                      </span>
                      <span>{companion.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted mb-0 small">No hay acompañantes registrados</p>
      )}
    </div>
  </div>
);

export default PatientCompanions;
