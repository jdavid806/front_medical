import React from 'react';

export const PatientsSummaryCard = () => {
    const handleViewPatients = () => {
        window.location.href = 'pacientes';
    };

    return (
        <div className="card bg-secondary dashboard-card">
            <div className="card-body">
                <h5 className="card-title">
                    <span className="ml-10" data-feather="user"></span> Pacientes
                </h5>
                <div className="card-content">
                    <h3 id="patientsActiveCount">Cargando...</h3>
                    <span className="text-span-descripcion">Pacientes Creados</span>
                </div>
                <div className="card-button">
                    <button
                        className="btn btn-phoenix-secondary me-1 mb-1"
                        type="button"
                        onClick={handleViewPatients}
                    >
                        <span data-feather="users"></span> Ver Consultas
                    </button>
                </div>
            </div>
        </div>
    );
};