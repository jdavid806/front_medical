// ConsultationsSummaryCard.js
import React from 'react';

export const ConsultationsSummaryCard = () => {
    const handleViewAppointments = () => {
        window.location.href = 'pacientes';
    };

    return (
        <div className="card dashboard-card">
            <div className="card-body">
                <h5 className="card-title">
                    <i className="fa-solid fa-magnifying-glass"></i> Consultas
                </h5>
                <div className="card-content">
                    <h3>0/2</h3>
                    <span className="text-span-descripcion">Consultas para Hoy</span>
                </div>
                <div className="card-button">
                    <button
                        className="btn btn-phoenix-secondary me-1 mb-1"
                        type="button"
                        onClick={handleViewAppointments}
                    >
                        <i className="fa-solid fa-magnifying-glass"></i> Ver Consultas
                    </button>
                </div>
            </div>
        </div>
    );
};