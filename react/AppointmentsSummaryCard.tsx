import React from 'react';

export const AppointmentsSummaryCard = () => {
    return (
        <div
            className="card"
            style={{
                "maxWidth": '18rem'
            }}
        >
            <div className="card-body">
                <h5 className="card-title"><span data-feather="calendar"></span> Citas Generadas</h5>
                <div className="mb-3">
                    <h3 id="appointmentsActiveCount">Cargando...</h3>
                    Citas generadas este mes
                </div>
                <button className="btn btn-phoenix-secondary me-1 mb-1" type="button" data-bs-toggle="modal"
                    data-bs-target="#modalCrearCita">
                    <span className="far fa-calendar-plus"></span> Nueva Cita
                </button>
            </div>
        </div>
    );
};
