import React from 'react';
import UserForm from '../../users/UserForm';
import { CustomModal } from '../../components/CustomModal';

interface PrescriptionFormModalProps {
    show: boolean;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    onHide?: () => void;
}

const PrescriptionFormModal: React.FC<PrescriptionFormModalProps> = ({ show, handleSubmit, onHide }) => {

    const formId = 'createDoctor'

    return (
        <CustomModal
            show={show}
            onHide={onHide}
            title='Crear receta'>
            <UserForm formId={formId} handleSubmit={handleSubmit}></UserForm>
        </CustomModal>
    );
};

export default PrescriptionFormModal;
