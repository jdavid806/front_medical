import { useState, useRef } from 'react';
import { authService } from "../../../services/api/index.js";
export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const showToast = (severity, summary, detail) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000
    });
  };
  const login = async credentials => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response.status === 200) {
        const token = response.data?.token?.original?.access_token || response.data?.access_token || response.data?.token;
        if (token) {
          sessionStorage.setItem('auth_token', token);
          showToast('success', 'Éxito', 'Inicio de sesión exitoso');
          setTimeout(() => {
            window.location.href = '/Dashboard';
          }, 1000);
          return {
            success: true
          };
        } else {
          throw new Error('No se recibió un token válido');
        }
      } else {
        throw new Error('Credenciales incorrectas');
      }
    } catch (error) {
      showToast('error', 'Error', error.message || 'Error en el inicio de sesión');
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };
  return {
    login,
    loading,
    Toast: toast
  };
};