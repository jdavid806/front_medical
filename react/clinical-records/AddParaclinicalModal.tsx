import React from 'react';
import { CustomFormModal } from '../components/CustomFormModal';
import { AddParaclinicalForm } from './AddParaclinicalForm';

export interface AddParaclinicalModalProps {
    show: boolean;
    onHide: () => void;
}

export const AddParaclinicalModal: React.FC<AddParaclinicalModalProps> = ({ show, onHide }) => {

    return (<>
        <CustomFormModal
            formId='createParaclinical'
            show={show}
            title='Agregar paraclínico' onHide={onHide}
        >
            <AddParaclinicalForm
                formId='createParaclinical'
                onHandleSubmit={onHide}
            >
            </AddParaclinicalForm>
        </CustomFormModal>
    </>);
};
