import React from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { PatientClinicalRecordsTable } from './components/PatientClinicalRecordsTable';

interface Historia {
    id: number;
    nombre: string;
    doctor: string;
    motivo: string;
    estado: string;
}

interface PatientClinicalRecordAppProps {
    nombreEspecialidad: string;
    tiposEspecialidad: { [key: string]: string };
    historiasFiltradas: Historia[];
    estadosEspecialidad: { [key: string]: { badgeClass: string; name: string } };
}

export const PatientClinicalRecordApp: React.FC<PatientClinicalRecordAppProps> = ({
    nombreEspecialidad,
    tiposEspecialidad,
    historiasFiltradas,
    estadosEspecialidad,
}) => {
    const solicitarAnulacion = (id: number) => {
        // Lógica para solicitar anulación
        console.log(`Solicitar anulación para la historia con ID: ${id}`);
    };

    return (
        <PrimeReactProvider>
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="mb-0">Historias Clínicas - {nombreEspecialidad}</h2>
                        </div>
                        <div className="dropdown">
                            <button
                                className="btn btn-primary dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Crear Historia Clínica
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                {Object.entries(tiposEspecialidad).map(([key, tipo]) => (
                                    <li key={key}>
                                        <a
                                            className="dropdown-item"
                                            href={`consultas?patient_id=${new URLSearchParams(window.location.search).get('patient_id')}&especialidad=${nombreEspecialidad}&tipo_historia=${key}`}
                                        >
                                            Crear {tipo}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                {/* <PatientClinicalRecordsTable /> */}
            </div>
        </PrimeReactProvider>
    );
};