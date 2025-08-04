import React from 'react';
import { CustomModal } from '../../../components/CustomModal';
import PricesConfigForm, { ProductFormInputs } from '../form/PricesConfigForm';

interface UserFormModalProps {
    show: boolean;
    handleSubmit: (data: ProductFormInputs) => void
    initialData?: ProductFormInputs;
    onHide?: () => void;
}



const PricesConfigFormModal: React.FC<UserFormModalProps> = ({ show, handleSubmit, initialData, onHide }) => {

    const formId = 'createUserAvailability'

    return (
        <CustomModal
            show={show}
            onHide={onHide}
            title='Configurar Precios'>
            <PricesConfigForm
                formId={formId}
                onHandleSubmit={handleSubmit}
                initialData={initialData}
            ></PricesConfigForm>
        </CustomModal>
    );
};

export default PricesConfigFormModal;
