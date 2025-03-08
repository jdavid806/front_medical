import React from 'react';
import { AppointmentTableItem } from '../models/models';
import { CustomModal } from "../components/CustomModal";
import { useState } from 'react';

interface RescheduleAppointmentProps {
    show: boolean;
    onHide?: () => void;
    selectedAppointments: AppointmentTableItem[]
}

export const RescheduleAppointmentModal: React.FC<RescheduleAppointmentProps> = ({ show, onHide, selectedAppointments }) => {

    const formId = 'rescheduleAppointments'
    const [automaticReschedule, setAutomaticReschedule] = useState(true)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(selectedAppointments, e);
    }

    return (
        <CustomModal
            show={show}
            onHide={onHide}
            title='Reagendar citas'
            footerTemplate={
                <>
                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancelar cita</button>
                    <button type="submit" form={formId} className="btn btn-primary" id="btnReagendar">Reagendar</button>
                </>
            }
        >
            <form id={formId} onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="razonReagendamiento" className="form-label">Razón de reagendamiento</label>
                    <textarea className="form-control" id="razonReagendamiento" rows={3}></textarea>
                </div>
                <div className="mb-3">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="autoReagendar"
                            name="autoReagendar"
                            checked={automaticReschedule}
                            onChange={(e) => setAutomaticReschedule(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="autoReagendar">Reagendar automáticamente</label>
                    </div>
                </div>

                {!automaticReschedule &&
                    <div className="d-none">
                        <div className="mb-3">
                            <label htmlFor="especialidadReagendar" className="form-label">Especialidad</label>
                            <select className="form-select" id="especialidadReagendar" aria-label="Especialidad" defaultValue={""}>
                                <option value="">Seleccione una especialidad</option>
                            </select>
                        </div>
                        <div className="row g-2 mb-3">
                            <div className="col">
                                <label htmlFor="fechaReagendar" className="form-label">Fecha</label>
                                <input className="form-control datetimepicker flatpickr-input" id="fechaReagendar" name="fechaReagendar" type="text" placeholder="dd/mm/yyyy" data-options='{"dateFormat":"d/m/y","disableMobile":true}' />
                            </div>
                            <div className="col">
                                <label htmlFor="horaReagendar" className="form-label">Hora</label>
                                <input className="form-control datetimepicker flatpickr-input" id="horaReagendar" name="horaReagendar" type="text" placeholder="HH:MM" data-options='{"enableTime":true,"noCalendar":true,"dateFormat":"H:i","disableMobile":true,"allowInput":true}' />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="doctorReagendar" className="form-label">Doctor(a)</label>
                            <select className="form-select" id="doctorReagendar" required name="assigned_user_id" defaultValue={""}>
                                <option value="">Seleccione a quien sera asignada</option>
                            </select>
                            <div className="invalid-feedback">Por favor seleccione a quien sera asignada.</div>
                        </div>
                    </div>
                }
            </form>
        </CustomModal>
    );
};
