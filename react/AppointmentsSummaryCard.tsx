import React from 'react';
import { AppointmentFormModal } from './appointments/AppointmentFormModal';

export const AppointmentsSummaryCard = () => {
    const [showAppointmentFormModal, setShowAppointmentFormModal] = React.useState(false);

    return (
        <div className="card dashboard-card">
            <div className="card-body">
                <h5 className="card-title">
                    <i className='far fa-calendar-check ml-2'></i> Citas Generadas
                </h5>
                <div className="card-content">
                    <h3 id="appointmentsActiveCount">Cargando...</h3>
                    <span className="text-span-descripcion">Citas este mes</span>
                </div>
                <div className="card-button">
                    <button
                        className="btn btn-phoenix-secondary me-1 mb-1"
                        type="button"
                        onClick={() => setShowAppointmentFormModal(true)}
                    >
                        <span className="far fa-calendar-plus"></span> Nueva Cita
                    </button>
                </div>
                <AppointmentFormModal
                    isOpen={showAppointmentFormModal}
                    onClose={() => setShowAppointmentFormModal(false)}
                />
            </div>
        </div>
    );
};