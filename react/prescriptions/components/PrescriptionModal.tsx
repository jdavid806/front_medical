import React from 'react';
import { CustomModal } from '../../components/CustomModal';
import PrescriptionForm from './PrescriptionForm';
import { PrescriptionModalProps  } from '../interfaces/PrescriptionInterfaces';

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({ show, handleSubmit, onHide }) => {

    const formId = 'createReceta'

    return (
        <CustomModal
            show={show}
            onHide={onHide}
            title='Crear receta'>
            <PrescriptionForm formId={formId} handleSubmit={handleSubmit}></PrescriptionForm>
        </CustomModal>
    );
};

export default PrescriptionModal;
