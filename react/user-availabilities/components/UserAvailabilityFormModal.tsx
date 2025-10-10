import React from 'react';
import UserAvailabilityForm, { UserAvailabilityFormInputs } from './UserAvailabilityForm';
import { Dialog } from 'primereact/dialog';

interface UserFormModalProps {
    show: boolean;
    handleSubmit: (data: UserAvailabilityFormInputs) => void
    initialData?: UserAvailabilityFormInputs;
    onHide?: () => void;
}

const UserAvailabilityFormModal: React.FC<UserFormModalProps> = ({ show, handleSubmit, initialData, onHide }) => {

    const formId = 'createUserAvailability'

    return (
        <Dialog
            visible={show}
            onHide={() => onHide?.()}
            header='Crear Horarios de Atención'
            style={{ width: '65vw' }}
        >
            <UserAvailabilityForm
                formId={formId}
                onHandleSubmit={handleSubmit}
                initialData={initialData}
            ></UserAvailabilityForm>
        </Dialog>
    );
};

export default UserAvailabilityFormModal;
