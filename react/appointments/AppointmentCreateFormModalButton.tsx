import React from 'react';
import { AppointmentFormModal } from './AppointmentFormModal';
import { Button } from 'primereact/button';

export const AppointmentCreateFormModalButton = () => {
    const [visible, setVisible] = React.useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <div>
            <Button className="p-button-primary" type="button" onClick={showModal}>
                <i className="fa-solid fa-plus me-2"></i> Nueva Cita
            </Button>
            <AppointmentFormModal isOpen={visible} onClose={handleCancel} />
        </div>
    );
};
