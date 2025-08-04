import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useResolveRequest } from "../hooks/useResolveRequest";

export type ResolveRequestFormInputs = {
    notes: string | undefined
    status: string
}

type ResolveRequestFormProps = {
    requestId: string,
    onSave: (data: any) => void
}

export const ResolveRequestForm: React.FC<ResolveRequestFormProps> = ({ requestId, onSave }) => {

    const { resolveRequest } = useResolveRequest();

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<ResolveRequestFormInputs>()
    const onSubmit: SubmitHandler<ResolveRequestFormInputs> = (data) => onHandleSubmit(data)

    const onHandleSubmit: SubmitHandler<ResolveRequestFormInputs> = async (data) => {
        try {
            const response = await resolveRequest(requestId, {
                status: data.status,
                notes: data.notes || null
            });
            onSave(response)
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <form className="needs-validation" noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <Controller
                        name='notes'
                        control={control}
                        render={({ field }) =>
                            <>
                                <label htmlFor={field.name} className="form-label">Observaciones (opcional)</label>
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
                <div className="d-flex justify-content-end gap-2">
                    <button
                        className="btn btn-danger"
                        type="submit"
                        onClick={() => setValue('status', 'rejected')}>
                        Rechazar
                    </button>
                    <button
                        className="btn btn-success"
                        type="submit"
                        onClick={() => setValue('status', 'approved')}
                    >
                        Aceptar
                    </button>
                </div>
            </form>
        </div>
    );
};