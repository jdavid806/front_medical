// hooks/useWhatsApp.ts
import { useState, useEffect, useCallback } from 'react';
import { WhatsAppStatus } from '../types/consultorio';

export const useWhatsApp = (userId: number) => {
    const [status, setStatus] = useState<WhatsAppStatus>({ connected: false });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const consultarQR = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/whatsapp/status/${userId}`);
            const data = await response.json();
            setStatus(data);
        } catch (err) {
            setError('Error al consultar estado de WhatsApp');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const toggleConnection = async () => {
        try {
            setLoading(true);
            const action = status.connected ? 'disconnect' : 'connect';
            const response = await fetch(`/api/whatsapp/${action}`, {
                method: 'POST',
                body: JSON.stringify({ userId })
            });
            const data = await response.json();
            setStatus(data);
        } catch (err) {
            setError('Error al cambiar estado de conexión');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        consultarQR();

        const interval = setInterval(consultarQR, 2000);
        return () => clearInterval(interval);
    }, [consultarQR]);

    return {
        status,
        loading,
        error,
        toggleConnection,
        refreshStatus: consultarQR
    };
};