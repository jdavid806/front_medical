import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';
const AppointmentModal = ({
  visible,
  onHide
}) => {
  const [step, setStep] = useState(1);
  const [specialty, setSpecialty] = useState('');
  const [date, setDate] = useState(null);
  const [time, setTime] = useState('');
  const [doctor, setDoctor] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  const [procedure, setProcedure] = useState('');
  const [consultationPurpose, setConsultationPurpose] = useState('');
  const [consultationType, setConsultationType] = useState('');
  const [externalCause, setExternalCause] = useState('');
  const [recurringAppointment, setRecurringAppointment] = useState(false);
  const [frequency, setFrequency] = useState('');
  const [repetitions, setRepetitions] = useState(null);
  const [patient, setPatient] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const specialties = [{
    label: 'Medicina General',
    value: 'medicina_general'
  }, {
    label: 'Cardiología',
    value: 'cardiologia'
  }, {
    label: 'Dermatología',
    value: 'dermatologia'
  }];
  const times = [{
    label: '08:00 AM',
    value: '08:00'
  }, {
    label: '09:00 AM',
    value: '09:00'
  }, {
    label: '10:00 AM',
    value: '10:00'
  }];
  const doctors = [{
    label: 'Dr. Juan Pérez',
    value: 'juan_perez'
  }, {
    label: 'Dra. María Gómez',
    value: 'maria_gomez'
  }];
  const procedures = [{
    label: 'Consulta General',
    value: 'consulta_general'
  }, {
    label: 'Examen de Sangre',
    value: 'examen_sangre'
  }];
  const consultationPurposes = [{
    label: 'Promoción',
    value: 'promotion'
  }, {
    label: 'Prevención',
    value: 'prevention'
  }, {
    label: 'Tratamiento',
    value: 'treatment'
  }, {
    label: 'Rehabilitación',
    value: 'rehabilitation'
  }];
  const consultationTypes = [{
    label: 'Control',
    value: 'control'
  }, {
    label: 'Urgencia',
    value: 'urgencia'
  }, {
    label: 'Primera vez',
    value: 'primera_vez'
  }, {
    label: 'Seguimiento',
    value: 'seguimiento'
  }];
  const externalCauses = [{
    label: 'Accidente',
    value: 'accidente'
  }, {
    label: 'Otra',
    value: 'otra'
  }, {
    label: 'No aplica',
    value: 'no_aplica'
  }];
  const frequencies = [{
    label: 'Diario',
    value: 'diario'
  }, {
    label: 'Semanal',
    value: 'semanal'
  }, {
    label: 'Mensual',
    value: 'mensual'
  }, {
    label: 'Bimestral',
    value: 'bimestral'
  }, {
    label: 'Semestral',
    value: 'semestral'
  }];
  const patients = [{
    label: 'Paciente 1',
    value: 'paciente1'
  }, {
    label: 'Paciente 2',
    value: 'paciente2'
  }];
  const nextStep = () => {
    setStep(step + 1);
  };
  const prevStep = () => {
    setStep(step - 1);
  };
  const footerContent = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    onClick: onHide,
    className: "btn btn-secondary"
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    onClick: () => console.log('Guardar'),
    className: "btn btn-primary",
    autoFocus: true
  }));
  return /*#__PURE__*/React.createElement(Dialog, {
    header: "Nueva Cita",
    visible: visible,
    style: {
      width: '50vw'
    },
    modal: true,
    footer: footerContent,
    onHide: onHide
  }, /*#__PURE__*/React.createElement("div", {
    className: "steps-container mb-4"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "steps"
  }, /*#__PURE__*/React.createElement("li", {
    className: `step ${step === 1 ? 'active' : ''}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "step-number"
  }, "1"), /*#__PURE__*/React.createElement("span", {
    className: "step-label"
  }, "Doctor (a)")), /*#__PURE__*/React.createElement("li", {
    className: `step ${step === 2 ? 'active' : ''}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "step-number"
  }, "2"), /*#__PURE__*/React.createElement("span", {
    className: "step-label"
  }, "Cita")), /*#__PURE__*/React.createElement("li", {
    className: `step ${step === 3 ? 'active' : ''}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "step-number"
  }, "3"), /*#__PURE__*/React.createElement("span", {
    className: "step-label"
  }, "Paciente")))), step === 1 && /*#__PURE__*/React.createElement("div", {
    className: "wizard-step"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "specialty",
    className: "form-label"
  }, "Especialidad m\xE9dica"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "specialty",
    value: specialty,
    options: specialties,
    onChange: e => setSpecialty(e.value),
    placeholder: "Seleccione",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "date",
    className: "form-label"
  }, "Fecha de la consulta"), /*#__PURE__*/React.createElement(Calendar, {
    id: "date",
    value: date,
    onChange: e => setDate(e.value || null),
    placeholder: "Seleccione",
    dateFormat: "dd/mm/yy",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "time",
    className: "form-label"
  }, "Hora de la consulta"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "time",
    value: time,
    options: times,
    onChange: e => setTime(e.value),
    placeholder: "Seleccione",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "doctor",
    className: "form-label"
  }, "Doctor(a)"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "doctor",
    value: doctor,
    options: doctors,
    onChange: e => setDoctor(e.value),
    placeholder: "Seleccione",
    className: "w-100"
  }))), step === 2 && /*#__PURE__*/React.createElement("div", {
    className: "wizard-step"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Tipo de cita"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-check"
  }, /*#__PURE__*/React.createElement(RadioButton, {
    inputId: "presencial",
    name: "appointmentType",
    value: "presencial",
    onChange: e => setAppointmentType(e.value),
    checked: appointmentType === 'presencial'
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "presencial",
    className: "form-check-label"
  }, "Presencial")), /*#__PURE__*/React.createElement("div", {
    className: "form-check ms-3"
  }, /*#__PURE__*/React.createElement(RadioButton, {
    inputId: "domiciliaria",
    name: "appointmentType",
    value: "domiciliaria",
    onChange: e => setAppointmentType(e.value),
    checked: appointmentType === 'domiciliaria'
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "domiciliaria",
    className: "form-check-label"
  }, "Domiciliaria")), /*#__PURE__*/React.createElement("div", {
    className: "form-check ms-3"
  }, /*#__PURE__*/React.createElement(RadioButton, {
    inputId: "virtual",
    name: "appointmentType",
    value: "virtual",
    onChange: e => setAppointmentType(e.value),
    checked: appointmentType === 'virtual'
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "virtual",
    className: "form-check-label"
  }, "Virtual")))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "procedure",
    className: "form-label"
  }, "Procedimiento"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "procedure",
    value: procedure,
    options: procedures,
    onChange: e => setProcedure(e.value),
    placeholder: "Seleccione",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "consultationPurpose",
    className: "form-label"
  }, "Finalidad de la consulta"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "consultationPurpose",
    value: consultationPurpose,
    options: consultationPurposes,
    onChange: e => setConsultationPurpose(e.value),
    placeholder: "Seleccione",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "consultationType",
    className: "form-label"
  }, "Tipo de consulta"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "consultationType",
    value: consultationType,
    options: consultationTypes,
    onChange: e => setConsultationType(e.value),
    placeholder: "Seleccione",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "externalCause",
    className: "form-label"
  }, "Causa externa"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "externalCause",
    value: externalCause,
    options: externalCauses,
    onChange: e => setExternalCause(e.value),
    placeholder: "Seleccione",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-check"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "recurring",
    checked: recurringAppointment,
    onChange: e => setRecurringAppointment(e.checked || false)
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "recurring",
    className: "form-check-label"
  }, "Cita recurrente"))), recurringAppointment && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "frequency",
    className: "form-label"
  }, "Frecuencia de la cita"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "frequency",
    value: frequency,
    options: frequencies,
    onChange: e => setFrequency(e.value),
    placeholder: "Seleccione",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "repetitions",
    className: "form-label"
  }, "N\xFAmero de repeticiones"), /*#__PURE__*/React.createElement(InputNumber, {
    id: "repetitions",
    value: repetitions,
    onValueChange: e => setRepetitions(e.value || null),
    mode: "decimal",
    min: 1,
    className: "w-100"
  })))), step === 3 && /*#__PURE__*/React.createElement("div", {
    className: "wizard-step"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "patient",
    className: "form-label"
  }, "Paciente"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "patient",
    value: patient,
    options: patients,
    onChange: e => setPatient(e.value),
    placeholder: "Seleccione",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "whatsapp",
    className: "form-label"
  }, "Whatsapp"), /*#__PURE__*/React.createElement(InputText, {
    id: "whatsapp",
    value: whatsapp,
    onChange: e => setWhatsapp(e.target.value),
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "email",
    className: "form-label"
  }, "Correo Electr\xF3nico"), /*#__PURE__*/React.createElement(InputText, {
    id: "email",
    value: email,
    onChange: e => setEmail(e.target.value),
    className: "w-100"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Anterior",
    onClick: prevStep,
    className: "btn btn-secondary",
    disabled: step === 1
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Siguiente",
    onClick: nextStep,
    className: "btn btn-primary",
    disabled: step === 3
  })));
};
export default AppointmentModal;