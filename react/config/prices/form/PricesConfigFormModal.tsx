import React from 'react';
import { CustomModal } from '../../../components/CustomModal';
import PricesConfigForm, { ProductFormInputs } from '../form/PricesConfigForm';

interface UserFormModalProps {
    show: boolean;
    entitiesData: any[];
    handleSubmit: (data: ProductFormInputs) => void
    initialData?: ProductFormInputs;
    onHide?: () => void;
}



const PricesConfigFormModal: React.FC<UserFormModalProps> = ({ show, handleSubmit, initialData, onHide, entitiesData }) => {

    const formId = 'createUserAvailability'

    return (
        <CustomModal
            show={show}
            onHide={onHide}
            title={initialData ? 'Editar Precio' : 'Nuevo Precio'}>
            <PricesConfigForm
                formId={formId}
                onHandleSubmit={handleSubmit}
                initialData={initialData}
                onCancel={onHide}
                entitiesData={entitiesData}
            ></PricesConfigForm>
        </CustomModal>
    );
};

export default PricesConfigFormModal;
