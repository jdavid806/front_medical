import React from 'react';
import UserForm, { UserFormConfig, UserFormInputs } from './UserForm';
import { CustomFormModal } from '../components/CustomFormModal';
import { Dialog } from 'primereact/dialog';

interface UserFormModalProps {
    title: string;
    show: boolean;
    handleSubmit: (data: UserFormInputs) => void;
    initialData?: UserFormInputs;
    config?: UserFormConfig;
    onHide?: () => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ title, show, handleSubmit, onHide, initialData, config }) => {

    const formId = 'createDoctor'

    const footer = (
        <>
            <button
                className="btn btn-link text-danger px-3 my-0"
                aria-label="Close"
                onClick={onHide}>
                <i className="fas fa-arrow-left"></i> Cerrar
            </button>
            <button
                type='submit'
                form={formId}
                className="btn btn-primary my-0"
            >
                <i className="fas fa-bookmark"></i> Guardar
            </button>
        </>
    )
    return (
        <Dialog
            visible={show}
            onHide={() => { onHide?.() }}
            header={title}
            footer={footer}
            style={{ width: "80vw", height: "100%", maxHeight: "90%" }}
        >
            <UserForm
                formId={formId}
                onHandleSubmit={handleSubmit}
                initialData={initialData}
                config={config}
            ></UserForm>
        </Dialog>
    );
};

export default UserFormModal;
