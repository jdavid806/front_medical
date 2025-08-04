import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

export type MakeRequestFormInputs = {
    notes: string | undefined
}

type MakeRequestFormProps = {
    formId: string,
    onHandleSubmit: (data: MakeRequestFormInputs) => void
}

export const MakeRequestForm: React.FC<MakeRequestFormProps> = ({ formId, onHandleSubmit }) => {

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<MakeRequestFormInputs>()
    const onSubmit: SubmitHandler<MakeRequestFormInputs> = (data) => onHandleSubmit(data)

    const getFormErrorMessage = (name: keyof MakeRequestFormInputs) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    return (
        <div>
            <form id={formId} className="needs-validation" noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <Controller
                        name='notes'
                        control={control}
                        render={({ field }) =>
                            <>
                                <label htmlFor={field.name} className="form-label">Razón (opcional)</label>
                                <InputTextarea
                                    placeholder="Ingrese un nombre"
                                    ref={field.ref}
                                    value={field.value}
                                    onBlur={field.onBlur}
                                    onChange={field.onChange}
                                    className={classNames('w-100', { 'p-invalid': errors.notes })}
                                />
                            </>
                        }
                    />
                </div>
            </form>
        </div>
    );
};