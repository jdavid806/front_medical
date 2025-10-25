import React from 'react';
import { CustomFormModal } from '../../components/CustomFormModal';
import { ExamConfigForm, ExamTypeInputs } from './ExamConfigForm';
import { Dialog } from 'primereact/dialog';

interface UserFormModalProps {
    title?: string
    show: boolean;
    handleSubmit: (data: ExamTypeInputs) => void
    initialData?: ExamTypeInputs;
    onHide?: () => void;
}

export const ExamConfigFormModal: React.FC<UserFormModalProps> = ({ title = 'Crear examen', show, handleSubmit, onHide, initialData }) => {

    const formId = 'createExamType';

    const footer = (
        <>
            <button
                className="btn btn-link text-danger px-3 my-0"
                aria-label="Close"
                onClick={onHide}>
                <i className="fas fa-arrow-left"></i> Cerrar
            </button>
            <button
                type='submit'
                form={formId}
                className="btn btn-primary my-0"
            >
                <i className="fas fa-bookmark"></i> Guardar
            </button>
        </>
    )

    return (
        <Dialog
            visible={show}
            onHide={() => { onHide?.() }}
            header={title}
            footer={footer}
            style={{ width: "70vw" }}
        >
            <ExamConfigForm
                formId={formId}
                onHandleSubmit={handleSubmit}
                initialData={initialData}
            ></ExamConfigForm>
        </Dialog>
    );
};
