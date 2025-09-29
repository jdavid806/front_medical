import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { WhatsAppStatus } from '../types/consultorio';
import WhatsAppConnection from './WhatsAppConnection';
import SmtpConfigForm from '../form/SmtpConfigForm';

interface CommunicationsTabProps {
    whatsAppStatus: WhatsAppStatus;
    onStatusChange: (status: WhatsAppStatus) => void;
}

const CommunicationsTab: React.FC<CommunicationsTabProps> = ({
    whatsAppStatus,
    onStatusChange
}) => {
    return (
        <div className="grid">
            <div className="col-12 md:col-6">
                <Card title="Estado WhatsApp">
                    <WhatsAppConnection
                        status={whatsAppStatus}
                        onStatusChange={onStatusChange}
                    />
                </Card>
            </div>

            <div className="col-12 md:col-6">
                <Card title="Configuración de Correo SMTP">
                    <SmtpConfigForm />
                </Card>
            </div>
        </div>
    );
};

export default CommunicationsTab;