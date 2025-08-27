import React from 'react';
import { PatientData } from '../types/DocumentData';

interface PatientBreadcrumbProps {
  patient: PatientData | null;
  loading: boolean;
}

const PatientBreadcrumb: React.FC<PatientBreadcrumbProps> = ({ patient, loading }) => {
  if (loading) {
    return (
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/patients">Pacientes</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Cargando...
          </li>
        </ol>
      </nav>
    );
  }

  if (!patient) {
    return (
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/patients">Pacientes</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Paciente no encontrado
          </li>
        </ol>
      </nav>
    );
  }

  return (
    <nav aria-label="breadcrumb" className="mb-3">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <a href="/patients">Pacientes</a>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          <a href="configConsentimientos">Consentimientos</a>
        </li>
        <li className="breadcrumb-item">
          <a href={`/patients/${patient.id}`}>
            {patient.first_name} {patient.last_name}
          </a>
        </li>
      </ol>
    </nav>
  );
};

export default PatientBreadcrumb;
