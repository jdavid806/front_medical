import React from 'react';
import PricesConfigForm, { ProductFormInputs } from '../form/PricesConfigForm';
import { Dialog } from 'primereact/dialog';

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
        <Dialog
            visible={show}
            onHide={() => onHide?.()}
            header={initialData ? 'Editar Precio' : 'Nuevo Precio'}
            appendTo={document.body}
            style={{ width: '75vw' }}
        >
            <PricesConfigForm
                formId={formId}
                onHandleSubmit={handleSubmit}
                initialData={initialData}
                onCancel={onHide}
                entitiesData={entitiesData}
            ></PricesConfigForm>
        </Dialog>
    );
};

export default PricesConfigFormModal;
