import React from 'react';
import { CustomModal } from './CustomModal';

interface Props {
    children: React.ReactNode;
    formId: string;
    title: string;
    show: boolean;
    scrollable?: boolean;
    onSave?: () => void;
    onHide?: () => void;
}

export const CustomFormModal: React.FC<Props> = ({ children, formId, title, show, scrollable, onSave, onHide }) => {

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
                onClick={onSave}>
                <i className="fas fa-bookmark"></i> Guardar
            </button>
        </>
    )

    return (
        <CustomModal
            show={show}
            onHide={onHide}
            title={title}
            footerTemplate={footer}
            scrollable={scrollable}
        >
            {children}
        </CustomModal>
    );
};
