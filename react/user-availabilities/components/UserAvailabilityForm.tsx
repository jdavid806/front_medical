import React, { useRef, useState } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { InputNumber } from 'primereact/inputnumber';
import { daysOfWeek } from '../../../services/commons';
import { Dropdown } from 'primereact/dropdown';
import { useAppointmentTypesForSelect } from '../../appointment-types/hooks/useAppointmentTypesForSelect';
import { useBranchesForSelect } from '../../branches/hooks/useBranchesForSelect';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { useEffect } from 'react';
import { useUsers } from '../../users/hooks/useUsers';
import { UserDto } from '../../models/models';
import { useModules } from '../../modules/hooks/useModules';

export type UserAvailabilityFormInputs = {
    user_id: string
    appointment_type_id: string
    appointment_duration: number
    branch_id: string
    office: string
    module_id: string
    days_of_week: number[]
    start_time: Nullable<Date>
    end_time: Nullable<Date>
    free_slots: {
        start_time: Nullable<Date>;
        end_time: Nullable<Date>;
    }[];
}

interface UserAvailabilityFormProps {
    formId: string;
    onHandleSubmit: (data: UserAvailabilityFormInputs) => void;
    initialData?: UserAvailabilityFormInputs;
}

const UserAvailabilityForm: React.FC<UserAvailabilityFormProps> = ({ formId, onHandleSubmit, initialData }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger,
        watch,
        resetField,
        getValues,
        setValue,
        reset
    } = useForm<UserAvailabilityFormInputs>({
        defaultValues: initialData || {
            user_id: '',
            appointment_type_id: '',
            appointment_duration: 0,
            branch_id: '1',
            office: '',
            module_id: '',
            days_of_week: [],
            start_time: null,
            end_time: null,
            free_slots: []
        }
    })
    const onSubmit: SubmitHandler<UserAvailabilityFormInputs> = (data) => onHandleSubmit(data)

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "free_slots"
    });

    const [selectedUser, setSelectedUser] = useState<UserDto | undefined>(undefined);
    const watchUserId = watch('user_id');

    const { users } = useUsers()
    const [usersForSelect, setUsersForSelect] = useState<{ value: string, label: string }[]>([])

    const { appointmentTypes } = useAppointmentTypesForSelect()
    const { branches } = useBranchesForSelect()
    const { modules } = useModules()

    const daysOfWeekOptions = daysOfWeek.map((day, index) => ({ label: day, value: index }));

    const stepperRef = useRef(null);

    const getFormErrorMessage = (name: keyof UserAvailabilityFormInputs) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    useEffect(() => {
        reset(initialData || {
            user_id: '',
            appointment_type_id: '',
            appointment_duration: 0,
            branch_id: '1',
            office: '',
            module_id: '',
            days_of_week: [],
            start_time: null,
            end_time: null,
            free_slots: []
        });
    }, [initialData, reset]);

    useEffect(() => {
        setUsersForSelect(users.map(user => {
            return {
                value: user.id.toString(),
                label: `${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''} ${user.second_last_name || ''}`
            }
        }))
    }, [users])

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (
                name === 'start_time' &&
                value.start_time &&
                value.end_time &&
                value.start_time > value.end_time
            ) {
                setValue('end_time', value.start_time);
            } else if (
                name === 'end_time' &&
                value.start_time &&
                value.end_time &&
                value.end_time < value.start_time
            ) {
                setValue('start_time', value.end_time);
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, setValue]);

    useEffect(() => {
        if (watchUserId) {
            const user = users.find((role: any) => role.id == watchUserId);
            setSelectedUser(user);

            resetField('office');
            resetField('module_id');
        } else {
            setSelectedUser(undefined);
        }
    }, [watchUserId, users]);

    return (
        <div>
            <form id={formId} className="needs-validation" noValidate onSubmit={handleSubmit(onSubmit)}>
                <Stepper ref={stepperRef}>
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
                                            options={usersForSelect}
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
                        {selectedUser && selectedUser.role.group === 'DOCTOR' && (
                            <div className="mb-3">
                                <Controller
                                    name='office'
                                    control={control}
                                    render={({ field }) =>
                                        <>
                                            <label className="form-label">Consultorio</label>
                                            <InputText
                                                id={field.name}
                                                type="text"
                                                className="w-100"
                                                placeholder="Ingrese el consultorio"
                                                {...field}
                                            />
                                        </>
                                    }
                                />
                            </div>
                        )}

                        {selectedUser && selectedUser.role.group === 'ADMIN' && (
                            <div className="mb-3">
                                <Controller
                                    name='module_id'
                                    control={control}
                                    render={({ field }) =>
                                        <>
                                            <label htmlFor={field.name} className="form-label">Modulo</label>
                                            <Dropdown
                                                inputId={field.name}
                                                options={modules}
                                                optionLabel='name'
                                                optionValue='id'
                                                filter
                                                placeholder="Seleccione un modulo"
                                                className={classNames('w-100', { 'p-invalid': errors.user_id })}
                                                {...field}
                                            >
                                            </Dropdown>
                                        </>
                                    }
                                />
                            </div>
                        )}

                        {selectedUser && selectedUser.role.group === 'DOCTOR' && (
                            <>
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
                            </>
                        )}

                        {/* <div className="mb-3">
                            <Controller
                                name='branch_id'
                                control={control}
                                rules={{ required: 'Este campo es requerido' }}
                                render={({ field }) =>
                                    <>
                                        <label htmlFor={field.name} className='form-label'>Sucursal *</label>
                                        <Dropdown
                                            inputId={field.name}
                                            options={branches}
                                            optionLabel='label'
                                            optionValue='value'
                                            filter
                                            placeholder="Seleccione una sucursal"
                                            className={classNames('w-100', { 'p-invalid': errors.branch_id })}
                                            defaultValue={field.value}
                                            {...field}
                                        >
                                        </Dropdown>
                                    </>
                                }
                            />
                            {getFormErrorMessage('branch_id')}
                        </div> */}

                        <div className="mb-3">
                            <Controller
                                name='days_of_week'
                                control={control}
                                rules={{ required: 'Este campo es requerido' }}
                                render={({ field }) =>
                                    <>
                                        <label htmlFor={field.name} className='form-label'>Días de la semana *</label>
                                        <MultiSelect
                                            inputId={field.name}
                                            name={field.name}
                                            value={field.value}
                                            placeholder="Seleccione uno o varios días de la semana"
                                            onChange={(e) => field.onChange(e.value)}
                                            options={daysOfWeekOptions}
                                            filter
                                            className={classNames('w-100 position-relative', { 'p-invalid': errors.branch_id })}
                                            panelStyle={{
                                                zIndex: 100000,
                                                padding: 0
                                            }}
                                            appendTo="self"
                                        />
                                    </>
                                }
                            />
                            {getFormErrorMessage('days_of_week')}
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
                                <Controller
                                    name='start_time'
                                    control={control}
                                    rules={{ required: 'Este campo es requerido' }}
                                    render={({ field }) =>
                                        <>
                                            <label htmlFor='start_time' className="form-label">Hora de Inicio</label>
                                            <Calendar
                                                id={field.name}
                                                hourFormat="24"
                                                showTime
                                                timeOnly
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.value)} />
                                        </>
                                    }
                                />
                                {getFormErrorMessage('start_time')}
                            </div>
                            <div className="col-md-6 d-flex flex-column gap-2">
                                <Controller
                                    name='end_time'
                                    control={control}
                                    rules={{ required: 'Este campo es requerido' }}
                                    render={({ field }) =>
                                        <>
                                            <label htmlFor='end_time' className="form-label">Hora de Fin</label>
                                            <Calendar
                                                id={field.name}
                                                hourFormat="24"
                                                showTime
                                                timeOnly
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                            />
                                        </>
                                    }
                                />
                                {getFormErrorMessage('end_time')}
                            </div>
                        </div>

                        <div className="card mt-3">
                            <div className="card-header">
                                <h6 className="mb-0">Espacios Libres</h6>
                            </div>
                            <div className="card-body">
                                <div className='d-flex flex-column gap-3'>
                                    {fields.length === 0 ? (
                                        <p className="text-muted">Puedes agregar espacios libres a continuación.</p>
                                    ) : (
                                        fields.map((field, index) => (
                                            <div key={field.id} className="d-flex gap-2">
                                                <div className="d-flex flex-grow-1 gap-2">
                                                    <div className="d-flex flex-column flex-grow-1 gap-2">
                                                        <label className="form-label">Inicio</label>
                                                        <Controller
                                                            name={`free_slots.${index}.start_time`}
                                                            control={control}
                                                            rules={{ required: "Hora de inicio requerida" }}
                                                            render={({ field, fieldState }) => (
                                                                <>
                                                                    <Calendar
                                                                        hourFormat="24"
                                                                        showTime
                                                                        timeOnly
                                                                        value={field.value}
                                                                        onChange={(e) => {
                                                                            const newStart = e.value;
                                                                            const currentEnd = getValues(`free_slots.${index}.end_time`);

                                                                            // Actualiza ambos campos al mismo tiempo
                                                                            setValue(`free_slots.${index}.start_time`, newStart);

                                                                            if (newStart && currentEnd && newStart > currentEnd) {
                                                                                setValue(`free_slots.${index}.end_time`, newStart);
                                                                            }
                                                                        }}
                                                                        className={classNames({ 'p-invalid': fieldState.error })}
                                                                    />
                                                                    {fieldState.error && (
                                                                        <small className="p-error">{fieldState.error.message}</small>
                                                                    )}
                                                                </>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="d-flex flex-column flex-grow-1 gap-2">
                                                        <label className="form-label">Fin</label>
                                                        <Controller
                                                            name={`free_slots.${index}.end_time`}
                                                            control={control}
                                                            rules={{ required: "Hora de fin requerida" }}
                                                            render={({ field, fieldState }) => (
                                                                <>
                                                                    <Calendar
                                                                        hourFormat="24"
                                                                        showTime
                                                                        timeOnly
                                                                        value={field.value}
                                                                        onChange={(e) => {
                                                                            const newEnd = e.value;
                                                                            const currentStart = getValues(`free_slots.${index}.start_time`);

                                                                            // Actualiza ambos campos al mismo tiempo
                                                                            setValue(`free_slots.${index}.end_time`, newEnd);

                                                                            if (newEnd && currentStart && newEnd < currentStart) {
                                                                                setValue(`free_slots.${index}.start_time`, newEnd);
                                                                            }
                                                                        }}
                                                                        className={classNames({ 'p-invalid': fieldState.error })}
                                                                    />
                                                                    {fieldState.error && (
                                                                        <small className="p-error">{fieldState.error.message}</small>
                                                                    )}
                                                                </>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="d-flex">
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger align-self-end"
                                                        onClick={() => remove(index)}>
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-secondary mt-2"
                                    onClick={() => append({ start_time: null, end_time: null })}
                                >
                                    Agregar Espacio Libre
                                </button>
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