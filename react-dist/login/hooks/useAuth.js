import { useState, useRef } from 'react';
import Swal from 'sweetalert2';
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
      const apiUrl = `${window.location.origin}/api/auth/login`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Domain': window.location.hostname
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        })
      });
      const data = await response.json();
      if (data.status === 200 && data.message === "Authenticated") {
        const token = data.data.token?.original?.access_token || null;
        if (token) {
          sessionStorage.setItem('auth_token', token);
          Swal.fire({
            title: 'Inicio de sesión exitoso',
            text: 'Has iniciado sesión correctamente.',
            icon: 'success',
            confirmButtonText: 'Continuar'
          }).then(() => {
            window.location.href = "/Dashboard";
          });
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
      Swal.fire('Error', error.message || 'Ocurrió un error en la solicitud', 'error');
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