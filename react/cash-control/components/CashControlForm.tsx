import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { useEffect } from 'react';
import { usePaymentMethods } from '../../payment-methods/hooks/usePaymentMethods';
import { useState } from 'react';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { useUsersForSelect } from "../../users/hooks/useUsersForSelect";
import { Dropdown } from 'primereact/dropdown';

export type CashControlInputs = {
    user_id: string
    total: number
}

interface ExamCategoryFormProps {
    formId: string;
    onHandleSubmit: (data: CashControlInputs) => void;
}

export const CashControlForm: React.FC<ExamCategoryFormProps> = ({ formId, onHandleSubmit }) => {

    const { paymentMethods } = usePaymentMethods();
    const { users } = useUsersForSelect()
    const [mappedPaymentMethods, setMappedPaymentMethods] = useState<any[]>([]);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
        setValue
    } = useForm<CashControlInputs>({
        defaultValues: {
            user_id: '',
            total: 0
        }
    })
    const onSubmit: SubmitHandler<CashControlInputs> = (data) => onHandleSubmit(data)

    const getFormErrorMessage = (name: keyof CashControlInputs) => {
        return errors[name] && <small className="p-error">{errors[name].message?.toString()}</small>
    };

    useEffect(() => {
        reset({
            user_id: ''
        });
    }, [reset]);

    useEffect(() => {
        setMappedPaymentMethods(paymentMethods.map(paymentMethod => ({ ...paymentMethod, amount: 0 })))
    }, [paymentMethods])

    const handlePaymentMethodsAmountChange = (e: InputNumberChangeEvent, index: number) => {
        setMappedPaymentMethods(prev => {
            const newPaymentMethods = [...prev];
            newPaymentMethods[index].amount = e.value;

            const total = newPaymentMethods?.reduce((acc, pm) => acc + pm.amount, 0)
            setValue('total', total)

            return newPaymentMethods
        })
    }

    return (
        <div>
            <form id={formId} className="needs-validation" noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <Controller
                        name='user_id'
                        control={control}
                        rules={{ required: 'Este campo es requerido' }}
                        render={({ field }) =>
                            <>
                                <label htmlFor={field.name} className="form-label">Usuario que entrega el dinero *</label>
                                <Dropdown
                                    options={users}
                                    optionLabel="label"
                                    optionValue='value'
                                    placeholder="Seleccione al usuario que entrega el dinero"
                                    filter
                                    value={field.value}
                                    onChange={field.onChange}
                                    className={classNames('w-100', { 'p-invalid': errors.user_id })}
                                />
                            </>
                        }
                    />
                    {getFormErrorMessage('user_id')}
                </div>
                <div className="mb-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Método de Pago</th>
                                <th scope="col">Cantidad Recibida</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mappedPaymentMethods.map((paymentMethod, index) => (
                                <tr key={paymentMethod.id}>
                                    <td>{paymentMethod.method}</td>
                                    <td>
                                        <InputNumber
                                            value={paymentMethod.amount}
                                            onChange={e => handlePaymentMethodsAmountChange(e, index)}
                                            className='w-100'
                                            inputClassName='w-100'
                                            prefix="$"
                                            useGrouping={false}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="text-end">
                        <h4 className="m-0">Total: {isNaN(getValues('total')) ? 0 : getValues('total')}</h4>
                    </div>
                </div>
            </form>
        </div>
    );
};
