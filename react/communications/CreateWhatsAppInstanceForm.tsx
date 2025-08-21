import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

export type CreateWhatsAppInstanceFormInputs = {
    instanceName: string;
};

export type CreateWhatsAppInstanceFormProps = {
    formId: string
    onSubmit: (data: CreateWhatsAppInstanceFormInputs) => void
}

export const CreateWhatsAppInstanceForm: React.FC<CreateWhatsAppInstanceFormProps> = ({
    formId,
    onSubmit
}) => {

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<CreateWhatsAppInstanceFormInputs>({
        defaultValues: {
            instanceName: '',
        }
    })

    const getFormErrorMessage = (name: keyof CreateWhatsAppInstanceFormInputs) => {
        return errors[name] && <small className="p-error">{errors[name].message?.toString()}</small>
    };

    return (
        <div>
            <form id={formId} className="needs-validation" noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <Controller
                        name='instanceName'
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
                                    className={classNames('w-100', { 'p-invalid': errors.instanceName })}
                                />
                            </>
                        }
                    />
                    {getFormErrorMessage('instanceName')}
                </div>
            </form>
        </div>
    );
};