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
    who_delivers: string
    who_validate: string
    payments: {
        payment_method_id: number;
        amount: number;
    }[]
}

interface ExamCategoryFormProps {
    formId: string;
    onHandleSubmit: (data: CashControlInputs) => void;
}

export const CashControlForm: React.FC<ExamCategoryFormProps> = ({ formId, onHandleSubmit }) => {

    const { paymentMethods } = usePaymentMethods();
    const { users } = useUsersForSelect()
    const [mappedPaymentMethods, setMappedPaymentMethods] = useState<any[]>([]);
    const [total, setTotal] = useState(0);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
        setValue
    } = useForm<CashControlInputs>({
        defaultValues: {
            who_delivers: '',
            payments: []
        }
    })
    const onSubmit: SubmitHandler<CashControlInputs> = (data) => onHandleSubmit(data)

    const getFormErrorMessage = (name: keyof CashControlInputs) => {
        return errors[name] && <small className="p-error">{errors[name].message?.toString()}</small>
    };

    useEffect(() => {
        reset({
            who_delivers: ''
        });
    }, [reset]);

    useEffect(() => {
        const filteredPaymentMethods = paymentMethods.filter(paymentMethod => {
            return paymentMethod.category === 'transactional'
        })

        setMappedPaymentMethods(filteredPaymentMethods.map(paymentMethod => ({ ...paymentMethod, amount: 0 })))
    }, [paymentMethods])

    const handlePaymentMethodsAmountChange = (e: InputNumberChangeEvent, index: number) => {
        setMappedPaymentMethods(prev => {
            const newPaymentMethods = [...prev];
            console.log(e.value);

            const newAmount = !e.value || e.value <= 0 || isNaN(e.value) ? 0 : e.value;
            newPaymentMethods[index].amount = newAmount;

            setValue('payments', newPaymentMethods.map(paymentMethod => ({ payment_method_id: paymentMethod.id, amount: paymentMethod.amount })))
            setTotal(newPaymentMethods.reduce((acc, paymentMethod) => acc + paymentMethod.amount, 0))

            return newPaymentMethods
        })
    }

    return (
        <div>
            <form id={formId} className="needs-validation" noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <Controller
                        name='who_delivers'
                        control={control}
                        rules={{ required: 'Este campo es requerido' }}
                        render={({ field }) =>
                            <>
                                <label htmlFor={field.name} className="form-label">Usuario que entrega el dinero *</label>
                                <Dropdown
                                    options={users}
                                    optionLabel="label"
                                    optionValue='external_id'
                                    placeholder="Seleccione al usuario que entrega el dinero"
                                    filter
                                    value={field.value}
                                    onChange={field.onChange}
                                    className={classNames('w-100', { 'p-invalid': errors.who_delivers })}
                                />
                            </>
                        }
                    />
                    {getFormErrorMessage('who_delivers')}
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
                                            min={0}
                                            useGrouping={false}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="text-end">
                        <h4 className="m-0">Total: {isNaN(total) ? 0 : total}</h4>
                    </div>
                </div>
            </form>
        </div>
    );
};
