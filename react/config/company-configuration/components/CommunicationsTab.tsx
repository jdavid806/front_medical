import React, { useEffect } from 'react';
import { Card } from 'primereact/card';
import WhatsAppConnection from './WhatsAppConnection';
import { WhatsAppStatus } from '../types/consultorio';

interface CommunicationsTabProps {
    whatsAppStatus: WhatsAppStatus;
    onStatusChange: (status: WhatsAppStatus) => void;
    onValidationChange?: (isValid: boolean) => void;
}

const CommunicationsTab: React.FC<CommunicationsTabProps> = ({
    whatsAppStatus,
    onStatusChange,
    onValidationChange
}) => {

    useEffect(() => {
        const isValid = whatsAppStatus.connected === true;
        onValidationChange?.(isValid);
    }, [whatsAppStatus, onValidationChange]);

    const handleStatusChange = (status: WhatsAppStatus) => {
        onStatusChange(status);
    };

    return (
        <Card className="shadow-sm">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <h5 className="fw-bold mb-4">Configuración de Comunicaciones</h5>
                        <p className="text-muted mb-4">
                            Configura la conexión de WhatsApp para enviar notificaciones a tus pacientes.
                        </p>

                        <WhatsAppConnection
                            onStatusChange={handleStatusChange}
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default CommunicationsTab;