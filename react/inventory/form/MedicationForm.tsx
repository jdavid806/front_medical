import React, { useRef } from 'react';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';

export type MedicationFormInputs = {
    name: string;
    presentation: string;
    concentration: string;
    minimum_stock: number;
    maximum_stock: number;
    expiration_date: Nullable<Date>;
    lot_number: string;
    description: string;
    weight: number;
    capacity: number;
    sale_price: number;
    purchase_price: number;
};

interface MedicationFormProps {
    formId: string;
    onHandleSubmit: (data: MedicationFormInputs) => void;
    initialData?: MedicationFormInputs;
}

const MedicationForm: React.FC<MedicationFormProps> = ({ formId, onHandleSubmit, initialData }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger,
        reset
    } = useForm<MedicationFormInputs>({
        defaultValues: initialData || {
            name: '',
            presentation: '',
            concentration: '',
            minimum_stock: 0,
            maximum_stock: 0,
            expiration_date: null,
            lot_number: '',
            description: '',
            weight: 0,
            capacity: 0,
            sale_price: 0,
            purchase_price: 0
        }
    });

    const onSubmit: SubmitHandler<MedicationFormInputs> = (data) => onHandleSubmit(data);

    const stepperRef = useRef(null);

    const getFormErrorMessage = (name: keyof MedicationFormInputs) => {
        return errors[name] && <small className="p-error">{errors[name]?.message}</small>;
    };

    return (
        <div>
            <form id={formId} className="needs-validation" noValidate onSubmit={handleSubmit(onSubmit)}>
                <Stepper ref={stepperRef}>
                    <StepperPanel header="Información básica">
                        <div className="mb-3">
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: 'Este campo es requerido' }}
                                render={({ field }) => (
                                    <>
                                        <label htmlFor={field.name} className="form-label">
                                            Nombre del medicamento *
                                        </label>
                                        <InputText
                                            id={field.name}
                                            className={classNames('w-100', { 'p-invalid': errors.name })}
                                            {...field}
                                        />
                                    </>
                                )}
                            />
                            {getFormErrorMessage('name')}
                        </div>

                        <div className="mb-3">
                            <Controller
                                name="presentation"
                                control={control}
                                rules={{ required: 'Este campo es requerido' }}
                                render={({ field }) => (
                                    <>
                                        <label htmlFor={field.name} className="form-label">
                                            Presentación *
                                        </label>
                                        <InputText
                                            id={field.name}
                                            className={classNames('w-100', { 'p-invalid': errors.presentation })}
                                            {...field}
                                        />
                                    </>
                                )}
                            />
                            {getFormErrorMessage('presentation')}
                        </div>

                        <div className="mb-3">
                            <Controller
                                name="concentration"
                                control={control}
                                rules={{ required: 'Este campo es requerido' }}
                                render={({ field }) => (
                                    <>
                                        <label htmlFor={field.name} className="form-label">
                                            Referencia + Unidad *
                                        </label>
                                        <InputText
                                            id={field.name}
                                            className={classNames('w-100', { 'p-invalid': errors.concentration })}
                                            {...field}
                                        />
                                    </>
                                )}
                            />
                            {getFormErrorMessage('concentration')}
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <Controller
                                    name="minimum_stock"
                                    control={control}
                                    rules={{
                                        required: 'Este campo es requerido',
                                        min: { value: 0, message: 'El valor mínimo es 0' }
                                    }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">
                                                Stock mínimo *
                                            </label>
                                            <InputNumber
                                                inputId={field.name}
                                                min={0}
                                                className={classNames('w-100', { 'p-invalid': errors.minimum_stock })}
                                                value={field.value}
                                                onValueChange={(e) => field.onChange(e.value)}
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage('minimum_stock')}
                            </div>
                            <div className="col-md-6">
                                <Controller
                                    name="maximum_stock"
                                    control={control}
                                    rules={{
                                        required: 'Este campo es requerido',
                                        min: { value: 0, message: 'El valor mínimo es 0' }
                                    }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">
                                                Stock máximo *
                                            </label>
                                            <InputNumber
                                                inputId={field.name}
                                                min={0}
                                                className={classNames('w-100', { 'p-invalid': errors.maximum_stock })}
                                                value={field.value}
                                                onValueChange={(e) => field.onChange(e.value)}
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage('maximum_stock')}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <Controller
                                    name="expiration_date"
                                    control={control}
                                    rules={{ required: 'Este campo es requerido' }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">
                                                Fecha de caducidad *
                                            </label>
                                            <Calendar
                                                id={field.name}
                                                dateFormat="dd/mm/yy"
                                                showIcon
                                                className={classNames('w-100', { 'p-invalid': errors.expiration_date })}
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage('expiration_date')}
                            </div>
                            <div className="col-md-6">
                                <Controller
                                    name="lot_number"
                                    control={control}
                                    rules={{ required: 'Este campo es requerido' }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">
                                                Número de lote *
                                            </label>
                                            <InputText
                                                id={field.name}
                                                className={classNames('w-100', { 'p-invalid': errors.lot_number })}
                                                {...field}
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage('lot_number')}
                            </div>
                        </div>

                        <div className="mb-3">
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <label htmlFor={field.name} className="form-label">
                                            Descripción
                                        </label>
                                        <InputText
                                            id={field.name}
                                            className="w-100"
                                            {...field}
                                        />
                                    </>
                                )}
                            />
                        </div>

                        <div className="d-flex pt-4 justify-content-end">
                            <Button
                                className="btn btn-primary btn-sm"
                                type="button"
                                label="Siguiente"
                                icon={<i className="fas fa-arrow-right me-1"></i>}
                                iconPos="right"
                                onClick={async (e) => {
                                    const isValid = await trigger([
                                        'name',
                                        'presentation',
                                        'concentration',
                                        'minimum_stock',
                                        'maximum_stock',
                                        'expiration_date',
                                        'lot_number'
                                    ]);

                                    if (!isValid) {
                                        e.preventDefault();
                                        return;
                                    }

                                    (stepperRef.current! as any).nextCallback();
                                }}
                            />
                        </div>
                    </StepperPanel>

                    <StepperPanel header="Detalles adicionales">
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <Controller
                                    name="weight"
                                    control={control}
                                    rules={{
                                        min: { value: 0, message: 'El valor mínimo es 0' }
                                    }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">
                                                Peso del medicamento (g)
                                            </label>
                                            <InputNumber
                                                inputId={field.name}
                                                min={0}
                                                suffix=" g"
                                                className={classNames('w-100', { 'p-invalid': errors.weight })}
                                                value={field.value}
                                                onValueChange={(e) => field.onChange(e.value)}
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage('weight')}
                            </div>
                            <div className="col-md-6">
                                <Controller
                                    name="capacity"
                                    control={control}
                                    rules={{
                                        min: { value: 0, message: 'El valor mínimo es 0' }
                                    }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">
                                                Capacidad del medicamento (ml)
                                            </label>
                                            <InputNumber
                                                inputId={field.name}
                                                min={0}
                                                suffix=" ml"
                                                className={classNames('w-100', { 'p-invalid': errors.capacity })}
                                                value={field.value}
                                                onValueChange={(e) => field.onChange(e.value)}
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage('capacity')}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <Controller
                                    name="purchase_price"
                                    control={control}
                                    rules={{
                                        min: { value: 0, message: 'El valor mínimo es 0' }
                                    }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">
                                                Precio de compra
                                            </label>
                                            <InputNumber
                                                inputId={field.name}
                                                min={0}
                                                mode="currency"
                                                currency="USD"
                                                locale="en-US"
                                                className={classNames('w-100', { 'p-invalid': errors.purchase_price })}
                                                value={field.value}
                                                onValueChange={(e) => field.onChange(e.value)}
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage('purchase_price')}
                            </div>
                            <div className="col-md-6">
                                <Controller
                                    name="sale_price"
                                    control={control}
                                    rules={{
                                        min: { value: 0, message: 'El valor mínimo es 0' }
                                    }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">
                                                Precio de venta
                                            </label>
                                            <InputNumber
                                                inputId={field.name}
                                                min={0}
                                                mode="currency"
                                                currency="USD"
                                                locale="en-US"
                                                className={classNames('w-100', { 'p-invalid': errors.sale_price })}
                                                value={field.value}
                                                onValueChange={(e) => field.onChange(e.value)}
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage('sale_price')}
                            </div>
                        </div>

                        <div className="d-flex pt-4 justify-content-end gap-3">
                            <Button
                                className="btn btn-secondary btn-sm"
                                type="button"
                                label="Atrás"
                                icon={<i className="fas fa-arrow-left me-1"></i>}
                                onClick={() => {
                                    (stepperRef.current! as any).prevCallback();
                                }}
                            />
                            <Button
                                className="btn btn-primary btn-sm"
                                label="Guardar"
                                type="submit"
                                icon={<i className="fas fa-save me-1"></i>}
                                iconPos="right"
                            />
                        </div>
                    </StepperPanel>
                </Stepper>
            </form>
        </div>
    );
};

export default MedicationForm;