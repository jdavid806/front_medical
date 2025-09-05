import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { AccountingAccountNode } from './hooks/useAccountingAccountsTree';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Controller, useForm } from 'react-hook-form';
import { InputSwitch } from 'primereact/inputswitch';
import { classNames } from 'primereact/utils';
import { Divider } from 'primereact/divider';

interface EditAccountingAccountFormModalProps {
    visible: boolean;
    onHide: () => void;
    handleUpdateAccount: (data: EditAccountingAccountFormModalData) => void;
    selectedAccount: AccountingAccountNode | null;
    ref: React.RefObject<EditAccountingAccountFormModalRef | null>;
}

interface EditAccountingAccountFormModalInputs {
    account_name: string;
    initial_balance: number;
    fiscal_difference: boolean;
    active: boolean;
    sub_account_code: string
}

export interface EditAccountingAccountFormModalData {
    id: string;
    status: string;
    account_name: string;
    initial_balance: number;
}

export interface EditAccountingAccountFormModalRef {
    resetForm: () => void;
}

export const EditAccountingAccountFormModal: React.FC<EditAccountingAccountFormModalProps> = forwardRef((props, ref) => {

    const { visible, onHide, handleUpdateAccount, selectedAccount } = props;
    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<EditAccountingAccountFormModalInputs>({
        defaultValues: {
            account_name: "",
            initial_balance: 0,
            fiscal_difference: false,
            active: true,
            sub_account_code: ""
        }
    });

    const getFormErrorMessage = (name: keyof EditAccountingAccountFormModalInputs) => {
        console.log(errors);
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const onSubmit = (data: EditAccountingAccountFormModalInputs) => {
        const accountData: EditAccountingAccountFormModalData = {
            id: selectedAccount?.id.toString() || "",
            account_name: data.account_name,
            initial_balance: data.initial_balance,
            status: data.active ? "active" : "inactive",
        };
        handleUpdateAccount(accountData);
    };

    useImperativeHandle(ref, () => ({
        resetForm: () => {
            reset();
        }
    }));

    useEffect(() => {
        if (selectedAccount) {
            setValue("account_name", selectedAccount.account_name);
            setValue("initial_balance", selectedAccount.initial_balance);
            setValue("fiscal_difference", false);
            setValue("active", selectedAccount.status === "active");
        }
    }, [selectedAccount]);

    return (<>
        <Dialog
            header="Editar Cuenta"
            visible={visible}
            style={{ width: "90vw", maxWidth: "600px" }}
            onHide={onHide}
            modal
        >
            <form className="needs-validation row" noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className="p-fluid grid formgrid">

                    <div className="field col-12 mb-3">
                        <label htmlFor="accountName">Nombre *</label>
                        <Controller
                            name="account_name"
                            control={control}
                            rules={{
                                required: "Este campo es requerido",
                                minLength: {
                                    value: 3,
                                    message: "El nombre debe tener al menos 3 caracteres"
                                }
                            }}
                            render={({ field }) => (
                                <InputText
                                    id="accountName"
                                    {...field}
                                />
                            )}
                        />
                        {getFormErrorMessage("account_name")}
                    </div>

                    <div className="field col-12 mb-3">
                        <label htmlFor="initialBalance">Saldo Inicial</label>
                        <Controller
                            name="initial_balance"
                            control={control}
                            render={({ field }) => (
                                <InputNumber
                                    inputId={field.name}
                                    ref={field.ref}
                                    value={field.value}
                                    onBlur={field.onBlur}
                                    onValueChange={(e) => field.onChange(e)}
                                    className='w-100'
                                    inputClassName={classNames('w-100', { 'p-invalid': errors.initial_balance })}
                                    mode="currency"
                                    currency="DOP"
                                    locale="es-DO"
                                />
                            )}
                        />
                    </div>

                    <div className="field-checkbox col-12 mb-3">
                        <Controller
                            name="fiscal_difference"
                            control={control}
                            render={({ field }) => (
                                <div className="d-flex align-items-center gap-2">
                                    <InputSwitch
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.value)}
                                    />
                                    <label className="form-check-label">Cuenta de diferencia fiscal</label>
                                </div>
                            )}
                        />
                    </div>

                    <div className="field-checkbox col-12 mb-3">
                        <Controller
                            name="active"
                            control={control}
                            render={({ field }) => (
                                <div className="d-flex align-items-center gap-2">
                                    <InputSwitch
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.value)}
                                    />
                                    <label className="form-check-label">Cuenta activa</label>
                                </div>
                            )}
                        />
                    </div>
                </div>

                <Divider />

                <div className="d-flex justify-content-end gap-2">
                    <Button
                        type='button'
                        label="Cancelar"
                        icon={<i className="fa fa-times me-2"></i>}
                        className="btn btn-danger"
                        onClick={() => {
                            onHide();
                        }}
                    />
                    <Button
                        label="Guardar"
                        type="submit"
                        icon={<i className="fa fa-save me-2"></i>}
                        className="btn btn-primary"
                    />
                </div>
            </form>
        </Dialog>
    </>)
})