import React from 'react';
import { AppointmentFormModal } from './appointments/AppointmentFormModal';

export const AppointmentsSummaryCard = () => {

    const [showAppointmentFormModal, setShowAppointmentFormModal] = React.useState(false);

    return (
        <div
            className="card bg-secondary"
            style={{
                "maxWidth": '18rem'
            }}
        >
            <div className="card-body">
                <h5 className="card-title text-secondary-lighter"><span data-feather="calendar"></span> Citas Generadas</h5>
                <div className="mb-3">
                    <h3 className='text-secondary-lighter' id="appointmentsActiveCount"><span className='text-secondary-lighter'>Cargando...</span></h3>
                    <h5 className='text-secondary-lighter'>Citas este mes</h5>
                </div>
                <button className="btn btn-phoenix-secondary me-1 mb-1" type="button" onClick={() => setShowAppointmentFormModal(true)}>
                    <span className="far fa-calendar-plus"></span> Nueva Cita
                </button>
                <AppointmentFormModal
                    isOpen={showAppointmentFormModal}
                    onClose={() => setShowAppointmentFormModal(false)}
                />
            </div>
        </div>
    );
};
