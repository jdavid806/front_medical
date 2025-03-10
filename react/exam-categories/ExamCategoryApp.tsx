import React, { useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { useEffect } from 'react';
import { ExamCategoryTable } from './components/ExamCategoryTable';
import { useExamCategories } from './hooks/useExamCategories';
import { useExamCategoryCreate } from './hooks/useExamCategoryCreate';
import { useExamCategoryUpdate } from './hooks/useExamCategoryUpdate';
import { useExamCategoryDelete } from './hooks/useExamCategoryDelete';
import { useExamCategory } from './hooks/useExamCategory';
import { ExamCategoryFormModal } from './components/ExamCategoryFormModal';
import { ExamCategoryInputs } from './components/ExamCategoryForm';

export const ExamCategoryApp = () => {
    const [showExamCategoryFormModal, setShowExamCategoryFormModal] = useState(false)
    const [initialData, setInitialData] = useState<ExamCategoryInputs | undefined>(undefined)

    const { examCategories, fetchExamCategories } = useExamCategories();
    const { createExamCategory } = useExamCategoryCreate();
    const { updateExamCategory } = useExamCategoryUpdate();
    const { deleteExamCategory } = useExamCategoryDelete();
    const { examCategory, setExamCategory, fetchExamCategory } = useExamCategory();

    const onCreate = () => {
        setInitialData(undefined)
        setExamCategory(null)
        setShowExamCategoryFormModal(true)
    }

    const handleSubmit = async (data: ExamCategoryInputs) => {
        if (examCategory) {
            await updateExamCategory(examCategory.id, data)
        } else {
            await createExamCategory(data)
        }
        fetchExamCategories()
        setShowExamCategoryFormModal(false)
    };

    const handleTableEdit = (id: string) => {
        fetchExamCategory(id);
        setShowExamCategoryFormModal(true);
    };

    const handleTableDelete = async (id: string) => {
        const confirmed = await deleteExamCategory(id)
        if (confirmed) fetchExamCategories()
    };

    useEffect(() => {
        setInitialData({
            name: examCategory?.name ?? ''
        })
    }, [examCategory])

    return (
        <>
            <PrimeReactProvider value={{
                appendTo: 'self',
                zIndex: {
                    overlay: 100000
                }
            }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-1">Categorías de exámenes</h4>
                    <div className="text-end mb-2">
                        <button
                            className="btn btn-primary"
                            onClick={onCreate}
                        >
                            <i className="fas fa-plus"></i> Nueva
                        </button>
                    </div>
                </div>
                <ExamCategoryTable
                    examCategories={examCategories}
                    onEditItem={handleTableEdit}
                    onDeleteItem={handleTableDelete}
                >
                </ExamCategoryTable>
                <ExamCategoryFormModal
                    title={examCategory ? 'Editar categoría de exámen' : 'Crear categoría de exámen'}
                    show={showExamCategoryFormModal}
                    handleSubmit={handleSubmit}
                    onHide={() => { setShowExamCategoryFormModal(false) }}
                    initialData={initialData}
                ></ExamCategoryFormModal>
            </PrimeReactProvider>
        </>
    )
}
