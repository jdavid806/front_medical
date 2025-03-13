import React from 'react';
import UserAvailabilityForm, { UserAvailabilityFormInputs } from './UserAvailabilityForm';
import { CustomModal } from '../../components/CustomModal';

interface UserFormModalProps {
    show: boolean;
    handleSubmit: (data: UserAvailabilityFormInputs) => void
    initialData?: UserAvailabilityFormInputs;
    onHide?: () => void;
}

const UserAvailabilityFormModal: React.FC<UserFormModalProps> = ({ show, handleSubmit, initialData, onHide }) => {

    const formId = 'createUserAvailability'

    return (
        <CustomModal
            show={show}
            onHide={onHide}
            title='Crear Horarios de Atención'>
            <UserAvailabilityForm
                formId={formId}
                onHandleSubmit={handleSubmit}
                initialData={initialData}
            ></UserAvailabilityForm>
        </CustomModal>
    );
};

export default UserAvailabilityFormModal;
