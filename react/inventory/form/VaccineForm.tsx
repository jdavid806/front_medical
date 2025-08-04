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

export type VaccineFormInputs = {
    name: string;
    reference: string;
    manufacturer: string;
    sanitary_registration: string;
    expiration_date: Nullable<Date>;
    weight: number;
    capacity: number;
    concentration: string;
    stock_alert: boolean;
    minimum_stock: number;
    maximum_stock: number;
    sale_price: number;
    purchase_price: number;
};

interface VaccineFormProps {
    formId: string;
    onHandleSubmit: (data: VaccineFormInputs) => void;
    initialData?: VaccineFormInputs;
}

const VaccineForm: React.FC<VaccineFormProps> = ({ formId, onHandleSubmit, initialData }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger,
        reset
    } = useForm<VaccineFormInputs>({
        defaultValues: initialData || {
            name: '',
            reference: '',
            manufacturer: '',
            sanitary_registration: '',
            expiration_date: null,
            weight: 0,
            capacity: 0,
            concentration: '',
            stock_alert: false,
            minimum_stock: 0,
            maximum_stock: 0,
            sale_price: 0,
            purchase_price: 0
        }
    });

    const onSubmit: SubmitHandler<VaccineFormInputs> = (data) => onHandleSubmit(data);

    const stepperRef = useRef(null);

    const getFormErrorMessage = (name: keyof VaccineFormInputs) => {
        return errors[name] && <small className="p-error">{errors[name]?.message}</small>;
    };

    return (
        <div>
            <form id={formId} className="needs-validation" noValidate onSubmit={handleSubmit(onSubmit)}>
                <Stepper ref={stepperRef}>
                    {/* PASO 1: Información básica de la vacuna */}
                    <StepperPanel header="Información básica">
                        <div className="mb-3">
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: 'Este campo es requerido' }}
                                render={({ field }) => (
                                    <>
                                        <label htmlFor={field.name} className="form-label">
                                            Nombre de la vacuna *
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
                                name="reference"
                                control={control}
                                rules={{ required: 'Este campo es requerido' }}
                                render={({ field }) => (
                                    <>
                                        <label htmlFor={field.name} className="form-label">
                                            Referencia *
                                        </label>
                                        <InputText
                                            id={field.name}
                                            className={classNames('w-100', { 'p-invalid': errors.reference })}
                                            {...field}
                                        />
                                    </>
                                )}
                            />
                            {getFormErrorMessage('reference')}
                        </div>

                        <div className="mb-3">
                            <Controller
                                name="manufacturer"
                                control={control}
                                rules={{ required: 'Este campo es requerido' }}
                                render={({ field }) => (
                                    <>
                                        <label htmlFor={field.name} className="form-label">
                                            Fabricante *
                                        </label>
                                        <InputText
                                            id={field.name}
                                            className={classNames('w-100', { 'p-invalid': errors.manufacturer })}
                                            {...field}
                                        />
                                    </>
                                )}
                            />
                            {getFormErrorMessage('manufacturer')}
                        </div>

                        <div className="mb-3">
                            <Controller
                                name="sanitary_registration"
                                control={control}
                                rules={{ required: 'Este campo es requerido' }}
                                render={({ field }) => (
                                    <>
                                        <label htmlFor={field.name} className="form-label">
                                            Registro sanitario *
                                        </label>
                                        <InputText
                                            id={field.name}
                                            className={classNames('w-100', { 'p-invalid': errors.sanitary_registration })}
                                            {...field}
                                        />
                                    </>
                                )}
                            />
                            {getFormErrorMessage('sanitary_registration')}
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
                                        'reference',
                                        'manufacturer',
                                        'sanitary_registration'
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

                    {/* PASO 2: Características físicas */}
                    <StepperPanel header="Características">
                        <div className="mb-3">
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
                                                Peso (g)
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
                                                Capacidad (ml)
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

                        <div className="mb-3">
                            <Controller
                                name="concentration"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <label htmlFor={field.name} className="form-label">
                                            Concentración
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
                                type="button"
                                label="Siguiente"
                                icon={<i className="fas fa-arrow-right me-1"></i>}
                                iconPos="right"
                                onClick={async (e) => {
                                    const isValid = await trigger([
                                        'expiration_date'
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

                    {/* PASO 3: Inventario y precios */}
                    <StepperPanel header="Inventario y precios">
                        <div className="mb-3">
                            <Controller
                                name="stock_alert"
                                control={control}
                                render={({ field }) => (
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={field.name}
                                            checked={field.value}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor={field.name}>
                                            Alerta de stock
                                        </label>
                                    </div>
                                )}
                            />
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

export default VaccineForm;