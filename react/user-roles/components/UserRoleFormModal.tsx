import React from 'react';
import { CustomFormModal } from '../../components/CustomFormModal';
import { UserRoleForm, UserRoleFormInputs } from './UserRoleForm';

interface UserRoleFormModalProps {
    title?: string
    show: boolean;
    handleSubmit: (data: UserRoleFormInputs) => void
    initialData?: UserRoleFormInputs;
    onHide?: () => void;
}

export const UserRoleFormModal: React.FC<UserRoleFormModalProps> = ({ title = 'Crear examen', show, handleSubmit, onHide, initialData }) => {

    const formId = 'createExamType';

    return (
        <CustomFormModal
            show={show}
            onHide={onHide}
            formId={formId}
            title={title}
            scrollable={true}
        >
            <UserRoleForm
                formId={formId}
                onHandleSubmit={handleSubmit}
                initialData={initialData}
            ></UserRoleForm>
        </CustomFormModal>
    );
};
