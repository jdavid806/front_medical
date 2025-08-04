import React, { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { useEffect } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { examTypes } from '../../../services/commons';

export type ExamTypeInputs = {
    name: string
    description: string | undefined
    type: string
    form_config: any
}

interface ExamTypeFormProps {
    formId: string;
    onHandleSubmit: (data: ExamTypeInputs) => void;
    initialData?: ExamTypeInputs;
}

export const ClinicalHistoryExamConfigForm: React.FC<ExamTypeFormProps> = ({ formId, onHandleSubmit, initialData }) => {

    const selectableExamTypes = Object.keys(examTypes).map(key => ({ value: key, label: examTypes[key] }));

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ExamTypeInputs>({
        defaultValues: initialData || {
            name: '',
            type: '',
            description: '',
            form_config: {}
        }
    })
    const onSubmit: SubmitHandler<ExamTypeInputs> = (data) => {
        data.form_config = handleGetJSON();
        onHandleSubmit(data)
    }

    const formBuilderRef = useRef<any>(null);

    const handleGetJSON = () => {
        if (formBuilderRef.current) {
            return formBuilderRef.current.getFormConfiguration();
        }
        return {}
    };

    const getFormErrorMessage = (name: keyof ExamTypeInputs) => {
        return errors[name] && <small className="p-error">{errors[name].message?.toString()}</small>
    };

    useEffect(() => {
        reset(initialData || {
            name: '',
            description: '',
            type: '',
            form_config: {}
        });
        console.log(initialData);
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
                <div className="mb-3">
                    <Controller
                        name='description'
                        control={control}
                        render={({ field }) =>
                            <>
                                <label htmlFor={field.name} className="form-label">Descripción</label>
                                <InputTextarea
                                    id={field.name}
                                    placeholder="Ingrese un texto"
                                    className={classNames('w-100', { 'p-invalid': errors.description })}
                                    {...field}
                                />
                            </>
                        }
                    />
                    {getFormErrorMessage('description')}
                </div>
                <div className="mb-3">
                    <Controller
                        name='type'
                        control={control}
                        rules={{ required: 'Este campo es requerido' }}
                        render={({ field }) => (
                            <>
                                <label htmlFor={field.name} className="form-label">Tipo de examen *</label>
                                <Dropdown
                                    inputId={field.name}
                                    options={selectableExamTypes}
                                    optionLabel='label'
                                    optionValue='value'
                                    filter
                                    placeholder="Seleccione un tipo de examen"
                                    className={classNames('w-100', { 'p-invalid': errors.type })}
                                    {...field}
                                    appendTo={'self'}
                                />
                            </>
                        )}
                    />
                    {getFormErrorMessage('type')}
                </div>
            </form>
        </div>
    );
};