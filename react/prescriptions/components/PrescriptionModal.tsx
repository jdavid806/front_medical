import React, { useRef } from 'react';
import { CustomModal } from '../../components/CustomModal';
import PrescriptionForm from './PrescriptionForm';
import { PrescriptionModalProps } from '../interfaces/PrescriptionInterfaces';

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({ title, show, handleSubmit, onHide, initialData }) => {

    const formId = 'createReceta'
    const prescriptionFormRef = useRef<any>(null);

    return (
        <CustomModal
            show={show}
            onHide={onHide}
            title={title}
            footerTemplate={<>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                        if (prescriptionFormRef.current) {
                            const data = prescriptionFormRef.current.getFormData();
                            handleSubmit(data)
                        }
                    }}
                >
                    Guardar
                </button>
            </>}
        >
            <PrescriptionForm
                ref={prescriptionFormRef}
                formId={formId}
                handleSubmit={handleSubmit}
                initialData={initialData}
            ></PrescriptionForm>
        </CustomModal>
    );
};

export default PrescriptionModal;
