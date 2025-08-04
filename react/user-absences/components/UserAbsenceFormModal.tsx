import React from 'react';
import { CustomFormModal } from '../../components/CustomFormModal';
import { UserAbsenceForm, UserAbsenceFormInputs } from './UserAbsenceForm';

interface UserFormModalProps {
    show: boolean;
    handleSubmit: (data: UserAbsenceFormInputs) => void
    initialData?: UserAbsenceFormInputs;
    onHide?: () => void;
}

export const UserAbsenceFormModal: React.FC<UserFormModalProps> = ({ show, handleSubmit, onHide, initialData }) => {

    const formId = 'createUserAbsence'

    return (
        <CustomFormModal
            show={show}
            onHide={onHide}
            formId={formId}
            title='Crear ausencia programada'>
            <UserAbsenceForm formId={formId} onHandleSubmit={handleSubmit} initialData={initialData}></UserAbsenceForm>
        </CustomFormModal>
    );
};
