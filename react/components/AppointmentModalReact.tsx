import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';

interface AppointmentModalProps {
    visible: boolean;
    onHide: () => void;
}

const AppointmentModalReact: React.FC<AppointmentModalProps> = ({ visible, onHide }) => {
    const [step, setStep] = useState(1);
    const [specialty, setSpecialty] = useState('');
    const [date, setDate] = useState<Date | null>(null);
    const [time, setTime] = useState('');
    const [doctor, setDoctor] = useState('');
    const [appointmentType, setAppointmentType] = useState('');
    const [procedure, setProcedure] = useState('');
    const [consultationPurpose, setConsultationPurpose] = useState('');
    const [consultationType, setConsultationType] = useState('');
    const [externalCause, setExternalCause] = useState('');
    const [recurringAppointment, setRecurringAppointment] = useState(false);
    const [frequency, setFrequency] = useState('');
    const [repetitions, setRepetitions] = useState<number | null>(null);
    const [patient, setPatient] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [email, setEmail] = useState('');

    const specialties = [
        { label: 'Medicina General', value: 'medicina_general' },
        { label: 'Cardiología', value: 'cardiologia' },
        { label: 'Dermatología', value: 'dermatologia' },
    ];

    const times = [
        { label: '08:00 AM', value: '08:00' },
        { label: '09:00 AM', value: '09:00' },
        { label: '10:00 AM', value: '10:00' },
    ];

    const doctors = [
        { label: 'Dr. Juan Pérez', value: 'juan_perez' },
        { label: 'Dra. María Gómez', value: 'maria_gomez' },
    ];

    const procedures = [
        { label: 'Consulta General', value: 'consulta_general' },
        { label: 'Examen de Sangre', value: 'examen_sangre' },
    ];

    const consultationPurposes = [
        { label: 'Promoción', value: 'promotion' },
        { label: 'Prevención', value: 'prevention' },
        { label: 'Tratamiento', value: 'treatment' },
        { label: 'Rehabilitación', value: 'rehabilitation' },
    ];

    const consultationTypes = [
        { label: 'Control', value: 'control' },
        { label: 'Urgencia', value: 'urgencia' },
        { label: 'Primera vez', value: 'primera_vez' },
        { label: 'Seguimiento', value: 'seguimiento' },
    ];

    const externalCauses = [
        { label: 'Accidente', value: 'accidente' },
        { label: 'Otra', value: 'otra' },
        { label: 'No aplica', value: 'no_aplica' },
    ];

    const frequencies = [
        { label: 'Diario', value: 'diario' },
        { label: 'Semanal', value: 'semanal' },
        { label: 'Mensual', value: 'mensual' },
        { label: 'Bimestral', value: 'bimestral' },
        { label: 'Semestral', value: 'semestral' },
    ];

    const patients = [
        { label: 'Paciente 1', value: 'paciente1' },
        { label: 'Paciente 2', value: 'paciente2' },
    ];

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const footerContent = (
        <div>
            <Button label="Cancelar" onClick={onHide} className="btn btn-secondary" />
            <Button label="Guardar" onClick={() => console.log('Guardar')} className="btn btn-primary" autoFocus />
        </div>
    );

    return (
        <Dialog header="Nueva Cita" visible={visible} style={{ width: '50vw' }} modal footer={footerContent} onHide={onHide}>
            <div className="steps-container mb-4">
                <ul className="steps">
                    <li className={`step ${step === 1 ? 'active' : ''}`}>
                        <span className="step-number">1</span>
                        <span className="step-label">Doctor (a)</span>
                    </li>
                    <li className={`step ${step === 2 ? 'active' : ''}`}>
                        <span className="step-number">2</span>
                        <span className="step-label">Cita</span>
                    </li>
                    <li className={`step ${step === 3 ? 'active' : ''}`}>
                        <span className="step-number">3</span>
                        <span className="step-label">Paciente</span>
                    </li>
                </ul>
            </div>

            {step === 1 && (
                <div className="wizard-step">
                    <div className="mb-3">
                        <label htmlFor="specialty" className="form-label">Especialidad médica</label>
                        <Dropdown id="specialty" value={specialty} options={specialties} onChange={(e) => setSpecialty(e.value)} placeholder="Seleccione" className="w-100" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="date" className="form-label">Fecha de la consulta</label>
                        <Calendar id="date" value={date} onChange={(e) => setDate(e.value || null)} placeholder="Seleccione" dateFormat="dd/mm/yy" className="w-100" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="time" className="form-label">Hora de la consulta</label>
                        <Dropdown id="time" value={time} options={times} onChange={(e) => setTime(e.value)} placeholder="Seleccione" className="w-100" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="doctor" className="form-label">Doctor(a)</label>
                        <Dropdown id="doctor" value={doctor} options={doctors} onChange={(e) => setDoctor(e.value)} placeholder="Seleccione" className="w-100" />
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="wizard-step">
                    <div className="mb-3">
                        <label className="form-label">Tipo de cita</label>
                        <div className="d-flex align-items-center">
                            <div className="form-check">
                                <RadioButton inputId="presencial" name="appointmentType" value="presencial" onChange={(e) => setAppointmentType(e.value)} checked={appointmentType === 'presencial'} />
                                <label htmlFor="presencial" className="form-check-label">Presencial</label>
                            </div>
                            <div className="form-check ms-3">
                                <RadioButton inputId="domiciliaria" name="appointmentType" value="domiciliaria" onChange={(e) => setAppointmentType(e.value)} checked={appointmentType === 'domiciliaria'} />
                                <label htmlFor="domiciliaria" className="form-check-label">Domiciliaria</label>
                            </div>
                            <div className="form-check ms-3">
                                <RadioButton inputId="virtual" name="appointmentType" value="virtual" onChange={(e) => setAppointmentType(e.value)} checked={appointmentType === 'virtual'} />
                                <label htmlFor="virtual" className="form-check-label">Virtual</label>
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="procedure" className="form-label">Procedimiento</label>
                        <Dropdown id="procedure" value={procedure} options={procedures} onChange={(e) => setProcedure(e.value)} placeholder="Seleccione" className="w-100" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="consultationPurpose" className="form-label">Finalidad de la consulta</label>
                        <Dropdown id="consultationPurpose" value={consultationPurpose} options={consultationPurposes} onChange={(e) => setConsultationPurpose(e.value)} placeholder="Seleccione" className="w-100" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="consultationType" className="form-label">Tipo de consulta</label>
                        <Dropdown id="consultationType" value={consultationType} options={consultationTypes} onChange={(e) => setConsultationType(e.value)} placeholder="Seleccione" className="w-100" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="externalCause" className="form-label">Causa externa</label>
                        <Dropdown id="externalCause" value={externalCause} options={externalCauses} onChange={(e) => setExternalCause(e.value)} placeholder="Seleccione" className="w-100" />
                    </div>
                    <div className="mb-3">
                        <div className="form-check">
                            <Checkbox inputId="recurring" checked={recurringAppointment} onChange={(e) => setRecurringAppointment(e.checked || false)} />
                            <label htmlFor="recurring" className="form-check-label">Cita recurrente</label>
                        </div>
                    </div>
                    {recurringAppointment && (
                        <>
                            <div className="mb-3">
                                <label htmlFor="frequency" className="form-label">Frecuencia de la cita</label>
                                <Dropdown id="frequency" value={frequency} options={frequencies} onChange={(e) => setFrequency(e.value)} placeholder="Seleccione" className="w-100" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="repetitions" className="form-label">Número de repeticiones</label>
                                <InputNumber id="repetitions" value={repetitions} onValueChange={(e) => setRepetitions(e.value || null)} mode="decimal" min={1} className="w-100" />
                            </div>
                        </>
                    )}
                </div>
            )}

            {step === 3 && (
                <div className="wizard-step">
                    <div className="mb-3">
                        <label htmlFor="patient" className="form-label">Paciente</label>
                        <Dropdown id="patient" value={patient} options={patients} onChange={(e) => setPatient(e.value)} placeholder="Seleccione" className="w-100" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="whatsapp" className="form-label">Whatsapp</label>
                        <InputText id="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-100" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Correo Electrónico</label>
                        <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-100" />
                    </div>
                </div>
            )}

            <div className="d-flex justify-content-between">
                <Button label="Anterior" onClick={prevStep} className="btn btn-secondary" disabled={step === 1} />
                <Button label="Siguiente" onClick={nextStep} className="btn btn-primary" disabled={step === 3} />
            </div>
        </Dialog>
    );
}

export default AppointmentModalReact;