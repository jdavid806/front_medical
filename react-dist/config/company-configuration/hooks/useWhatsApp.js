import { useState, useEffect, useCallback, useRef } from 'react';
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { whatsAppService } from "../../../../services/api/classes/whatsappService.js";
export const useWhatsApp = () => {
  const [status, setStatus] = useState('NO-CREADA');
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [communicationData, setCommunicationData] = useState(null);
  const isMounted = useRef(true);
  const intervalRef = useRef(null);

  // Cleanup para evitar updates en componentes desmontados
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  const loadCommunicationData = useCallback(async () => {
    if (!isMounted.current) return null;
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
      if (isMounted.current) {
        setError('Error al cargar datos de comunicación');
      }
      return null;
    }
  }, []);
  const checkWhatsAppStatus = useCallback(async () => {
    if (!isMounted.current) return;
    try {
      setLoading(true);
      const commData = await loadCommunicationData();
      if (!commData?.api_key || !commData?.instance) {
        setStatus("NO-CREADA");
        return;
      }
      const result = await whatsAppService.checkConnectionStatus(commData.instance, commData.api_key);
      console.log("result", result);
      if (result.instance && result.instance.state === "open") {
        setStatus("CONECTADA");
        setQrCode(''); // Limpiar QR cuando está conectado
      } else {
        setStatus("NO-CONECTADA");
      }
    } catch (error) {
      console.error('Error checking WhatsApp status:', error);
      if (isMounted.current) {
        setStatus("NO-CREADA");
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [loadCommunicationData]);
  const generateQRCode = useCallback(async () => {
    if (!isMounted.current) return null;
    try {
      setLoading(true);
      const commData = await loadCommunicationData();
      if (!commData?.api_key || !commData?.instance) {
        throw new Error('No hay configuración de WhatsApp disponible');
      }
      const qrCode = await whatsAppService.generateQRCode(commData.instance, commData.api_key);
      setQrCode(qrCode);
      return qrCode;
    } catch (error) {
      console.error('Error generating QR code:', error);
      if (isMounted.current) {
        setError('Error al generar código QR');
      }
      return null;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [loadCommunicationData]);
  const disconnectWhatsApp = useCallback(async () => {
    if (!isMounted.current) return;
    try {
      setLoading(true);
      const commData = await loadCommunicationData();
      if (!commData?.api_key || !commData?.instance) {
        throw new Error('No hay configuración de WhatsApp disponible');
      }
      await whatsAppService.disconnectWhatsApp(commData.instance, commData.api_key);
      setStatus("NO-CONECTADA");
      setQrCode('');
      SwalManager.success('WhatsApp desconectado correctamente');
    } catch (error) {
      console.error('Error disconnecting WhatsApp:', error);
      SwalManager.error('Error al desconectar WhatsApp');
      throw error;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [loadCommunicationData]);
  const connectWhatsApp = useCallback(async () => {
    if (!isMounted.current) return;
    await generateQRCode();
  }, [generateQRCode]);

  // Efecto para el polling de estado - MUY IMPORTANTE
  useEffect(() => {
    let isSubscribed = true;
    const startPolling = async () => {
      // Verificación inicial
      if (isSubscribed) {
        await checkWhatsAppStatus();
      }

      // Configurar intervalo solo si está suscrito
      if (isSubscribed) {
        intervalRef.current = setInterval(async () => {
          if (isSubscribed && status !== 'CONECTADA') {
            await checkWhatsAppStatus();
          }
        }, 10000); // 10 segundos
      }
    };
    startPolling();
    return () => {
      isSubscribed = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [checkWhatsAppStatus, status]);
  return {
    status,
    loading,
    error,
    checkWhatsAppStatus,
    generateQRCode,
    disconnectWhatsApp,
    connectWhatsApp,
    communicationData,
    qrCode
  };
};