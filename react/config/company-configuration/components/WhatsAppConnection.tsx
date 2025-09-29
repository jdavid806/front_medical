import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { WhatsAppStatus } from '../types/consultorio';

interface WhatsAppConnectionProps {
    status: WhatsAppStatus;
    onStatusChange: (status: WhatsAppStatus) => void;
}

const WhatsAppConnection: React.FC<WhatsAppConnectionProps> = ({ status, onStatusChange }) => {
    const [showQRModal, setShowQRModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        try {
            const newStatus = await checkWhatsAppStatus();
            onStatusChange(newStatus);
        } catch (error) {
            console.error('Error checking WhatsApp status:', error);
        }
    };

    const handleConnect = async () => {
        setLoading(true);
        try {
            const qrData = await generateQRCode();
            onStatusChange({ ...status, qrCode: qrData });
            setShowQRModal(true);
        } catch (error) {
            console.error('Error generating QR:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = async () => {
        setLoading(true);
        try {
            await disconnectWhatsApp();
            onStatusChange({ connected: false });
        } catch (error) {
            console.error('Error disconnecting WhatsApp:', error);
        } finally {
            setLoading(false);
        }
    };

    const qrModalFooter = (
        <div>
            <Button label="Cerrar" icon="pi pi-times" onClick={() => setShowQRModal(false)} />
        </div>
    );

    return (
        <div className="flex flex-column align-items-center text-center">
            {status.connected ? (
                <>
                    <i className="fas fa-check-circle text-success" style={{ fontSize: '100px' }}></i>
                    <p className="mt-3">WhatsApp conectado correctamente</p>
                    <Button
                        label="Quitar conexión"
                        icon="pi pi-times-circle"
                        severity="danger"
                        loading={loading}
                        onClick={handleDisconnect}
                    />
                </>
            ) : (
                <>
                    <i className="fas fa-circle-xmark text-danger" style={{ fontSize: '100px' }}></i>
                    <p className="mt-3">WhatsApp no conectado</p>
                    <Button
                        label="Conectar WhatsApp"
                        icon="pi pi-whatsapp"
                        severity="warning"
                        loading={loading}
                        onClick={handleConnect}
                    />
                </>
            )}

            <Dialog
                header="Vincular WhatsApp"
                visible={showQRModal}
                footer={qrModalFooter}
                onHide={() => setShowQRModal(false)}
                style={{ width: '400px' }}
            >
                <div className="text-center">
                    <p>Escanea este código QR para vincular tu cuenta de WhatsApp.</p>
                    {status.qrCode && (
                        <img
                            src={status.qrCode}
                            alt="Código QR WhatsApp"
                            className="mt-3 img-fluid"
                            style={{ maxWidth: '200px' }}
                        />
                    )}
                </div>
            </Dialog>
        </div>
    );
};

export default WhatsAppConnection;