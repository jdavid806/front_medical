import React, { useEffect, useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import PaymentMethodModalConfig from './modal/PaymentMethodModalConfig';
import { PaymentMethodsConfigTable } from './table/PaymentMethodsConfigTable';
import { PaymentMethodFormInputs } from './interfaces/PaymentMethodFormConfigTypes';
import { usePaymentMethodsConfigTable } from './hooks/usePaymentMethodsConfigTable';
import { usePaymentMethodCreate } from './hooks/usePaymentMethodCreateTable';
import { usePaymentMethodUpdate } from './hooks/usePaymentMethodUpadteTable';
import { usePaymentMethodById } from './hooks/usePaymentMethodConfigByIdTable';
import { SwalManager } from '../../../services/alertManagerImported';
import { CreatePaymentMethodDTO } from './interfaces/PaymentMethodDTO';
import { usePaymentMethodDelete } from './hooks/usePaymentMethodDeleteTable';
import { useAccountingAccounts } from '../../accounting/hooks/useAccountingAccounts';

export const PaymentMethodsConfig = () => {
    const [showFormModal, setShowFormModal] = useState(false);
    const [initialData, setInitialData] = useState<PaymentMethodFormInputs | undefined>(undefined);

    const { paymentMethods, loading, error, refreshPaymentMethods } = usePaymentMethodsConfigTable();
    const { createPaymentMethod, loading: createLoading } = usePaymentMethodCreate();
    const { updatePaymentMethod, loading: updateLoading } = usePaymentMethodUpdate();
    const { fetchPaymentMethodById, paymentMethod, setPaymentMethod } = usePaymentMethodById();
    const { deletePaymentMethod, loading: deleteLoading } = usePaymentMethodDelete();
    const { accounts } = useAccountingAccounts();


    const enrichedPaymentMethods = paymentMethods.map(method => {
        const account = accounts.find(acc => acc.id === method.accounting_account_id);
        return {
            id: method.id,
            name: method.method,
            category: method.category || 'other',
            account: account ? {
                id: account.id,
                name: account.account_name || account.account || 'Cuenta contable'
            } : null,
            additionalDetails: method.description
        };
    });
    const onCreate = () => {
        setInitialData(undefined);
        setPaymentMethod(null);
        setShowFormModal(true);
    };

    const handleSubmit = async (data: PaymentMethodFormInputs) => {
        try {
            const paymentMethodData: CreatePaymentMethodDTO = {
                method: data.name,
                payment_type: data.payment_type || '',
                description: data.additionalDetails || '',
                accounting_account_id: data.account?.id || 0,
                category: data.category
            };

            if (paymentMethod) {
                await updatePaymentMethod(paymentMethod.id.toString(), paymentMethodData);
                SwalManager.success('Método actualizado correctamente');
            } else {
                await createPaymentMethod(paymentMethodData);
                SwalManager.success('Método creado correctamente');
            }

            await refreshPaymentMethods();
            setShowFormModal(false);
        } catch (error) {
            // El error ya se maneja en el hook
        }
    };

    const handleTableEdit = async (id: string) => {
        try {
            const paymentMethod = await fetchPaymentMethodById(id);
            console.log("paymentMethod", paymentMethod);
            setShowFormModal(true);

        } catch (error) {

        }
    };
    const handleDeleteMethod = async (id: string) => {
        try {
            const success = await deletePaymentMethod(id);
            if (success) {
                await refreshPaymentMethods();
            }
        } catch (error) {
            console.error("Error en eliminación:", error);
        }
    };

    useEffect(() => {
        if (paymentMethod) {
            const data: PaymentMethodFormInputs = {
                name: paymentMethod.method,
                payment_type: paymentMethod.payment_type,
                category: paymentMethod.category || 'other',
                account: paymentMethod.accounting_account_id ? {
                    id: paymentMethod.accounting_account_id,
                    name: 'Cuenta contable'
                } : null,
                additionalDetails: paymentMethod.description
            };
            setInitialData(data);
        }
    }, [paymentMethod]);


    return (
        <PrimeReactProvider
            value={{
                appendTo: "self",
                zIndex: {
                    overlay: 100000,
                },
            }}
        >
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-1">Configuración de Métodos de Pago</h4>
                <div style={{ margin: "-2px 20px -20px" }} className="text-end">
                    <button
                        className="btn btn-primary d-flex align-items-center"
                        onClick={onCreate}
                        disabled={createLoading || updateLoading || deleteLoading}
                    >
                        <i className="fas fa-plus me-2"></i>
                        {createLoading || updateLoading ? 'Procesando...' : 'Nuevo Método'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <PaymentMethodsConfigTable
                onEditItem={handleTableEdit}
                paymentMethods={enrichedPaymentMethods}
                onDeleteItem={handleDeleteMethod}
                loading={loading}
            />

            <PaymentMethodModalConfig
                isVisible={showFormModal}
                onSave={handleSubmit}
                onClose={() => {
                    setShowFormModal(false);
                    setPaymentMethod(null);
                    setInitialData(undefined);
                }}
                initialData={initialData}
                accounts={[]}
                loading={createLoading || updateLoading || deleteLoading}
            />
        </PrimeReactProvider>
    );
};