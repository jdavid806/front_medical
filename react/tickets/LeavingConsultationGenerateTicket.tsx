import React, { useEffect, useState } from 'react';
import { TicketDto, Patient } from '../models/models';
import { ticketService, patientService } from '../../services/api';
import Swal from 'sweetalert2';

interface LeavingConsultationGenerateTicketProps {
    patientId?: string
}

export const LeavingConsultationGenerateTicket: React.FC<LeavingConsultationGenerateTicketProps> = ({ patientId = new URLSearchParams(window.location.search).get('patient_id') }) => {
    const [formData, setFormData] = useState({
        patient_name: '',
        phone: '',
        reason: 'EXIT_CONSULTATION',
        priority: 'NONE'
    });
    const [ticket, setTicket] = useState<TicketDto | null>(null); // <-- STATE DEFINIDO
    const [patient, setPatient] = useState<Patient | null>(null);
    const [patientDni, setPatientDni] = useState('');
    const [loading, setLoading] = useState({
        ticket: false,
        patient: false
    });
    const [error, setError] = useState('');
    const [showPatientInputs, setShowPatientInputs] = useState(false);

    const PRIORITY_OPTIONS = [
        {
            value: 'NONE',
            label: 'Sin Prioridad',
            icon: 'fas fa-circle'
        },
        {
            value: 'PREGNANT',
            label: 'Embarazada',
            icon: 'fas fa-heart'
        },
        {
            value: 'SENIOR',
            label: 'Adulto Mayor',
            icon: 'fas fa-user'
        },
        {
            value: 'DISABILITY',
            label: 'Discapacidad',
            icon: 'fas fa-wheelchair'
        },
        {
            value: 'CHILDREN_BABY',
            label: 'Niño/bebé',
            icon: 'fas fa-child'
        }
    ];

    useEffect(() => {
        if (patientId) {
            console.log("patientId for leaving consult: ", patientId);

            handleSearchPatient();
        }
    }, [patientId]);

    // Buscar paciente cuando cambia el ID
    const handleSearchPatient = async () => {

        setLoading(prev => ({ ...prev, patient: true }));
        setError('');

        try {
            const response = await patientService.get(patientId);

            console.log("response: ", response);

            setPatient(response.data);
            setFormData(prev => ({
                ...prev,
                patient_name: response.first_name || '' + ' ' + response.middle_name || '' + ' ' + response.last_name || '' + ' ' + response.second_last_name || '',
                phone: response.whatsapp
            }));
            setShowPatientInputs(true);
        } catch (err) {
            setPatient(null);
            setShowPatientInputs(true);
            setFormData(prev => ({ ...prev, patient_name: '', phone: '' }));
            setError('Paciente no encontrado, ingrese número telefónico manualmente');
        } finally {
            setLoading(prev => ({ ...prev, patient: false }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(prev => ({ ...prev, ticket: true }));
        setError('');

        try {
            const ticketData = {
                ...formData,
                branch_id: 3,
                patient_id: patient?.id
            };

            const response = await ticketService.create(ticketData);
            setTicket(response);
        } catch (err) {
            setError(err.response?.data?.message || 'Error generando turno');
        } finally {
            setLoading(prev => ({ ...prev, ticket: false }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const printElement = (element: any) => {
        const printContents = element.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Generar Nuevo Turno</h2>

            <div className="row justify-content-center">
                <div className="col-md-6 card p-4">
                    <form onSubmit={handleSubmit}>
                        {/* Teléfono (condicional) */}
                        {showPatientInputs && (
                            <>
                                <div className="mb-3">
                                    <label className="form-label">Número de Identificación</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ingrese identificación"
                                        value={patientDni}
                                        onChange={(e) => setPatientDni(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Nombre del paciente *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="patient_name"
                                        value={formData.patient_name}
                                        onChange={handleChange}
                                        required={showPatientInputs}
                                        disabled={!!patient}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Teléfono *</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required={showPatientInputs}
                                        disabled={!!patient}
                                    />
                                </div>
                            </>
                        )}

                        {error && <div className="alert alert-danger">{error}</div>}

                        {formData.phone && formData.phone !== '' && (
                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={loading.ticket}
                            >
                                {loading.ticket ? 'Generando...' : 'Generar Turno'}
                            </button>
                        )}
                    </form>
                </div>
            </div>

            {/* Mostrar ticket generado */}
            {ticket && (
                <div id='ticket-printable' className="mt-4 p-4 bg-light rounded text-center">
                    <h3 className="text-success">Turno Generado</h3>
                    <div className="h2 fw-bold text-primary">{ticket.ticket_number}</div>
                    <div className="text-muted">Prioridad: {PRIORITY_OPTIONS.find((p) => p.value === ticket.priority)?.label}</div>
                    <div className="mt-3">
                        <button
                            type='button'
                            className="btn btn-outline-secondary me-2"
                            onClick={() => printElement(document.getElementById('ticket-printable'))}
                        >
                            Imprimir
                        </button>
                        <button
                            type='button'
                            className="btn btn-outline-success"
                            onClick={async () => {
                                const ticketPrintable = document.getElementById('ticket-printable');

                                if (ticketPrintable) {
                                    const parametrosMensaje = {
                                        number: formData.phone,
                                        text: ticketPrintable.innerHTML,
                                    };

                                    try {
                                        const response = await fetch("https://apiwhatsapp.medicalsoft.ai/message/sendText/instancia_carlos", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                                apikey: "034B981E0055-4366-83B6-2113BE36234B",
                                            },
                                            body: JSON.stringify(parametrosMensaje),
                                        });

                                        const result = await response.json();

                                        Swal.fire({
                                            title: '¡Notificación enviada!',
                                            icon: 'success',
                                            confirmButtonText: 'Ok'
                                        });
                                    } catch (error) {
                                        console.error("Error al enviar el mensaje:", error);
                                    }
                                }
                            }}
                        >
                            Enviar por WhatsApp
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};