import React from 'react';
import { PrimeReactProvider } from 'primereact/api';

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
                <table className="table table-sm tableDataTableSearch">
                    <thead>
                        <tr>
                            <th>Nombre de la Historia</th>
                            <th>Doctor(a)</th>
                            <th>Motivo de Consulta</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historiasFiltradas.map((historia) => (
                            <tr key={historia.id}>
                                <td className="align-middle">{historia.nombre}</td>
                                <td className="align-middle">{historia.doctor}</td>
                                <td className="align-middle">{historia.motivo}</td>
                                <td className="align-middle">
                                    <span className={`badge badge-phoenix ${estadosEspecialidad[historia.estado].badgeClass}`}>
                                        {estadosEspecialidad[historia.estado].name}
                                    </span>
                                </td>
                                <td className="text-end align-middle">
                                    <div className="dropdown">
                                        <button
                                            className="btn btn-primary dropdown-toggle"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <i data-feather="settings"></i> Acciones
                                        </button>
                                        <ul className="dropdown-menu" style={{ zIndex: 10000 }}>
                                            {historia.estado === 'approved' && (
                                                <li>
                                                    <a
                                                        className="dropdown-item"
                                                        href="#"
                                                        onClick={() => solicitarAnulacion(historia.id)}
                                                    >
                                                        <div className="d-flex gap-2 align-items-center">
                                                            <i className="fa-solid fa-ban" style={{ width: '20px' }}></i>
                                                            <span>Solicitar anulación</span>
                                                        </div>
                                                    </a>
                                                </li>
                                            )}
                                            <li>
                                                <a className="dropdown-item" href={`#${historia.id}`}>
                                                    <div className="d-flex gap-2 align-items-center">
                                                        <i className="fa-solid fa-print" style={{ width: '20px' }}></i>
                                                        <span>Imprimir</span>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="dropdown-item" href={`#${historia.id}`} id="generate_consent_pdf">
                                                    <div className="d-flex gap-2 align-items-center">
                                                        <i className="fa-solid fa-download" style={{ width: '20px' }}></i>
                                                        <span>Descargar</span>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <hr className="dropdown-divider" />
                                            </li>
                                            <li className="dropdown-header">Compartir</li>
                                            <li>
                                                <a className="dropdown-item" href="#">
                                                    <div className="d-flex gap-2 align-items-center">
                                                        <i className="fa-brands fa-whatsapp" style={{ width: '20px' }}></i>
                                                        <span>Compartir por Whatsapp</span>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a className="dropdown-item" href="#">
                                                    <div className="d-flex gap-2 align-items-center">
                                                        <i className="fa-solid fa-envelope" style={{ width: '20px' }}></i>
                                                        <span>Compartir por Correo</span>
                                                    </div>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </PrimeReactProvider>
    );
};