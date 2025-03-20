import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { useUsersForSelect } from '../../users/hooks/useUsersForSelect';
import { useBranchesForSelect } from '../../branches/hooks/useBranchesForSelect';
import { InputText } from 'primereact/inputtext';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { ticketReasons } from '../../../services/commons';
import { objectToArray } from '../../../services/utilidades';
import { MultiSelect } from 'primereact/multiselect';
import { useEffect } from 'react';

export type ModuleFormInputs = {
    name: string
    branch_id: string
    allowed_reasons: string[]
}

interface ModuleFormProps {
    formId: string;
    onHandleSubmit: (data: ModuleFormInputs) => void;
    initialData?: ModuleFormInputs;
}

export const ModuleForm: React.FC<ModuleFormProps> = ({ formId, onHandleSubmit, initialData }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ModuleFormInputs>({
        defaultValues: initialData || {
            name: '',
            branch_id: '1',
            allowed_reasons: []
        }
    })
    const onSubmit: SubmitHandler<ModuleFormInputs> = (data) => onHandleSubmit(data)

    const { branches } = useBranchesForSelect()
    const allowedReasonsOptions = objectToArray(ticketReasons)

    const getFormErrorMessage = (name: keyof ModuleFormInputs) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    useEffect(() => {
        reset(initialData || {
            name: '',
            branch_id: '1',
            allowed_reasons: []
        });
    }, [initialData, reset]);

    return (
        <div>
            <form id={formId} className="needs-validation" noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <Controller
                        name='name'
                        control={control}
                        rules={{ required: 'Este campo es requerido' }}
                        render={({ field }) =>
                            <>
                                <label htmlFor={field.name} className="form-label">Nombre *</label>
                                <InputText
                                    placeholder="Ingrese un nombre"
                                    ref={field.ref}
                                    value={field.value}
                                    onBlur={field.onBlur}
                                    onChange={field.onChange}
                                    className={classNames('w-100', { 'p-invalid': errors.name })}
                                />
                            </>
                        }
                    />
                    {getFormErrorMessage('name')}
                </div>
                {/* <div className="mb-3">
                    <Controller
                        name='branch_id'
                        control={control}
                        rules={{ required: 'Este campo es requerido' }}
                        render={({ field }) =>
                            <>
                                <label htmlFor={field.name} className="form-label">Sucursal *</label>
                                <Dropdown
                                    inputId={field.name}
                                    options={branches}
                                    optionLabel='label'
                                    optionValue='value'
                                    filter
                                    placeholder="Seleccione una sucursal"
                                    className={classNames('w-100', { 'p-invalid': errors.branch_id })}
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
                        name='allowed_reasons'
                        control={control}
                        rules={{ required: 'Este campo es requerido' }}
                        render={({ field }) =>
                            <>
                                <label htmlFor={field.name} className="form-label">Motivos de visita a atender *</label>
                                <MultiSelect
                                    inputId={field.name}
                                    options={allowedReasonsOptions}
                                    optionLabel='label'
                                    optionValue='value'
                                    filter
                                    placeholder="Seleccione los motivos de visita a atender"
                                    className={classNames('w-100 position-relative', { 'p-invalid': errors.allowed_reasons })}
                                    appendTo="self"
                                    {...field}
                                >
                                </MultiSelect>
                            </>
                        }
                    />
                    {getFormErrorMessage('allowed_reasons')}
                </div>
            </form>
        </div>
    );
};