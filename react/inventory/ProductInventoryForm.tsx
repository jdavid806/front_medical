import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { useEffect } from 'react';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useProduct } from '../products/hooks/useProduct';
import { Checkbox } from 'primereact/checkbox';

export type ProductInventoryFormInputs = {
    minimum_stock: number;
    maximum_stock: number | null | undefined;
    sanitary_registration: string;
    description: string;
    prescription: boolean;
    sale_price: number;
}

interface ProductInventoryFormProps {
    formId: string;
    productId: string;
    onHandleSubmit: (data: ProductInventoryFormInputs) => void
}

export const ProductInventoryForm: React.FC<ProductInventoryFormProps> = ({ formId, productId, onHandleSubmit }) => {

    const { product, fetchProduct } = useProduct();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ProductInventoryFormInputs>({
        defaultValues: {
            minimum_stock: 0,
            maximum_stock: null,
            sanitary_registration: '',
            description: '',
            prescription: false
        }
    })
    const onSubmit: SubmitHandler<ProductInventoryFormInputs> = (data) => onHandleSubmit(data)

    const getFormErrorMessage = (name: keyof ProductInventoryFormInputs) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    useEffect(() => {
        if (productId) {
            fetchProduct(productId);
        }
    }, [productId]);

    useEffect(() => {
        if (product) {
            console.log('PRODUCT', product);

            reset(product);
        }
    }, [product]);

    return (
        <div>
            <form id={formId} className="needs-validation" noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <Controller
                            name="minimum_stock"
                            control={control}
                            rules={{ required: 'Este campo es requerido' }}
                            render={({ field }) => (<>
                                <label htmlFor={field.name} className="form-label">Stock mínimo *</label>
                                <InputNumber
                                    inputId={field.name}
                                    min={1}
                                    placeholder="Ingrese el stock mínimo"
                                    ref={field.ref}
                                    value={field.value}
                                    onBlur={field.onBlur}
                                    onValueChange={(e) => field.onChange(e)}
                                    className='w-100'
                                    inputClassName={classNames('w-100', { 'p-invalid': errors.minimum_stock })}
                                />
                            </>)}
                        />
                        {getFormErrorMessage('minimum_stock')}
                    </div>
                    <div className="col-md-6">
                        <Controller
                            name="maximum_stock"
                            control={control}
                            rules={{ required: 'Este campo es requerido' }}
                            render={({ field }) => (<>
                                <label htmlFor={field.name} className="form-label">Stock máximo *</label>
                                <InputNumber
                                    inputId={field.name}
                                    min={1}
                                    placeholder="Ingrese el stock máximo"
                                    ref={field.ref}
                                    value={field.value}
                                    onBlur={field.onBlur}
                                    onValueChange={(e) => field.onChange(e)}
                                    className='w-100'
                                    inputClassName={classNames('w-100', { 'p-invalid': errors.maximum_stock })}
                                />
                            </>)}
                        />
                        {getFormErrorMessage('maximum_stock')}
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-12">
                        <Controller
                            name="sale_price"
                            control={control}
                            rules={{ required: 'Este campo es requerido' }}
                            render={({ field }) => (<>
                                <label htmlFor={field.name} className="form-label">Precio de venta *</label>
                                <InputNumber
                                    inputId={field.name}
                                    min={1}
                                    placeholder="Ingrese el precio de venta"
                                    ref={field.ref}
                                    value={field.value}
                                    onBlur={field.onBlur}
                                    onValueChange={(e) => field.onChange(e)}
                                    className='w-100'
                                    inputClassName={classNames('w-100', { 'p-invalid': errors.sale_price })}
                                />
                            </>)}
                        />
                        {getFormErrorMessage('sale_price')}
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-12">
                        <Controller
                            name="sanitary_registration"
                            control={control}
                            rules={{ required: 'Este campo es requerido' }}
                            render={({ field }) => (<>
                                <label htmlFor={field.name} className="form-label">Registro sanitario *</label>
                                <InputText
                                    id={field.name}
                                    placeholder="Ingrese el registro sanitario"
                                    className={classNames('w-100', { 'p-invalid': errors.sanitary_registration })}
                                    {...field}
                                />
                            </>)}
                        />
                        {getFormErrorMessage('sanitary_registration')}
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-12">
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (<>
                                <label htmlFor={field.name} className="form-label">Descripción</label>
                                <InputTextarea
                                    id={field.name}
                                    placeholder="Ingrese la descripción"
                                    className="w-100"
                                    {...field}
                                />
                            </>)}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <Controller
                        name="prescription"
                        control={control}
                        render={({ field }) => (
                            <>
                                <div className="d-flex align-items-center gap-2">
                                    <Checkbox
                                        inputId={field.name}
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.checked)}
                                    />
                                    <label
                                        htmlFor={field.name}
                                        className="ml-2 form-check-label"
                                    >¿Requiere Receta?</label>
                                </div>
                            </>
                        )}
                    />
                </div>
            </form>
        </div>
    );
};