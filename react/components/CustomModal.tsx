import React from 'react';
import { Modal } from 'react-bootstrap';

interface Props {
    children: React.ReactNode;
    footerTemplate?: React.ReactNode;
    title: string;
    show: boolean;
    scrollable?: boolean;
    onHide?: () => void;
}

export const CustomModal: React.FC<Props> = ({ children, title, show, onHide, footerTemplate, scrollable = false }) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className={`${scrollable ? 'modal-dialog-scrollable' : ''}`}
            scrollable={scrollable}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            {footerTemplate &&
                <Modal.Footer>
                    {footerTemplate}
                </Modal.Footer>
            }
        </Modal>
    );
};
