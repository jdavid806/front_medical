import React from 'react';
import { AppointmentFormModal } from './AppointmentFormModal';

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
            <button className="btn btn-primary" type="button" onClick={showModal}>
                <i className="fa-solid fa-plus me-2"></i> Nueva Cita
            </button>
            <AppointmentFormModal isOpen={visible} onClose={handleCancel} />
        </div>
    );
};
