import React from 'react';
import UserForm, { UserFormConfig, UserFormInputs } from './UserForm';
import { CustomFormModal } from '../components/CustomFormModal';

interface UserFormModalProps {
    title: string;
    show: boolean;
    handleSubmit: (data: UserFormInputs) => void;
    initialData?: UserFormInputs;
    config?: UserFormConfig;
    onHide?: () => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ title, show, handleSubmit, onHide, initialData, config }) => {

    const formId = 'createDoctor'

    return (
        <CustomFormModal
            show={show}
            formId={formId}
            onHide={onHide}
            title={title}>
            <UserForm
                formId={formId}
                onHandleSubmit={handleSubmit}
                initialData={initialData}
                config={config}
            ></UserForm>
        </CustomFormModal>
    );
};

export default UserFormModal;
