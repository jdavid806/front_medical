import React from 'react';
import UserAvailabilityForm, { UserAvailabilityFormInputs } from './UserAvailabilityForm';
import { CustomModal } from '../../components/CustomModal';

interface UserFormModalProps {
    show: boolean;
    handleSubmit: (data: UserAvailabilityFormInputs) => void
    onHide?: () => void;
}

const UserAvailabilityFormModal: React.FC<UserFormModalProps> = ({ show, handleSubmit, onHide }) => {

    const formId = 'createUserAvailability'

    return (
        <CustomModal
            show={show}
            onHide={onHide}
            title='Crear Horarios de Atención'>
            <UserAvailabilityForm formId={formId} onHandleSubmit={handleSubmit}></UserAvailabilityForm>
        </CustomModal>
    );
};

export default UserAvailabilityFormModal;
