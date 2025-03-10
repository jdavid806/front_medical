import React from 'react';
import { CustomFormModal } from '../../components/CustomFormModal';
import { ModuleForm, ModuleFormInputs } from "./ModuleForm";

interface UserFormModalProps {
    show: boolean;
    handleSubmit: (data: ModuleFormInputs) => void
    initialData?: ModuleFormInputs;
    onHide?: () => void;
}

export const ModuleFormModal: React.FC<UserFormModalProps> = ({ show, handleSubmit, onHide, initialData }) => {

    const formId = 'createModule'

    return (
        <CustomFormModal
            show={show}
            onHide={onHide}
            formId={formId}
            title='Crear Módulo'>
            <ModuleForm formId={formId} onHandleSubmit={handleSubmit} initialData={initialData}></ModuleForm>
        </CustomFormModal>
    );
};
