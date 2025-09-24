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
    const { accounts, isLoading: isLoadingAccounts } = useAccountingAccounts();

    const onCreate = () => {
        console.log("Creando nuevo impuesto");
        setInitialData(undefined);
        setTax(null);
        setShowFormModal(true);
    };

    const handleSubmit = async (data: TaxFormInputs) => {
        try {
            console.log("Enviando datos del formulario:", data);

            if (tax) {
                console.log("Actualizando impuesto existente:", tax.id);
                const updateData = TaxesMapperUpdate(data);
                await updateTax(tax.id, updateData);
                SwalManager.success('Impuesto actualizado correctamente');
            } else {
                console.log("Creando nuevo impuesto");
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
            console.log("Editando impuesto con ID:", id);

            const taxData = await fetchTaxById(id);
            console.log("Impuesto encontrado:", taxData);

            if (taxData) {
                setShowFormModal(true);
            } else {
                console.error("No se encontró el impuesto con ID:", id);
                SwalManager.error('No se pudo cargar el impuesto para editar');
            }
        } catch (error) {
            console.error("Error al cargar impuesto para editar:", error);
            SwalManager.error('Error al cargar el impuesto');
        }
    };


    const handleDeleteTax = async (id: string) => {
        try {
            const success = await deleteTax(id);
            if (success) {
                await refreshTaxes();
                SwalManager.success('Impuesto eliminado correctamente');
            } else {
                SwalManager.error('No se pudo eliminar Impuesto');
            }
        } catch (error) {
            console.error("Error en eliminación:", error);
            SwalManager.error('Error al eliminar el Impuesto');
        }
    };


    useEffect(() => {
        if (tax && accounts) {
            console.log("Setting initialData from tax:", tax);
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

    const enrichedTaxes = taxes.map(taxItem => {
        console.log("Datos originales del impuesto:", taxItem);

        const account = accounts.find(acc => acc.id === taxItem.accounting_account_id);
        const returnAccount = accounts.find(acc => acc.id === taxItem.accounting_account_reverse_id);

        const accountData = taxItem.account || (account ? {
            id: account.id.toString(),
            name: account.account_name || account.account || `Cuenta ${account.account_code}`
        } : null);

        const returnAccountData = taxItem.returnAccount || (returnAccount ? {
            id: returnAccount.id.toString(),
            name: returnAccount.account_name || returnAccount.account || `Cuenta ${returnAccount.account_code}`
        } : null);

        return {
            id: taxItem.id,
            name: taxItem.name,
            percentage: taxItem.percentage,
            account: accountData,
            returnAccount: returnAccountData,
            description: taxItem.description
        };
    });

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
                <div className="text-end">
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

            <div
                className="card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto"
                style={{ minHeight: "400px" }}
            >
                <div className="card-body h-100 w-100 d-flex flex-column">
                    <TaxesConfigTable
                        taxes={enrichedTaxes}
                        onEditItem={handleTableEdit}
                        onDeleteItem={handleDeleteTax}
                        loading={loading || isLoadingAccounts}
                    />
                </div>
            </div>

            <TaxConfigModal
                isVisible={showFormModal}
                onSave={handleSubmit}
                onClose={() => {
                    console.log("Cerrando modal");
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