import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { useEffect } from 'react';

export type ExamCategoryInputs = {
    name: string
}

interface ExamCategoryFormProps {
    formId: string;
    onHandleSubmit: (data: ExamCategoryInputs) => void;
    initialData?: ExamCategoryInputs;
}

export const ExamCategoryForm: React.FC<ExamCategoryFormProps> = ({ formId, onHandleSubmit, initialData }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ExamCategoryInputs>({
        defaultValues: initialData || {
            name: ''
        }
    })
    const onSubmit: SubmitHandler<ExamCategoryInputs> = (data) => onHandleSubmit(data)

    const [formConfig, setFormConfig] = useState<object | null>(null);

    const getFormErrorMessage = (name: keyof ExamCategoryInputs) => {
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
            name: ''
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
            </form>
        </div>
    );
};
