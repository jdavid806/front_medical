import React from 'react';
import { CustomFormModal } from '../../components/CustomFormModal';
import { ExamCategoryForm, ExamCategoryInputs } from './ExamCategoryForm';

interface ExamCategoryFormModalProps {
    title?: string;
    show: boolean;
    handleSubmit: (data: ExamCategoryInputs) => void;
    initialData?: ExamCategoryInputs;
    onHide?: () => void;
}

export const ExamCategoryFormModal: React.FC<ExamCategoryFormModalProps> = ({ title = 'Crear categoría de examen', show, handleSubmit, onHide, initialData }) => {

    const formId = 'createExamCategory';

    return (
        <CustomFormModal
            show={show}
            onHide={onHide}
            formId={formId}
            title={title}>
            <ExamCategoryForm
                formId={formId}
                onHandleSubmit={handleSubmit}
                initialData={initialData}
            ></ExamCategoryForm>
        </CustomFormModal>
    );
};
