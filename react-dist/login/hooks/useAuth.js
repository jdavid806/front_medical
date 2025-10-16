import { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { userService } from "../../../services/api/index.js";
import { useConfigurationProgress } from "../../config/general-configuration/hooks/useConfigurationProgress.js";
import { decryptAES, encryptAES, getJWTPayloadByToken } from "../../../services/utilidades.js";
export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [loginData, setLoginData] = useState(null);
  const toast = useRef(null);
  const showToast = (severity, summary, detail) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000
    });
  };
  const {
    loadProgress,
    currentConfig
  } = useConfigurationProgress();
  useEffect(() => {
    loadProgress();
  }, []);
  const redirectToDashboard = () => {
    console.log('currentConfig', currentConfig);
    if (currentConfig?.config_tenants?.finished_configuration) {
      window.location.href = "/Dashboard";
    } else {
      window.location.href = "/configuracionesGenerales";
    }
  };
  const saveUserData = userInfo => {
    try {
      localStorage.setItem('userData', JSON.stringify(userInfo));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
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
      console.log(data, "dataaaa");
      if (data.status === 200 && data.message === "Authenticated") {
        const token = data.data.token?.original?.access_token;
        const jwtPayload = getJWTPayloadByToken(token);
        const user = await userService.getByExternalId(jwtPayload.sub);
        sessionStorage.setItem('email', user.email);
        if (token) {
          const userDataToSave = {
            email: user.email,
            username: credentials.username,
            token: token,
            requiresOtp: data.data.otp
          };
          saveUserData(userDataToSave);
          const tempLoginData = {
            credentials: credentials,
            initialResponse: data,
            tempToken: token
          };
          setLoginData(tempLoginData);
          const username = await encryptAES(credentials.username, 'medicalsoft');
          localStorage.setItem('username', username);
          if (data.data.otp === true) {
            setOtpStep(true);
            showToast('success', 'Éxito', 'Credenciales válidas. Por favor ingresa el OTP.');
            return {
              success: true,
              requiresOtp: true
            };
          } else {
            sessionStorage.setItem('auth_token', token);
            Swal.fire({
              title: 'Inicio de sesión exitoso',
              text: 'Has iniciado sesión correctamente.',
              icon: 'success',
              confirmButtonText: 'Continuar'
            }).then(() => {
              redirectToDashboard();
            });
            return {
              success: true,
              requiresOtp: false
            };
          }
        } else {
          throw new Error('No se recibió un token válido');
        }
      } else {
        throw new Error('Credenciales incorrectas');
      }
    } catch (error) {
      Swal.fire('Error', error.message || 'Ocurrió un error en la solicitud', 'error');
      localStorage.removeItem('username');
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };
  const verifyOtp = async (otpCode, email) => {
    setLoading(true);
    try {
      // Convertir OTP a número
      const otpNumber = parseInt(otpCode, 10);
      if (isNaN(otpNumber)) {
        throw new Error('El código OTP debe ser un número válido');
      }
      const emailOtp = sessionStorage.getItem('email');
      const apiUrl = `${window.location.origin}/api/auth/validate-otp-login`;
      console.log('Enviando OTP validation:', {
        email: emailOtp,
        otp: otpNumber
      });
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Domain': window.location.hostname
        },
        body: JSON.stringify({
          email: emailOtp,
          otp: otpNumber
        })
      });
      const data = await response.json();
      console.log('Respuesta del servidor OTP:', data);
      if (response.status === 200) {
        // Usar el token que ya tenemos guardado temporalmente
        if (loginData?.tempToken) {
          sessionStorage.setItem('auth_token', loginData.tempToken);
          const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}');
          const updatedUserData = {
            ...currentUserData,
            otpVerified: true,
            otpVerifiedAt: new Date().toISOString()
          };
          saveUserData(updatedUserData);

          // Mostrar mensaje de éxito y redirigir
          await Swal.fire({
            title: 'Verificación exitosa',
            text: 'Has iniciado sesión correctamente.',
            icon: 'success',
            confirmButtonText: 'Continuar al Dashboard',
            timer: 2000,
            showConfirmButton: true
          });
          setOtpStep(false);
          setLoginData(null);
          redirectToDashboard();
          return {
            success: true
          };
        } else {
          throw new Error('Error en la sesión de login');
        }
      } else {
        // Solo lanzar error si el status NO es 200
        throw new Error(data.message || 'Error en la verificación OTP');
      }
    } catch (error) {
      console.error('Error en verifyOtp:', error);
      Swal.fire('Error', error.message || 'Error en la verificación OTP', 'error');
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };
  const verifyOtpBasic = async (otpCode, email, phone) => {
    setLoading(true);
    try {
      // Convertir OTP a número
      const otpNumber = parseInt(otpCode, 10);
      if (isNaN(otpNumber)) {
        throw new Error('El código OTP debe ser un número válido');
      }
      const emailOtp = email;
      const apiUrl = `${window.location.origin}/api/auth/otp/validate-otp`;
      console.log('Enviando OTP validation:', {
        email: emailOtp,
        otp: otpNumber
      });
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Domain': window.location.hostname
        },
        body: JSON.stringify({
          email: emailOtp,
          otp: otpNumber,
          phone: phone
        })
      });
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error(data.message || 'Error en la verificación OTP');
      }
      return data;
    } catch (error) {
      console.error('Error en verifyOtp:', error);
      showToast('error', 'Error', error.message || 'Error en la verificación OTP');
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };
  const sendOtp = async () => {
    const username = localStorage.getItem('username');
    if (!username) return;
    const decodedUsername = await decryptAES(username, 'medicalsoft');
    console.log(decodedUsername);
    setLoading(true);
    try {
      const apiUrl = `${window.location.origin}/api/auth/otp/send-otp`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Domain': window.location.hostname
        },
        body: JSON.stringify({
          nombre_usuario: decodedUsername
        })
      });
      const data = await response.json();
      if (data.status === 200) {
        showToast('success', 'Éxito', 'Código OTP enviado');
        return {
          success: true
        };
      } else {
        throw new Error(data.message || 'Error al enviar OTP');
      }
    } catch (error) {
      showToast('error', 'Error', error.message || 'Error al enviar OTP');
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };
  const resendOtp = async (email = sessionStorage.getItem('email') || '') => {
    setLoading(true);
    try {
      const apiUrl = `${window.location.origin}/api/auth/otp/resend-otp`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Domain': window.location.hostname
        },
        body: JSON.stringify({
          email: email
        })
      });
      const data = await response.json();
      if (data.status === 200) {
        showToast('success', 'Éxito', 'Nuevo código OTP enviado');
        return {
          success: true
        };
      } else {
        throw new Error(data.message || 'Error al reenviar OTP');
      }
    } catch (error) {
      showToast('error', 'Error', error.message || 'Error al reenviar OTP');
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };
  const resetOtpFlow = () => {
    setOtpStep(false);
    setLoginData(null);
    // Limpiar userData si se cancela el OTP
    localStorage.removeItem('userData');
  };
  return {
    login,
    verifyOtp,
    verifyOtpBasic,
    sendOtp,
    resendOtp,
    resetOtpFlow,
    loading,
    otpStep,
    loginData,
    Toast: toast
  };
};