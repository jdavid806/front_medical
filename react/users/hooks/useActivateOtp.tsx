import { useState } from 'react';

interface ActivateOtpData {
    email: string;
    otp_enabled: boolean;
}

export const useActivateOtp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const activateOtp = async (data: ActivateOtpData): Promise<boolean> => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('/api/auth/activate-otp-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Error al activar/desactivar OTP');
            }

            const result = await response.json();
            setSuccess(true);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        activateOtp,
        loading,
        error,
        success,
    };
};