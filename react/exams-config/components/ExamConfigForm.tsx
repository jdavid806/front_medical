import React, { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { useEffect } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { FormBuilder } from '../../components/form-builder/FormBuilder';
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

export const ExamConfigForm: React.FC<ExamTypeFormProps> = ({ formId, onHandleSubmit, initialData }) => {

    const [showFormBuilder, setShowFormBuilder] = useState(true);
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

    const [formConfig, setFormConfig] = useState<object | null>(null);

    const formBuilderRef = useRef<any>(null);

    const handleGetJSON = () => {
        if (formBuilderRef.current) {
            return formBuilderRef.current.getFormConfiguration();
        }
        return null
    };

    const getFormErrorMessage = (name: keyof ExamTypeInputs) => {
        return errors[name] && <small className="p-error">{errors[name].message?.toString()}</small>
    };

    const fetchData = async () => {
        if (!formConfig) {
            try {
                const response = await fetch('../../ConsultasJson/examenBase.json');
                const data = await response.json();
                setFormConfig(data.form1);
            } catch (error) {
                console.error("Error cargando el JSON:", error);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        reset(initialData || {
            name: '',
            description: '',
            type: '',
            form_config: {}
        });
        console.log(initialData);

        setFormConfig(initialData?.form_config || null);
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
                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        id="flexSwitchCheckDefault"
                        type="checkbox"
                        checked={showFormBuilder}
                        onChange={(e) => setShowFormBuilder(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Maneja formato</label>
                </div>
                {formConfig && showFormBuilder && (
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Formato del examen</h5>
                        </div>
                        <div className="card-body">
                            <FormBuilder ref={formBuilderRef} form={formConfig}></FormBuilder>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};