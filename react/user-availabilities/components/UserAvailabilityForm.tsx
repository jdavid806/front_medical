import React, { useRef, useState } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { InputNumber } from 'primereact/inputnumber';
import { daysOfWeek } from '../../../services/commons';
import { Dropdown } from 'primereact/dropdown';
import { useUsersForSelect } from '../../users/hooks/useUsersForSelect';
import { useAppointmentTypesForSelect } from '../../appointment-types/hooks/useAppointmentTypesForSelect';
import { useBranchesForSelect } from '../../branches/hooks/useBranchesForSelect';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { Stepper, StepperChangeEvent } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';

export type UserAvailabilityFormInputs = {
    user_id: string
    appointment_type_id: string
    appointment_duration: number
}

interface UserAvailabilityFormProps {
    formId: string;
    onHandleSubmit: (data: UserAvailabilityFormInputs) => void;
}

const UserAvailabilityForm: React.FC<UserAvailabilityFormProps> = ({ formId, onHandleSubmit }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger
    } = useForm<UserAvailabilityFormInputs>()
    const onSubmit: SubmitHandler<UserAvailabilityFormInputs> = (data) => onHandleSubmit(data)

    const [office, setOffice] = useState<string | null>(null);
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [startTime, setStartTime] = useState<Nullable<Date>>(null);
    const [endTime, setEndTime] = useState<Nullable<Date>>(null);
    const [freeSlots, setFreeSlots] = useState<{ start: Nullable<Date>, end: Nullable<Date> }[]>([]);

    const { users } = useUsersForSelect()
    const { appointmentTypes } = useAppointmentTypesForSelect()
    const { branches } = useBranchesForSelect()

    const daysOfWeekOptions = daysOfWeek.map((day, index) => ({ label: day, value: index }));

    const stepperRef = useRef(null);

    const handleAddFreeSlot = () => {
        setFreeSlots([...freeSlots, { start: new Date(), end: new Date() }]);
    };

    const handleSlotChange = (index: number, field: string, value: Nullable<Date>) => {
        const updatedFreeSlots = [...freeSlots];
        updatedFreeSlots[index][field] = value;
        setFreeSlots(updatedFreeSlots);
    };

    const handleOnChangeStep = (event: StepperChangeEvent) => {
        console.log(event);
    };

    const getFormErrorMessage = (name: keyof UserAvailabilityFormInputs) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    return (
        <div>
            <form id={formId} className="needs-validation" noValidate onSubmit={handleSubmit(onSubmit)}>
                <Stepper ref={stepperRef} onChangeStep={handleOnChangeStep}>
                    <StepperPanel header="Información general">
                        <div className="mb-3">
                            <Controller
                                name='user_id'
                                control={control}
                                rules={{ required: 'Este campo es requerido' }}
                                render={({ field }) =>
                                    <>
                                        <label htmlFor={field.name} className="form-label">Usuario *</label>
                                        <Dropdown
                                            inputId={field.name}
                                            options={users}
                                            optionLabel='label'
                                            optionValue='value'
                                            filter
                                            placeholder="Seleccione un usuario"
                                            className={classNames('w-100', { 'p-invalid': errors.user_id })}
                                            {...field}
                                        >
                                        </Dropdown>
                                    </>
                                }
                            />
                            {getFormErrorMessage('user_id')}
                        </div>

                        <div className="mb-3">
                            <Controller
                                name='appointment_type_id'
                                control={control}
                                rules={{ required: 'Este campo es requerido' }}
                                render={({ field }) =>
                                    <>
                                        <label htmlFor={field.name} className="form-label">Tipo de cita *</label>
                                        <Dropdown
                                            inputId={field.name}
                                            options={appointmentTypes}
                                            optionLabel='label'
                                            optionValue='value'
                                            filter
                                            placeholder="Seleccione un tipo de cita"
                                            className={classNames('w-100', { 'p-invalid': errors.appointment_type_id })}
                                            defaultValue={field.value}
                                            {...field}
                                        >
                                        </Dropdown>
                                    </>
                                }
                            />
                            {getFormErrorMessage('appointment_type_id')}
                        </div>

                        <div className="mb-3">
                            <Controller
                                name='appointment_duration'
                                control={control}
                                rules={{ required: 'Este campo es requerido' }}
                                render={({ field }) =>
                                    <>
                                        <label htmlFor={field.name} className="form-label">Duración de la cita (minutos)</label>
                                        <InputNumber
                                            inputId={field.name}
                                            min={1}
                                            placeholder="Ingrese la duración"
                                            ref={field.ref}
                                            value={field.value}
                                            onBlur={field.onBlur}
                                            onValueChange={(e) => field.onChange(e)}
                                            className='w-100'
                                            inputClassName={classNames('w-100', { 'p-invalid': errors.appointment_duration })}
                                        />
                                    </>
                                }
                            />
                            {getFormErrorMessage('appointment_duration')}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="appointmentType" className='form-label'>Sucursal *</label>
                            <Dropdown
                                options={branches}
                                optionLabel='label'
                                optionValue='value'
                                filter
                                placeholder="Seleccione una sucursal"
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.value)}
                                className='w-100'>
                            </Dropdown>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Consultorio *</label>
                            <InputText
                                className="w-100"
                                type="text"
                                id="office"
                                value={office}
                                onChange={(e) => setOffice(e.target.value)}
                                placeholder="Ingrese el consultorio"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="days_of_week" className='form-label'>Días de la semana <span className="text-primary">*</span></label>
                            <MultiSelect
                                inputId="days_of_week"
                                name="days_of_week"
                                value={selectedDays}
                                placeholder="Seleccione uno o varios días de la semana"
                                onChange={(e) => setSelectedDays(e.value)}
                                options={daysOfWeekOptions}
                                filter
                                className="w-100 position-relative"
                                panelStyle={{
                                    zIndex: 100000,
                                    padding: 0
                                }}
                                appendTo="self"
                            />
                        </div>
                        <div className="d-flex pt-4 justify-content-end">
                            <Button
                                className='btn btn-primary btn-sm'
                                type='button'
                                label="Siguiente"
                                icon={<i className="fas fa-arrow-right me-1"></i>}
                                iconPos="right"
                                onClick={async (e) => {
                                    let isValid = await trigger();

                                    if (!isValid) {
                                        e.preventDefault()
                                        return
                                    }

                                    (stepperRef.current! as any).nextCallback()
                                }}
                            />
                        </div>
                    </StepperPanel>
                    <StepperPanel header="Horario">
                        <div className="mb-3 row">
                            <div className="col-md-6 d-flex flex-column gap-2">
                                <label htmlFor='start_time' className="form-label">Hora de Inicio</label>
                                <Calendar
                                    id="start_time"
                                    hourFormat="24"
                                    showTime
                                    timeOnly
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.value)} />
                            </div>
                            <div className="col-md-6 d-flex flex-column gap-2">
                                <label htmlFor='end_time' className="form-label">Hora de Fin</label>
                                <Calendar
                                    id="end_time"
                                    hourFormat="24"
                                    showTime
                                    timeOnly
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.value)}
                                />
                            </div>
                        </div>

                        <div className="card mt-3">
                            <div className="card-header">
                                <h6 className="mb-0">Espacios Libres</h6>
                            </div>
                            <div className="card-body">
                                <div className='d-flex flex-column gap-3'>
                                    {freeSlots.length === 0 ? (
                                        <p className="text-muted">Puedes agregar espacios libres a continuación.</p>
                                    ) : (
                                        freeSlots.map((slot, index) => (
                                            <div key={index} className="d-flex gap-2">
                                                <div className="d-flex flex-grow-1 gap-2">
                                                    <div className="d-flex flex-column flex-grow-1 gap-2">
                                                        <label htmlFor={`start_${index}`} className="form-label">Inicio</label>
                                                        <Calendar
                                                            id={`start_${index}`}
                                                            hourFormat="24"
                                                            showTime
                                                            timeOnly
                                                            value={slot.start}
                                                            onChange={(e) => handleSlotChange(index, 'start', e.value)}
                                                        />
                                                    </div>
                                                    <div className="d-flex flex-column flex-grow-1 gap-2">
                                                        <label htmlFor={`end_${index}`} className="form-label">Fin</label>
                                                        <Calendar
                                                            id={`end_${index}`}
                                                            hourFormat="24"
                                                            showTime
                                                            timeOnly
                                                            value={slot.end}
                                                            onChange={(e) => handleSlotChange(index, 'end', e.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="d-flex">
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger align-self-end"
                                                        onClick={() => setFreeSlots(freeSlots.filter((_, i) => i !== index))}>
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <button type="button" className="btn btn-secondary mt-2" onClick={handleAddFreeSlot}>Agregar Espacio Libre</button>
                            </div>
                        </div>
                        <div className="d-flex pt-4 justify-content-end gap-3">
                            <Button
                                className='btn btn-secondary btn-sm'
                                type='button'
                                label="Atrás"
                                icon={<i className="fas fa-arrow-left me-1"></i>}
                                onClick={() => {
                                    console.log('yendo patras');
                                    (stepperRef.current! as any).prevCallback()
                                }}
                            />
                            <Button
                                className='btn btn-primary btn-sm'
                                label="Guardar"
                                type='submit'
                                icon={<i className="fas fa-save me-1"></i>}
                                iconPos="right"
                            />
                        </div>
                    </StepperPanel>
                </Stepper>
            </form>
        </div>
    );
};

export default UserAvailabilityForm;