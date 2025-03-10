import React from 'react';
import { CustomFormModal } from '../../components/CustomFormModal';
import { ExamConfigForm, ExamTypeInputs } from './ExamConfigForm';

interface UserFormModalProps {
    title?: string
    show: boolean;
    handleSubmit: (data: ExamTypeInputs) => void
    initialData?: ExamTypeInputs;
    onHide?: () => void;
}

export const ExamConfigFormModal: React.FC<UserFormModalProps> = ({ title = 'Crear examen', show, handleSubmit, onHide, initialData }) => {

    const formId = 'createExamType';

    return (
        <CustomFormModal
            show={show}
            onHide={onHide}
            formId={formId}
            title={title}>
            <ExamConfigForm
                formId={formId}
                onHandleSubmit={handleSubmit}
                initialData={initialData}
            ></ExamConfigForm>
        </CustomFormModal>
    );
};
