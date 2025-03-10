import React from 'react';
import { AppointmentTableItem } from '../models/models';
import { CustomModal } from "../components/CustomModal";

interface RescheduleAppointmentProps {
    show: boolean;
    onHide?: () => void;
    selectedAppointments: AppointmentTableItem[]
}

export const ModuleFormModal: React.FC<RescheduleAppointmentProps> = ({ show, onHide, selectedAppointments }) => {

    const formId = 'createModule'

    return (
        <CustomModal
            show={show}
            onHide={onHide}
            title='Crear Módulo'
            footerTemplate={
                <>
                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancelar cita</button>
                    <button type="submit" className="btn btn-primary" id="btnReagendar">Reagendar</button>
                </>
            }
        >
            <form id={formId}>
                <div className="mb-3">
                    <label htmlFor="razonReagendamiento" className="form-label">Razón de reagendamiento</label>
                    <textarea className="form-control" id="razonReagendamiento" rows={3}></textarea>
                </div>
                <div className="mb-3">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="autoReagendar" name="autoReagendar" checked />
                        <label className="form-check-label" htmlFor="autoReagendar">Reagendar automáticamente</label>
                    </div>
                </div>

                <div className="d-none" id="manualReagendarOptions">
                    <div className="mb-3">
                        <label htmlFor="especialidadReagendar" className="form-label">Especialidad</label>
                        <select className="form-select" id="especialidadReagendar" aria-label="Especialidad">
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
                        <select className="form-select" id="doctorReagendar" required name="assigned_user_id">
                            <option value="" selected>Seleccione a quien sera asignada</option>
                        </select>
                        <div className="invalid-feedback">Por favor seleccione a quien sera asignada.</div>
                    </div>
                </div>
            </form>
        </CustomModal>
    );
};
