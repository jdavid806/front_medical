import React from 'react';
import UserForm, { UserFormInputs } from './UserForm';
import { CustomFormModal } from '../components/CustomFormModal';

interface UserFormModalProps {
    show: boolean;
    handleSubmit: (data: UserFormInputs) => void;
    onHide?: () => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ show, handleSubmit, onHide }) => {

    const formId = 'createDoctor'

    return (
        <CustomFormModal
            show={show}
            formId={formId}
            onHide={onHide}
            title='Crear usuario'>
            <UserForm formId={formId} onHandleSubmit={handleSubmit}></UserForm>
        </CustomFormModal>
    );
};

export default UserFormModal;
