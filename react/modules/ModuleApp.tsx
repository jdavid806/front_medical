import React, { useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { ModuleFormModal } from './components/ModuleFormModal';
import { ModuleFormInputs } from './components/ModuleForm';
import { useModuleCreate } from './hooks/useModuleCreate';
import { ModuleTable } from './components/ModuleTable';
import { useModules } from './hooks/useModules';
import { useModule } from './hooks/useModule';
import { useEffect } from 'react';
import { useModuleUpdate } from './hooks/useModuleUpdate';
import { useModuleDelete } from './hooks/useModuleDelete';

export const ModuleApp = () => {

    const [showFormModal, setShowFormModal] = useState(false)
    const [initialData, setInitialData] = useState<ModuleFormInputs | undefined>(undefined)

    const { modules, fetchModules } = useModules();
    const { createModule } = useModuleCreate();
    const { updateModule } = useModuleUpdate();
    const { deleteModule } = useModuleDelete();
    const { module, fetchModule } = useModule();

    const onCreate = () => {
        setInitialData(undefined)
        setShowFormModal(true)
    }

    const handleSubmit = async (data: ModuleFormInputs) => {
        if (module) {
            await updateModule(module.id, data)
        } else {
            await createModule(data)
        }
        fetchModules()
        setShowFormModal(false)
    };

    const handleTableEdit = (id: string) => {
        fetchModule(id);
        setShowFormModal(true);
    };

    const handleTableDelete = async (id: string) => {
        const confirmed = await deleteModule(id)
        if (confirmed) fetchModules()
    };

    useEffect(() => {
        setInitialData({
            name: module?.name || '',
            branch_id: module?.branch_id.toString() || '1',
            allowed_reasons: module?.allowed_reasons || []
        })
    }, [module])

    return (
        <>
            <PrimeReactProvider value={{
                appendTo: 'self',
                zIndex: {
                    overlay: 100000
                }
            }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-1">Modulos</h4>
                    <div className="text-end mb-2">
                        <button
                            className="btn btn-primary"
                            onClick={onCreate}
                        >
                            <i className="fas fa-plus"></i> Nuevo
                        </button>
                    </div>
                </div>
                <ModuleTable
                    modules={modules}
                    onEditItem={handleTableEdit}
                    onDeleteItem={handleTableDelete}
                >
                </ModuleTable>
                <ModuleFormModal
                    show={showFormModal}
                    handleSubmit={handleSubmit}
                    onHide={() => { setShowFormModal(false) }}
                    initialData={initialData}
                ></ModuleFormModal>
            </PrimeReactProvider>
        </>
    )
}
