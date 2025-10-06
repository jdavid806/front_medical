import { useState, useEffect, useCallback } from 'react';
import { WhatsAppStatus } from '../types/consultorio';
import { SwalManager } from '../../../../services/alertManagerImported';
import { whatsAppService } from '../../../../services/api/classes/whatsappService';

export type WhatsAppConnectionStatus = 'CONECTADA' | 'NO-CONECTADA' | 'NO-CREADA';

export const useWhatsApp = () => {
    const [status, setStatus] = useState<WhatsAppStatus>({
        connected: false,
        qrCode: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [communicationData, setCommunicationData] = useState<any>(null);

    const loadCommunicationData = useCallback(async () => {
        try {
            const response = await whatsAppService.getCommunicationData();
            if (response.status === 200 && response.data && response.data.length > 0) {
                const companyData = response.data[0];
                if (companyData.includes && companyData.includes.communication) {
                    const commData = companyData.includes.communication;
                    setCommunicationData(commData);
                    return commData;
                }
            }
            return null;
        } catch (err) {
            console.error('Error loading communication data:', err);
            setError('Error al cargar datos de comunicación');
            return null;
        }
    }, []);

    const checkWhatsAppStatus = useCallback(async (): Promise<WhatsAppConnectionStatus> => {
        try {
            const commData = await loadCommunicationData();

            if (!commData?.api_key) {
                return 'NO-CREADA';
            }

            if (!commData?.instance) {
                return 'NO-CONECTADA';
            }

            const result = await whatsAppService.checkConnectionStatus(
                commData.instance,
                commData.api_key
            );

            if (result.instance && result.instance.state === "open") {
                setStatus({ connected: true, qrCode: null });
                return 'CONECTADA';
            } else {
                setStatus({ connected: false, qrCode: null });
                return 'NO-CONECTADA';
            }
        } catch (error) {
            console.error('Error checking WhatsApp status:', error);
            setStatus({ connected: false, qrCode: null });
            return 'NO-CONECTADA';
        }
    }, [loadCommunicationData]);

    const generateQRCode = useCallback(async (): Promise<string | null> => {
        try {
            const commData = await loadCommunicationData();
            if (!commData?.api_key || !commData?.instance) {
                throw new Error('No hay configuración de WhatsApp disponible');
            }

            const qrCode = await whatsAppService.generateQRCode(
                commData.instance,
                commData.api_key
            );
            console.log("QR", qrCode);

            setStatus(prev => ({ ...prev, qrCode }));
            return qrCode;
        } catch (error) {
            console.error('Error generating QR code:', error);
            setError('Error al generar código QR');
            return null;
        }
    }, [loadCommunicationData]);

    const disconnectWhatsApp = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            const commData = await loadCommunicationData();
            if (!commData?.api_key || !commData?.instance) {
                throw new Error('No hay configuración de WhatsApp disponible');
            }

            await whatsAppService.disconnectWhatsApp(
                commData.instance,
                commData.api_key
            );

            setStatus({ connected: false, qrCode: null });
            SwalManager.success('WhatsApp desconectado correctamente');
        } catch (error) {
            console.error('Error disconnecting WhatsApp:', error);
            SwalManager.error('Error al desconectar WhatsApp');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [loadCommunicationData]);

    const connectWhatsApp = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            await generateQRCode();
        } catch (error) {
            console.error('Error connecting WhatsApp:', error);
            setError('Error al conectar WhatsApp');
        } finally {
            setLoading(false);
        }
    }, [generateQRCode]);

    // Verificar estado automáticamente
    useEffect(() => {
        const checkStatus = async () => {
            await checkWhatsAppStatus();
        };

        checkStatus();

        // Verificar estado cada 5 segundos
        const interval = setInterval(checkStatus, 5000);

        return () => {
            clearInterval(interval);
        };
    }, [checkWhatsAppStatus]);

    return {
        status,
        loading,
        error,
        checkWhatsAppStatus,
        generateQRCode,
        disconnectWhatsApp,
        connectWhatsApp,
        communicationData
    };
};