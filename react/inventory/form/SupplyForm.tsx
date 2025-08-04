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
import { Dropdown } from 'primereact/dropdown';

export type SupplyFormInputs = {
    name: string;
    type: string;
    category: string;
    unit_of_measure: string;
    minimum_stock: number;
    maximum_stock: number;
    expiration_date: Nullable<Date>;
    lot_number: string;
    description: string;
    weight: number;
    dimensions: string;
    manufacturer: string;
    sale_price: number;
    purchase_price: number;
    is_disposable: boolean;
    is_sterile: boolean;
};

interface SupplyFormProps {
    formId: string;
    onHandleSubmit: (data: SupplyFormInputs) => void;
    initialData?: SupplyFormInputs;
}

const SupplyForm: React.FC<SupplyFormProps> = ({ formId, onHandleSubmit, initialData }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger,
        reset
    } = useForm<SupplyFormInputs>({
        defaultValues: initialData || {
            name: '',
            type: '',
            category: '',
            unit_of_measure: '',
            minimum_stock: 0,
            maximum_stock: 0,
            expiration_date: null,
            lot_number: '',
            description: '',
            weight: 0,
            dimensions: '',
            manufacturer: '',
            sale_price: 0,
            purchase_price: 0,
            is_disposable: false,
            is_sterile: false
        }
    });

    const onSubmit: SubmitHandler<SupplyFormInputs> = (data) => onHandleSubmit(data);

    const stepperRef = useRef(null);

    const getFormErrorMessage = (name: keyof SupplyFormInputs) => {
        return errors[name] && <small className="p-error">{errors[name]?.message}</small>;
    };

    const supplyTypes = [
        { label: 'Material de curación', value: 'curación' },
        { label: 'Equipo médico', value: 'equipo' },
        { label: 'Insumo quirúrgico', value: 'quirúrgico' },
        { label: 'Insumo de diagnóstico', value: 'diagnóstico' },
        { label: 'Otro', value: 'otro' }
    ];

    const supplyCategories = [
        { label: 'Desechable', value: 'desechable' },
        { label: 'Reutilizable', value: 'reutilizable' },
        { label: 'Consumible', value: 'consumible' }
    ];

    const unitsOfMeasure = [
        { label: 'Unidades', value: 'unidades' },
        { label: 'Paquetes', value: 'paquetes' },
        { label: 'Cajas', value: 'cajas' },
        { label: 'Metros', value: 'metros' },
        { label: 'Litros', value: 'litros' },
        { label: 'Gramos', value: 'gramos' }
    ];

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
                                            Nombre del insumo *
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

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <Controller
                                    name="type"
                                    control={control}
                                    rules={{ required: 'Este campo es requerido' }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">
                                                Tipo de insumo *
                                            </label>
                                            <Dropdown
                                                id={field.name}
                                                options={supplyTypes}
                                                optionLabel="label"
                                                optionValue="value"
                                                placeholder="Seleccione un tipo"
                                                className={classNames('w-100', { 'p-invalid': errors.type })}
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage('type')}
                            </div>
                            <div className="col-md-6">
                                <Controller
                                    name="category"
                                    control={control}
                                    rules={{ required: 'Este campo es requerido' }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">
                                                Categoría *
                                            </label>
                                            <Dropdown
                                                id={field.name}
                                                options={supplyCategories}
                                                optionLabel="label"
                                                optionValue="value"
                                                placeholder="Seleccione una categoría"
                                                className={classNames('w-100', { 'p-invalid': errors.category })}
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage('category')}
                            </div>
                        </div>

                        <div className="mb-3">
                            <Controller
                                name="unit_of_measure"
                                control={control}
                                rules={{ required: 'Este campo es requerido' }}
                                render={({ field }) => (
                                    <>
                                        <label htmlFor={field.name} className="form-label">
                                            Unidad de medida *
                                        </label>
                                        <Dropdown
                                            id={field.name}
                                            options={unitsOfMeasure}
                                            optionLabel="label"
                                            optionValue="value"
                                            placeholder="Seleccione una unidad"
                                            className={classNames('w-100', { 'p-invalid': errors.unit_of_measure })}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                        />
                                    </>
                                )}
                            />
                            {getFormErrorMessage('unit_of_measure')}
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
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">
                                                Fecha de caducidad
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
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">
                                                Número de lote
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
                                        'type',
                                        'category',
                                        'unit_of_measure',
                                        'minimum_stock',
                                        'maximum_stock'
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
                                                Peso del insumo (g)
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
                                    name="dimensions"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">
                                                Dimensiones (Largo x Ancho x Alto)
                                            </label>
                                            <InputText
                                                id={field.name}
                                                placeholder="Ej: 10x5x2 cm"
                                                className={classNames('w-100', { 'p-invalid': errors.dimensions })}
                                                {...field}
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage('dimensions')}
                            </div>
                        </div>

                        <div className="mb-3">
                            <Controller
                                name="manufacturer"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <label htmlFor={field.name} className="form-label">
                                            Fabricante
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

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <Controller
                                    name="is_disposable"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="form-check form-switch">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="is_disposable"
                                                checked={field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor="is_disposable">
                                                ¿Es desechable?
                                            </label>
                                        </div>
                                    )}
                                />
                            </div>
                            <div className="col-md-6">
                                <Controller
                                    name="is_sterile"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="form-check form-switch">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="is_sterile"
                                                checked={field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor="is_sterile">
                                                ¿Es estéril?
                                            </label>
                                        </div>
                                    )}
                                />
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

export default SupplyForm;