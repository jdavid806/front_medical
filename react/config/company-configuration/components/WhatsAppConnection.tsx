import React, { useState, useCallback, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useWhatsApp } from '../hooks/useWhatsApp';
import { SwalManager } from '../../../../services/alertManagerImported';
import { BtnCreateWhatsAppInstance } from '../../../communications/BtnCreateWhatsAppInstance';
import SmtpConfigForm from '../form/SmtpConfigForm';
import { WhatsAppStatus } from '../types/consultorio';

interface WhatsAppConnectionProps {
    onStatusChange?: (status: WhatsAppStatus) => void;
}

const WhatsAppConnection: React.FC<WhatsAppConnectionProps> = ({ onStatusChange }) => {
    const [showQRModal, setShowQRModal] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);

    const {
        status,
        qrCode,
        loading,
        error,
        connectWhatsApp,
        disconnectWhatsApp,
        checkWhatsAppStatus
    } = useWhatsApp();

    // Notificar cambios de estado al componente padre
    useEffect(() => {
        onStatusChange?.({ connected: status === 'CONECTADA', qrCode });
    }, [status, qrCode, onStatusChange]);

    // Efecto para sincronizar loading states
    useEffect(() => {
        setLocalLoading(loading);
    }, [loading]);

    const handleConnect = useCallback(async () => {
        setLocalLoading(true);
        try {
            await connectWhatsApp();
            setShowQRModal(true);
        } catch (error) {
            console.error('Error connecting:', error);
        } finally {
            setLocalLoading(false);
        }
    }, [connectWhatsApp]);

    const handleDisconnect = useCallback(async () => {
        await SwalManager.confirmDelete(async () => {
            setLocalLoading(true);
            try {
                await disconnectWhatsApp();
                checkWhatsAppStatus();
            } catch (error) {
                console.error('Error disconnecting:', error);
            } finally {
                setLocalLoading(false);
            }
        });
    }, [disconnectWhatsApp, checkWhatsAppStatus]);

    const handleCloseQRModal = () => {
        setShowQRModal(false);
    };

    useEffect(() => {
        if (showQRModal && status === 'CONECTADA') {
            handleCloseQRModal();
        }
    }, [status, showQRModal]);

    // Renderizado condicional simplificado
    const renderContent = () => {
        if (status === 'CONECTADA') {
            return (
                <>
                    <i className="fas fa-check-circle text-success" style={{ fontSize: '100px' }}></i>
                    <p className="mt-3">WhatsApp conectado correctamente</p>
                    <Button
                        label="Quitar conexión"
                        icon="pi pi-times-circle"
                        severity="danger"
                        loading={localLoading}
                        onClick={handleDisconnect}
                        disabled={localLoading}
                    />
                </>
            );
        }

        if (status === 'NO-CONECTADA') {
            return (
                <>
                    <i className="fas fa-circle-xmark text-danger" style={{ fontSize: '100px' }}></i>
                    <p className="mt-3">WhatsApp no conectado</p>
                    <Button
                        label="Conectar WhatsApp"
                        icon="pi pi-whatsapp"
                        severity="warning"
                        loading={localLoading}
                        onClick={handleConnect}
                        disabled={localLoading}
                    />
                </>
            );
        }

        // Estado por defecto: NO-CREADA
        return (
            <>
                <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '100px' }}></i>
                <p className="mt-3">Instancia de WhatsApp no creada</p>
                <BtnCreateWhatsAppInstance onSave={() => handleCloseQRModal()} />
            </>
        );
    };

    const qrModalFooter = (
        <div>
            <Button
                label="Cerrar"
                icon="pi pi-times"
                onClick={handleCloseQRModal}
                className="p-button-secondary"
                disabled={localLoading}
            />
        </div>
    );

    return (
        <div className="flex flex-column align-items-center text-center p-3">
            {renderContent()}
            <SmtpConfigForm />

            <Dialog
                header="Vincular WhatsApp"
                visible={showQRModal}
                footer={qrModalFooter}
                onHide={handleCloseQRModal}
                style={{ width: '400px' }}
                modal
                className="p-fluid"
                closable={!localLoading}
            >
                <div className="text-center">
                    <p>Escanea este código QR para vincular tu cuenta de WhatsApp.</p>
                    {qrCode ? (
                        <img
                            src={qrCode}
                            alt="Código QR WhatsApp"
                            className="mt-3"
                            style={{
                                width: '200px',
                                height: '200px',
                                objectFit: 'contain'
                            }}
                        />
                    ) : (
                        <div className="p-4">
                            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                            <p className="mt-2">Generando código QR...</p>
                        </div>
                    )}
                </div>
            </Dialog>

            {error && (
                <div className="alert alert-danger mt-3 w-100">
                    {error}
                </div>
            )}
        </div>
    );
};

export default WhatsAppConnection;