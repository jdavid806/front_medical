import React, { useEffect, useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import TaxConfigModal from './modal/TaxesConfigModal';
import { TaxesConfigTable } from './table/TaxesConfigTable';
import { useTaxesConfigTable } from './hooks/useTaxesConfigTable';
import { useTaxesCreateTable } from './hooks/useTaxesCreateTable';
import { useTaxesByIdConfigTable } from './hooks/useTaxesByIdConfigTable';
import { SwalManager } from '../../../services/alertManagerImported';
import { CreateTaxDTO, TaxFormInputs, UpdateTaxDTO } from './interfaces/TaxesConfigDTO';
import { useTaxesDeleteTable } from './hooks/useTaxesDeleteTable';
import { useTaxesUpdateTable } from './hooks/useTaxesUpdteTable';
import { TaxesMapperCreate, TaxesMapperUpdate } from './mapper/mappedTaxes';
import { useAccountingAccounts } from '../../accounting/hooks/useAccountingAccounts';

export const TaxesConfig = () => {
    const [showFormModal, setShowFormModal] = useState(false);
    const [initialData, setInitialData] = useState<TaxFormInputs | undefined>(undefined);

    const { taxes, loading, error, refreshTaxes } = useTaxesConfigTable();
    const { createTax, loading: createLoading } = useTaxesCreateTable();
    const { updateTax, loading: updateLoading } = useTaxesUpdateTable();
    const { fetchTaxById, tax, setTax } = useTaxesByIdConfigTable();
    const { deleteTax, loading: deleteLoading } = useTaxesDeleteTable();

    const onCreate = () => {
        setInitialData(undefined);
        setTax(null);
        setShowFormModal(true);
    };

    const { accounts, isLoading: isLoadingAccounts } = useAccountingAccounts();

    const handleSubmit = async (data: TaxFormInputs) => {
        try {
            if (tax) {
                const updateData = TaxesMapperUpdate(data);
                await updateTax(tax.id, updateData);
                SwalManager.success('Impuesto actualizado correctamente');
            } else {
                const createData = TaxesMapperCreate(data);
                await createTax(createData);
                SwalManager.success('Impuesto creado correctamente');
            }

            await refreshTaxes();
            setShowFormModal(false);
        } catch (error) {
            console.error("Error al guardar impuesto:", error);
            SwalManager.error(error.message || 'Error al guardar el impuesto');
        }
    };

    const handleTableEdit = async (id: string) => {
        try {
            await fetchTaxById(id);
            setShowFormModal(true);
        } catch (error) {
            console.error("Error al cargar impuesto:", error);
        }
    };

    const handleDeleteTax = async (id: string) => {
        try {
            await deleteTax(id);
            await refreshTaxes();
        } catch (error) {
            console.error("Error al eliminar impuesto:", error);
        }
    };

    useEffect(() => {
        if (tax && accounts) {
            const data: TaxFormInputs = {
                name: tax.name,
                percentage: tax.percentage,
                accounting_account_id: tax.accounting_account_id,
                accounting_account_reverse_id: tax.accounting_account_reverse_id,
                sell_accounting_account_id: tax.sell_accounting_account_id,
                sell_reverse_accounting_account_id: tax.sell_reverse_accounting_account_id,
                description: tax.description || ''
            };
            setInitialData(data);
        }
    }, [tax, accounts]);

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
                <h4 className="mb-1">Configuración de Impuestos</h4>
                <div style={{ margin: "-2px 20px -20px" }} className="text-end">
                    <button
                        className="btn btn-primary d-flex align-items-center"
                        onClick={onCreate}
                        disabled={createLoading || updateLoading || deleteLoading}
                    >
                        <i className="fas fa-plus me-2"></i>
                        {createLoading || updateLoading ? 'Procesando...' : 'Nuevo Impuesto'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <TaxesConfigTable
                taxes={taxes}
                onEditItem={handleTableEdit}
                onDeleteItem={handleDeleteTax}
                loading={loading}
            />

            <TaxConfigModal
                isVisible={showFormModal}
                onSave={handleSubmit}
                onClose={() => {
                    setShowFormModal(false);
                    setTax(null);
                    setInitialData(undefined);
                }}
                initialData={initialData}
                accounts={accounts}
                loading={createLoading || updateLoading || deleteLoading}
            />
        </PrimeReactProvider>
    );
};