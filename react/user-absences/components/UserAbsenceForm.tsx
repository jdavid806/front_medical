import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { useUsers } from '../../users/hooks/useUsers';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { InputTextarea } from 'primereact/inputtextarea';

export type UserAbsenceFormInputs = {
    user_id: string
    reason: string
    dateRange: Nullable<(Date | null)[]>
}

interface UserAbsenceFormProps {
    formId: string;
    onHandleSubmit: (data: UserAbsenceFormInputs) => void;
    initialData?: UserAbsenceFormInputs;
}

export const UserAbsenceForm: React.FC<UserAbsenceFormProps> = ({ formId, onHandleSubmit, initialData }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<UserAbsenceFormInputs>({
        defaultValues: initialData || {
            user_id: '',
            reason: '',
            dateRange: [new Date(), new Date()]
        }
    })
    const onSubmit: SubmitHandler<UserAbsenceFormInputs> = (data) => onHandleSubmit(data)

    const getFormErrorMessage = (name: keyof UserAbsenceFormInputs) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const { users } = useUsers()
    const [usersForSelect, setUsersForSelect] = useState<{ value: string, label: string }[]>([])

    useEffect(() => {
        setUsersForSelect(users.map(user => {
            return {
                value: user.id.toString(),
                label: `${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''} ${user.second_last_name || ''}`
            }
        }))
    }, [users])

    useEffect(() => {
        reset(initialData || {
            user_id: '',
            reason: '',
            dateRange: [new Date(), new Date()]
        });
    }, [initialData, reset]);

    return (
        <div>
            <form id={formId} className="needs-validation" noValidate onSubmit={handleSubmit(onSubmit)}>
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
                <div className="mb-3">
                    <Controller
                        name='reason'
                        control={control}
                        render={({ field }) =>
                            <>
                                <label htmlFor={field.name} className="form-label">Motivo</label>
                                <InputTextarea
                                    id={field.name}
                                    placeholder="Ingrese un motivo"
                                    className={classNames('w-100', { 'p-invalid': errors.reason })}
                                    {...field}
                                />
                            </>
                        }
                    />
                    {getFormErrorMessage('reason')}
                </div>
                <div className="mb-3">
                    <Controller
                        name='dateRange'
                        control={control}
                        rules={{ required: 'Este campo es requerido' }}
                        render={({ field }) =>
                            <>
                                <label htmlFor={field.name} className="form-label">Fecha de la ausencia *</label>
                                <Calendar
                                    inputId={field.name}
                                    className={classNames('w-100', { 'p-invalid': errors.dateRange })}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.value)}
                                    placeholder="Seleccione la fecha de la ausencia"
                                    selectionMode='range'
                                />
                            </>
                        }
                    />
                    {getFormErrorMessage('dateRange')}
                </div>
            </form>
        </div>
    );
};