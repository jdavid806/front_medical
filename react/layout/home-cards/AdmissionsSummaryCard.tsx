import React from 'react';
import { useAdmisionsCurrentMonth } from './hooks/useAdmisionsCurrentMonth';
import { Toast } from 'primereact/toast';

export const AdmissionsSummaryCard = () => {
    const handleViewAdmissions = () => {
        window.location.href = 'citasControl';
    };
    const { admisionCount, fetchAdmisionCurrentMonth, toast: ErrorAdmisions } = useAdmisionsCurrentMonth();
    return (
        <>
            <Toast ref={ErrorAdmisions} />
            < div className="card dashboard-card" style={{ backgroundColor: 'var(--phoenix-info)' }}>
                <div className="card-body">
                    <h5 className="card-title">
                        <i className='fas fa-hospital-user ml-2'></i> Admisiones
                    </h5>
                    <div className="card-content">
                        <h3 id="admissionsActiveCount">{admisionCount?.admissions_count}</h3>
                        <span className="text-span-descripcion">Admisiones este mes</span>
                    </div>
                    <div className="card-button">
                        <button
                            className="btn btn-phoenix-secondary me-1 mb-1"
                            type="button"
                            onClick={handleViewAdmissions}
                        >
                            <span className="fas fa-plus-circle"></span> Nueva Admisión
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};