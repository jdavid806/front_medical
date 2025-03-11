import React, { useRef, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { useEffect } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { useExamCategories } from '../../exam-categories/hooks/useExamCategories';
import { FormBuilder } from '../../components/form-builder/FormBuilder';

export type ExamTypeInputs = {
    name: string
    description: string | undefined
    form_config: any
}

interface ExamTypeFormProps {
    formId: string;
    onHandleSubmit: (data: ExamTypeInputs) => void;
    initialData?: ExamTypeInputs;
}

export const ExamConfigForm: React.FC<ExamTypeFormProps> = ({ formId, onHandleSubmit, initialData }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ExamTypeInputs>({
        defaultValues: initialData || {
            name: '',
            description: '',
            form_config: {}
        }
    })
    const onSubmit: SubmitHandler<ExamTypeInputs> = (data) => {
        data.form_config = handleGetJSON();
        onHandleSubmit(data)
    }

    const { examCategories } = useExamCategories()
    const [dropdownExamCategories, setDropdownExamCategories] = useState<{ value: string, label: string }[]>([]);
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
            form_config: {}
        });
        console.log(initialData);

        setFormConfig(initialData?.form_config || null);
    }, [initialData, reset]);

    useEffect(() => {
        setDropdownExamCategories(examCategories.map(item => ({
            label: item.name, value: item.id
        })))
    }, [examCategories])

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
                {formConfig && (
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