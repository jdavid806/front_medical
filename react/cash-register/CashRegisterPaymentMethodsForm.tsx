import React, { useEffect, forwardRef, useImperativeHandle, Ref } from "react";
import { usePaymentMethods } from "../payment-methods/hooks/usePaymentMethods";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { formatPrice } from "../../services/utilidades";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { useState } from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Controller } from "react-hook-form";
import { CashRegisterPayment, CashRegisterPaymentMethodsFormInputs, CashRegisterPaymentMethodsFormRef } from "./interfaces";

interface CashRegisterPaymentMethodsFormProps {
    total: number;
    onPaymentsChange: (payments: CashRegisterPayment[]) => void;
}

export const CashRegisterPaymentMethodsForm = forwardRef((props: CashRegisterPaymentMethodsFormProps, ref: Ref<CashRegisterPaymentMethodsFormRef>) => {

    const { total, onPaymentsChange } = props;

    const { paymentMethods } = usePaymentMethods();

    const { control, setValue, register, formState: { errors }, trigger, getValues } = useForm<CashRegisterPaymentMethodsFormInputs>({
        defaultValues: {
            payments: [],
            currentPayment: {
                method: null,
                amount: total,
                change: 0,
            }
        }
    });

    const { append: appendPayment, remove: removePayment } = useFieldArray({
        control,
        name: "payments",
        rules: {
            required: "Este campo es requerido",
            minLength: {
                value: 1,
                message: "Debe agregar al menos un método de pago"
            }
        }
    });

    const payments = useWatch({
        control,
        name: "payments"
    });

    const currentPayment = useWatch({
        control,
        name: "currentPayment"
    });

    const [totalChange, setTotalChange] = useState(0);
    const [totalPendingAmount, setTotalPendingAmount] = useState(total);
    const [filteredPaymentMethods, setFilteredPaymentMethods] = useState(paymentMethods);

    const paymentAmountBodyTemplate = (rowData: any) => {
        return <span className="font-bold">{formatPrice(rowData.amount)}</span>;
    };

    const paymentChangeBodyTemplate = (rowData: any) => {
        return <span className="font-bold">{formatPrice(rowData.change)}</span>;
    };

    const paymentMethodBodyTemplate = (rowData: any) => {
        return (
            <div className="flex align-items-center gap-2">
                <i className={`mr-2`}></i>
                <span>{rowData.method.method}</span>
            </div>
        );
    };

    const calculateTotalChange = () => {
        const change = payments.reduce((acc, payment) => acc + payment.change, 0);
        setTotalChange(change);
    };

    const calculateTotalPendingAmount = () => {
        const pendingAmount = total - payments.reduce((acc, payment) => acc + payment.amount, 0);
        setTotalPendingAmount(pendingAmount > 0 ? pendingAmount : 0);
        setValue("currentPayment.amount", pendingAmount);
    };

    useEffect(() => {
        if (paymentMethods) {
            const filtered = paymentMethods.filter((method: any) => (
                method.category === "transactional"
                && ["Ventas", "sale"].includes(method.payment_type)
            ));
            setFilteredPaymentMethods(filtered);
        }
    }, [paymentMethods]);

    useEffect(() => {
        calculateTotalChange();
        calculateTotalPendingAmount();
        onPaymentsChange(payments);
    }, [payments]);

    const getFormErrorMessage = (name: keyof CashRegisterPaymentMethodsFormInputs) => {
        return (
            errors[name] && (
                <small className="p-error">{errors[name].root?.message}</small>
            )
        );
    };

    const handleAddPayment = () => {

        setValue("currentPayment", {
            method: null,
            amount: 0,
            change: 0,
        });

        appendPayment({
            method: currentPayment.method,
            amount: currentPayment.amount,
            change: currentPayment.change,
        });
    };

    const handleRemovePayment = (index: number) => {
        removePayment(index);
    };

    const handleCurrentPaymentAmountChange = (value: number) => {
        const remainingAmount = totalPendingAmount || 0;
        const change = remainingAmount - value;

        if (change < 0) {
            setValue('currentPayment.change', Math.abs(change));
        } else {
            setValue('currentPayment.change', 0);
        }

        setValue('currentPayment.amount', value);
    };

    useImperativeHandle(ref, () => ({
        submit: async () => {
            const isValid = await trigger();
            console.log("isValid", isValid);
            console.log("getValues", getValues());
            console.log("errors", errors);
            return {
                isValid,
                getValues: getValues(),
            }
        }
    }));

    return (
        <div className="row">
            <div className="col-12 col-md-6 pb-4">
                {totalChange > 0 && (
                    <Card className="mb-4 border-left-3 border-teal-500 bg-teal-50">
                        <div className="flex justify-content-between align-items-center p-3">
                            <div className="flex align-items-center gap-2">
                                <i className="fas fa-money-bill-wave text-teal-500"></i>
                                <span className="text-lg font-medium">Cambio a devolver</span>
                            </div>
                            <span className="text-xl font-bold text-teal-700">
                                {formatPrice(totalChange)}
                            </span>
                        </div>
                    </Card>
                )}

                <div className="border-round border-1 surface-border mb-4">
                    <DataTable
                        value={payments}
                        className="p-datatable-sm p-datatable-gridlines"
                        emptyMessage={
                            <div className="text-center p-4">
                                <i className="fas fa-info-circle mr-2"></i>
                                No se han agregado métodos de pago
                            </div>
                        }
                        stripedRows
                    >
                        <Column
                            field="method"
                            header="Método"
                            body={paymentMethodBodyTemplate}
                        ></Column>
                        <Column
                            field="amount"
                            header="Monto"
                            body={paymentAmountBodyTemplate}
                        ></Column>
                        <Column
                            field="change"
                            header="Cambio"
                            body={paymentChangeBodyTemplate}
                        ></Column>
                        <Column
                            header="Acciones"
                            body={(rowData: any) => (
                                <Button
                                    icon={<i className="fas fa-trash"></i>}
                                    className="p-button-danger"
                                    size="small"
                                    onClick={() => handleRemovePayment(payments.indexOf(rowData))}
                                    tooltip="Eliminar"
                                    tooltipOptions={{ position: "top" }}
                                />
                            )}
                            headerStyle={{ width: '80px' }}
                        />
                    </DataTable>
                </div>
            </div>

            <div className="surface-card px-4 pb-4 border-round-lg border-1 surface-border shadow-2 col-12 col-md-6">
                <div className="d-flex align-items-center mb-4 gap-3">
                    <h3 className="m-0 text-700 text-right">
                        <i className="fas fa-credit-card me-2 text-xl text-primary"></i>
                        Agregar Nuevo Pago
                    </h3>
                </div>

                <Card className="border-round-lg shadow-1 mb-4">
                    <div className="d-flex flex-column gap-3">
                        <div className="p-fluid">
                            {totalPendingAmount <= 0 && (
                                <div className="mt-2 p-3 border-round-lg bg-green-100 text-green-800">
                                    <i className="fas fa-check-circle me-2"></i>
                                    El pago ha sido completado en su totalidad
                                </div>
                            )}

                            {totalPendingAmount > 0 && (<>
                                <div className="field">
                                    <Controller
                                        name="currentPayment.method"
                                        control={control}
                                        render={({ field }) => (<>
                                            <label htmlFor="paymentMethod" className="block font-medium mb-2">
                                                <i className="fas fa-money-check-alt mr-2"></i> Método de pago
                                            </label>
                                            <Dropdown
                                                {...field}
                                                inputId="paymentMethod"
                                                options={filteredPaymentMethods}
                                                placeholder="Seleccione método..."
                                                className="w-100"
                                                optionLabel="method"
                                                panelClassName="shadow-3"
                                                showClear
                                                filter
                                                filterPlaceholder="Buscar método..."
                                                emptyFilterMessage="No se encontraron métodos"
                                            />
                                        </>)}
                                    />
                                </div>
                                {currentPayment?.method?.is_cash && (<>
                                    <div className="field mt-4">
                                        <label htmlFor="remainingAmount" className="block font-medium mb-2">
                                            <i className="fas fa-receipt mr-2"></i> Total Pendiente
                                        </label>
                                        <InputNumber
                                            id="remainingAmount"
                                            value={totalPendingAmount}
                                            mode="currency"
                                            currency="DOP"
                                            locale="es-DO"
                                            readOnly
                                            className="w-full"
                                            inputClassName="font-bold"
                                        />
                                    </div>

                                    <Controller
                                        name="currentPayment.amount"
                                        control={control}
                                        render={({ field }) => (<>
                                            <div className="field mt-4">
                                                <label htmlFor="cashAmount" className="block font-medium mb-2">
                                                    <i className="fas fa-hand-holding-usd mr-2"></i> Monto Recibido
                                                </label>
                                                <InputNumber
                                                    id="cashAmount"
                                                    value={field.value}
                                                    onValueChange={(e) => handleCurrentPaymentAmountChange(e.value || 0)}
                                                    onChange={(e) => handleCurrentPaymentAmountChange(e.value || 0)}
                                                    mode="currency"
                                                    currency="DOP"
                                                    locale="es-DO"
                                                    className="w-full"
                                                    inputClassName="font-bold"
                                                />
                                            </div>
                                        </>)}
                                    />

                                    <Controller
                                        name="currentPayment.change"
                                        control={control}
                                        render={({ field }) => (<>
                                            <div className="field mt-4">
                                                <label htmlFor="changeAmount" className="block font-medium mb-2">
                                                    <i className="fas fa-exchange-alt mr-2"></i> Cambio a Devolver
                                                </label>
                                                <InputNumber
                                                    id="changeAmount"
                                                    value={field.value}
                                                    mode="currency"
                                                    currency="DOP"
                                                    locale="es-DO"
                                                    readOnly
                                                    className={`w-full ${field.value > 0 ? 'bg-green-100 font-bold' : ''}`}
                                                    inputClassName={field.value > 0 ? 'text-green-700' : ''}
                                                />
                                            </div>
                                        </>)}
                                    />
                                </>)}
                                {!currentPayment?.method?.is_cash && (<>
                                    <Controller
                                        name="currentPayment.amount"
                                        control={control}
                                        render={({ field }) => (<>
                                            <div className="field mt-4">
                                                <label htmlFor="cashAmount" className="block font-medium mb-2">
                                                    <i className="fas fa-hand-holding-usd mr-2"></i> Monto Recibido
                                                </label>
                                                <InputNumber
                                                    id="cashAmount"
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(e.value || 0)}
                                                    onValueChange={(e) => field.onChange(e.value || 0)}
                                                    mode="currency"
                                                    currency="DOP"
                                                    locale="es-DO"
                                                    className="w-full"
                                                    inputClassName="font-bold"
                                                />
                                            </div>
                                        </>)}
                                    />
                                </>)}
                            </>)}
                        </div>
                    </div>
                </Card>

                {totalPendingAmount > 0 && (
                    <div className="d-flex mt-4">
                        <Button
                            label="Agregar Pago"
                            icon={<i className="fas fa-cash-register me-2"></i>}
                            className="p-button-primary"
                            onClick={handleAddPayment}
                            tooltip="Agregar este pago al registro"
                            tooltipOptions={{ position: "left" }}
                            disabled={!currentPayment.method || currentPayment.amount <= 0}
                        />
                    </div>
                )}
            </div>
            {getFormErrorMessage("payments")}
        </div>
    );
})