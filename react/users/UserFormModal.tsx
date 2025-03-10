import React from 'react';
import UserForm from './UserForm';
import { CustomFormModal } from '../components/CustomFormModal';

interface UserFormModalProps {
    show: boolean;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
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
            <UserForm formId={formId} handleSubmit={handleSubmit}></UserForm>
        </CustomFormModal>
    );
};

export default UserFormModal;
