import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React, { forwardRef, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";

export type ResolveClinicalRecordReviewRequestFormInputs = {
    notes: string | undefined
}

export type ResolveClinicalRecordReviewRequestFormRef = {
    getFormData: () => ResolveClinicalRecordReviewRequestFormInputs
}

export const ResolveClinicalRecordReviewRequestForm = forwardRef((props, ref) => {

    const {
        control,
        formState: { errors },
        getValues
    } = useForm<ResolveClinicalRecordReviewRequestFormInputs>()

    useImperativeHandle(ref, () => ({
        getFormData: () => {
            return {
                notes: getValues('notes')
            }
        }
    }))

    return (
        <div>
            <form className="needs-validation" noValidate>
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
            </form>
        </div>
    );
});