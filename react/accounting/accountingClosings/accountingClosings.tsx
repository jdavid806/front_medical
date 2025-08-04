import React, { useEffect, useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { AccountingClosingsTable } from './table/AccountingClosingsTable';
import AccountingClosingModal from './modal/AccountingClosingModal';
import { useAccountingClosings } from './hooks/useAccountingClosings';
import { AccountingClosingFormInputs } from './form/AccountingClosingForm';
import { useAccountingClosingsCreate } from './hooks/useAccountingClosingsCreate';
import { useAccountingClosing } from './hooks/useAccountingClosing';
import { useAccountingClosingsUpdate } from './hooks/useAccountingClosingsUpdate';
import { useAccountingClosingDelete } from './hooks/useAccountingClosingDelete';
import { stringToDate } from '../../../services/utilidades';

export const accountingClosings = () => {
    const [showFormModal, setShowFormModal] = useState(false);
    const [initialData, setInitialData] = useState<AccountingClosingFormInputs | undefined>(
        undefined
    );

    const { accountingClosings, fetchAccountingClosings } = useAccountingClosings();
    const { createAccountingClosing } = useAccountingClosingsCreate();
    const { accountingClosing, fetchAccountingClosing, setAccountingClosing } = useAccountingClosing();
    const { updateAccountingClosing } = useAccountingClosingsUpdate();
    const { deleteAccountingClosing } = useAccountingClosingDelete();

    const handleCreate = () => {
        setInitialData(undefined);
        setAccountingClosing(null);
        setShowFormModal(true);
    };

    const handleSubmit = async (data: AccountingClosingFormInputs) => {
        try {
            if (accountingClosing) {
                await updateAccountingClosing(accountingClosing.data.id.toString(), data);
            } else {
                await createAccountingClosing(data);
            }
            fetchAccountingClosings();
            setShowFormModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleTableEdit = (id: string) => {
        fetchAccountingClosing(id);
        setShowFormModal(true);
    };

    useEffect(() => {
        if (accountingClosing) {
            setInitialData({
                age: accountingClosing.data.age,
                status: accountingClosing.data.status,
                start_month: stringToDate(accountingClosing.data.start_month.split("T")[0]),
                end_month: stringToDate(accountingClosing.data.end_month.split("T")[0]),
                warning_days: accountingClosing.data.warning_days
            });
        }
    }, [accountingClosing]);

    const handleTableDelete = async (id: string) => {
        const confirmed = await deleteAccountingClosing(id)
        if (confirmed) fetchAccountingClosings()
    };

    return (
        <PrimeReactProvider>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-1">Cierres Contables</h4>
                <div style={{ margin: "-2px 20px -20px" }} className="text-end">
                    <button
                        className="btn btn-primary d-flex align-items-center"
                        onClick={handleCreate}
                    >
                        <i className="fas fa-plus me-2"></i>
                        Nuevo Período
                    </button>
                </div>
            </div>

            <AccountingClosingsTable
                closings={accountingClosings}
                onEditItem={handleTableEdit}
                onDeleteItem={handleTableDelete}
            />

            <AccountingClosingModal
                isVisible={showFormModal}
                onSave={handleSubmit}
                onClose={() => setShowFormModal(false)}
                initialData={initialData}
            />
        </PrimeReactProvider>
    );
};