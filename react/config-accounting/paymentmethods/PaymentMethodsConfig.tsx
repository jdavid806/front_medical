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

export const PaymentMethodsConfig = ({ onConfigurationComplete }: { onConfigurationComplete?: (isComplete: boolean) => void }) => {
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
        console.log("Creando nuevo método de pago");
        setInitialData(undefined);
        setPaymentMethod(null);
        setShowFormModal(true);
    };

    const handleSubmit = async (data: PaymentMethodFormInputs) => {
        try {
            console.log("Enviando datos del formulario:", data);

            const paymentMethodData: CreatePaymentMethodDTO = {
                method: data.name,
                payment_type: data.payment_type || '',
                description: data.additionalDetails || '',
                accounting_account_id: data.accounting_account_id || 0,
                category: data.category,
                is_cash: data.is_cash
            };

            if (paymentMethod) {
                console.log("Actualizando método existente:", paymentMethod.id);
                await updatePaymentMethod(paymentMethod.id.toString(), paymentMethodData);
                SwalManager.success('Método actualizado correctamente');
            } else {
                console.log("Creando nuevo método");
                await createPaymentMethod(paymentMethodData);
                SwalManager.success('Método creado correctamente');
            }

            await refreshPaymentMethods();
            setShowFormModal(false);
        } catch (error) {
            console.error("Error al enviar formulario:", error);
            // El error ya se maneja en el hook
        }
    };

    const handleTableEdit = async (id: string) => {
        try {
            console.log("Editando método con ID:", id);

            const paymentMethodData = await fetchPaymentMethodById(id);
            console.log("paymentMethod encontrado:", paymentMethodData);

            if (paymentMethodData) {
                setShowFormModal(true);
            } else {
                console.error("No se encontró el método de pago con ID:", id);
                SwalManager.error('No se pudo cargar el método de pago para editar');
            }
        } catch (error) {
            console.error("Error al cargar método para editar:", error);
            SwalManager.error('Error al cargar el método de pago');
        }
    };

    const handleDeleteMethod = async (id: string) => {
        try {
            const success = await deletePaymentMethod(id);
            if (success) {
                await refreshPaymentMethods();
                SwalManager.success('Método eliminado correctamente');
            } else {
                SwalManager.error('No se pudo eliminar el método de pago');
            }
        } catch (error) {
            console.error("Error en eliminación:", error);
            SwalManager.error('Error al eliminar el método de pago');
        }
    };

    useEffect(() => {
        const hasPaymentMethods = paymentMethods && paymentMethods.length > 0;
        onConfigurationComplete?.(hasPaymentMethods);
    }, [paymentMethods, onConfigurationComplete]);

    useEffect(() => {
        if (paymentMethod) {
            console.log("Setting initialData from paymentMethod:", paymentMethod);
            const data: PaymentMethodFormInputs = {
                name: paymentMethod.method,
                payment_type: paymentMethod.payment_type,
                category: paymentMethod.category || 'other',
                is_cash: paymentMethod.is_cash,
                accounting_account_id: paymentMethod.accounting_account_id,
                additionalDetails: paymentMethod.description,
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
                <div className="text-end">
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

            {
                error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )
            }

            <div
                className="card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto"
                style={{ minHeight: "400px" }}
            >
                <div className="card-body h-100 w-100 d-flex flex-column">

                    <PaymentMethodsConfigTable
                        onEditItem={handleTableEdit}
                        paymentMethods={enrichedPaymentMethods}
                        onDeleteItem={handleDeleteMethod}
                        loading={loading}
                    />
                </div>

            </div>
            <PaymentMethodModalConfig
                isVisible={showFormModal}
                onSave={handleSubmit}
                onClose={() => {
                    console.log("Cerrando modal");
                    setShowFormModal(false);
                    setPaymentMethod(null);
                    setInitialData(undefined);
                }}
                initialData={initialData}
                accounts={accounts}
                loading={createLoading || updateLoading || deleteLoading}
            />
        </PrimeReactProvider >
    );
};