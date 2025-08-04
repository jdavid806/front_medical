import React from 'react';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { useEffect } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { useUsers } from './hooks/useUsers';

export type UserAssistantFormInputs = {
    assistants: string[];
}

interface Props {
    formId: string;
    onHandleSubmit: (data: UserAssistantFormInputs) => void;
    initialData?: UserAssistantFormInputs;
}

export const UserAssistantForm: React.FC<Props> = ({ formId, onHandleSubmit, initialData }) => {

    const { users } = useUsers();
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<UserAssistantFormInputs>({
        defaultValues: initialData || {
            assistants: [],
        }
    })

    const onSubmit: SubmitHandler<UserAssistantFormInputs> = (data) => {
        onHandleSubmit(data)
    }

    const getFormErrorMessage = (name: keyof UserAssistantFormInputs) => {
        return errors[name] && <small className="p-error">{errors[name].message?.toString()}</small>
    };

    useEffect(() => {
        reset(initialData || {
            assistants: [],
        });
    }, [initialData, reset]);

    const selectedUserIds = useWatch({
        control,
        name: "assistants",
        defaultValue: []
    });

    return (
        <div>
            <form id={formId} className="needs-validation" noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <Controller
                        name='assistants'
                        control={control}
                        rules={{ required: 'Este campo es requerido' }}
                        render={({ field }) => (
                            <>
                                <label htmlFor={field.name} className="form-label">Asistentes *</label>
                                <MultiSelect
                                    inputId={field.name}
                                    options={users}
                                    optionLabel='label'
                                    optionValue='id'
                                    placeholder="Seleccione uno o más asistentes"
                                    filter
                                    showClear
                                    maxSelectedLabels={2}
                                    className={classNames('w-100', { 'p-invalid': errors.assistants })}
                                    appendTo={'self'}
                                    {...field}
                                />
                            </>
                        )}
                    />
                    {getFormErrorMessage('assistants')}
                </div>
            </form>
            <hr />
            <div className="row g-2">
                {selectedUserIds.map((userId) => {

                    const user = users.find((user) => user.id === userId);

                    if (!user) return null;

                    return (
                        <div className="col-md-4" key={userId}>
                            <div className="card">
                                <div className="card-body">
                                    <p className="card-text">{`${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''} ${user.second_last_name || ''}`}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};