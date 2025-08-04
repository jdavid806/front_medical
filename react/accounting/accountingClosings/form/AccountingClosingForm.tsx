import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Nullable } from "primereact/ts-helpers";

interface AccountingClosingFormProps {
    initialData?: AccountingClosingFormInputs;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}


export interface AccountingClosingFormInputs {
    id?: number;
    age: number;
    status: string;
    start_month: Nullable<Date>;
    end_month: Nullable<Date>;
    warning_days: number;
}

const AccountingClosingForm: React.FC<AccountingClosingFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
}) => {
    const defaultValues = {
        age: new Date().getFullYear(),
        status: 'Abierto',
        start_month: null,
        end_month: null,
        warning_days: 30
    }
    const { control, handleSubmit, formState: { errors }, reset } = useForm<AccountingClosingFormInputs>({
        defaultValues: initialData || defaultValues
    });

    const statusOptions = [
        { label: 'Abierto', value: 'open' },
        { label: 'Cerrado', value: 'closed' },
    ];

    const getFormErrorMessage = (name: keyof AccountingClosingFormInputs) => {
        return (
            errors[name] && <small className="p-error">{errors[name]?.message?.toString()}
            </small>
        );
    };

    useEffect(() => {
        reset(initialData || defaultValues);
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
            {/*<div className="field mb-4">
                <label htmlFor="year" className="block font-medium mb-2">
                    Año *
                </label>
                <Controller
                    name="year"
                    control={control}
                    rules={{
                        required: 'El año es requerido',
                        min: { value: 2000, message: 'El año debe ser mayor a 2000' }
                    }}
                    render={({ field, fieldState }) => (
                        <>
                            <InputNumber
                                id={field.name}
                                value={field.value}
                                onValueChange={(e) => field.onChange(e.value)}
                                min={2000}
                                className={classNames({ 'p-invalid': fieldState.error })}
                            />
                            {getFormErrorMessage('year')}
                        </>
                    )}
                />
            </div>*/}

            <div className="field mb-4">
                <label htmlFor="status" className="block font-medium mb-2">
                    Estado *
                </label>
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Dropdown
                            inputId={field.name}
                            options={statusOptions}
                            optionLabel="label"
                            optionValue="value"
                            className="w-full"
                            {...field}
                        />
                    )}
                />
            </div>

            <div className="field mb-4">
                <label htmlFor="startDate" className="block font-medium mb-2">
                    Fecha Inicio *
                </label>
                <Controller
                    name="start_month"
                    control={control}
                    rules={{ required: 'La fecha de inicio es requerida' }}
                    render={({ field, fieldState }) => (
                        <>
                            <Calendar
                                id={field.name}
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                showIcon
                                className={classNames('w-full', { 'p-invalid': fieldState.error })}
                            />
                            {getFormErrorMessage('start_month')}
                        </>
                    )}
                />
            </div>

            <div className="field mb-4">
                <label htmlFor="endDate" className="block font-medium mb-2">
                    Fecha Fin *
                </label>
                <Controller
                    name="end_month"
                    control={control}
                    rules={{ required: 'La fecha de fin es requerida' }}
                    render={({ field, fieldState }) => (
                        <>
                            <Calendar
                                id={field.name}
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                showIcon
                                className={classNames('w-full', { 'p-invalid': fieldState.error })}
                            />
                            {getFormErrorMessage('end_month')}
                        </>
                    )}
                />
            </div>

            <div className="field mb-4">
                <label htmlFor="warningDays" className="block font-medium mb-2">
                    Días de Advertencia *
                </label>
                <Controller
                    name="warning_days"
                    control={control}
                    render={({ field }) => (
                        <>
                            <InputNumber
                                inputId={field.name}
                                placeholder="Ingrese la duración"
                                ref={field.ref}
                                value={field.value}
                                onBlur={field.onBlur}
                                onValueChange={(e) => field.onChange(e)}
                                inputClassName={classNames('w-100', { 'p-invalid': errors.warning_days })}
                            />
                            {getFormErrorMessage('warning_days')}
                        </>
                    )}
                />
            </div>

            <div className="flex justify-content-end gap-2 mt-4">
                <Button
                    label="Cancelar"
                    icon="pi pi-times"
                    className="p-button-text"
                    onClick={onCancel}
                />
                <Button
                    label="Guardar"
                    icon="pi pi-check"
                    className="p-button-primary"
                    type="submit"
                />
            </div>
        </form>
    );
};

export default AccountingClosingForm;