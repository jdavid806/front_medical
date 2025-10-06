import React, { useState, useRef, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Steps } from 'primereact/steps';
import { authService } from "../../../services/api/index.js";
import { DatosUsuarioModal } from "./DatosUsuarioModal.js";
import { NewPasswordModal } from "./NewPasswordModal.js";
export const ForgotPasswordModal = ({
  visible,
  onHide,
  onSuccess
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [passwords, setPasswords] = useState({
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [userData, setUserData] = useState(null);
  const toast = useRef(null);
  const showToast = (severity, summary, detail) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000
    });
  };
  const steps = [{
    label: 'Verificación de Usuario'
  }, {
    label: 'Nueva Contraseña'
  }];

  // Función para obtener los datos REALES del usuario del localStorage
  const getRealUserDataFromLocalStorage = () => {
    try {
      // Buscar en el localStorage por la clave correcta donde se almacenan los datos del usuario
      const userDataStr = localStorage.getItem('userData') || localStorage.getItem('user') || localStorage.getItem('currentUser') || localStorage.getItem('usuario');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        console.log('Datos del usuario encontrados en localStorage:', userData);

        // Extraer email y phone del objeto de usuario
        return {
          email: userData.email || userData.correo || '',
          phone: userData.phone || userData.telefono || userData.celular || ''
        };
      }

      // Si no se encuentra en las claves comunes, buscar en todo el localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('user') || key.includes('usuario')) {
          try {
            const value = localStorage.getItem(key);
            if (value) {
              const parsedValue = JSON.parse(value);
              if (parsedValue && (parsedValue.email || parsedValue.phone)) {
                console.log('Datos del usuario encontrados en clave:', key, parsedValue);
                return {
                  email: parsedValue.email || parsedValue.correo || '',
                  phone: parsedValue.phone || parsedValue.telefono || parsedValue.celular || ''
                };
              }
            }
          } catch (e) {
            // Ignorar errores de parseo
          }
        }
      }
      return null;
    } catch (error) {
      console.error('Error al obtener datos del usuario del localStorage:', error);
      return null;
    }
  };

  // Función para buscar usuario por username en localStorage
  const findUserByUsername = username => {
    try {
      // Buscar en todas las entradas del localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          try {
            const value = localStorage.getItem(key);
            if (value) {
              const parsedValue = JSON.parse(value);
              // Verificar si este objeto tiene el username que buscamos
              if (parsedValue && (parsedValue.username === username || parsedValue.nombre_usuario === username || parsedValue.email === username)) {
                console.log('Usuario encontrado en localStorage:', parsedValue);
                return {
                  email: parsedValue.email || parsedValue.correo || '',
                  phone: parsedValue.phone || parsedValue.telefono || parsedValue.celular || ''
                };
              }
            }
          } catch (e) {
            // Ignorar errores de parseo
          }
        }
      }
      return null;
    } catch (error) {
      console.error('Error buscando usuario por username:', error);
      return null;
    }
  };
  const handleSendOTP = async () => {
    if (!username.trim()) {
      showToast('error', 'Error', 'Por favor ingrese su nombre de usuario');
      return;
    }
    setLoading(true);
    try {
      const data = {
        nombre_usuario: username
      };
      const response = await authService.sendOTP(data);
      if (response.status === 200 || response.data?.success) {
        localStorage.setItem('username', username);

        // Obtener los datos REALES del usuario
        let userDataFound = findUserByUsername(username);
        if (!userDataFound) {
          // Si no se encuentra por username, buscar datos generales del usuario
          userDataFound = getRealUserDataFromLocalStorage();
        }
        if (userDataFound && userDataFound.email && userDataFound.phone) {
          setUserData(userDataFound);
          console.log('Datos del usuario que se usarán:', userDataFound);
          showToast('success', 'Éxito', `Código OTP enviado correctamente`);
        } else {
          // SOLO como último recurso usar datos por defecto
          // Pero es mejor mostrar un error
          showToast('error', 'Error', 'No se pudieron obtener los datos del usuario. Contacte al administrador.');
          setLoading(false);
          return;
        }
        setOtpSent(true);
      } else {
        throw new Error(response.data?.message || 'Error al enviar OTP');
      }
    } catch (error) {
      showToast('error', 'Error', error.response?.data?.message || error.message || 'Error al enviar OTP');
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const otpCode = otp.join('').trim();
      if (!/^\d{6}$/.test(otpCode)) {
        showToast('error', 'Error', 'El código OTP debe tener 6 dígitos numéricos');
        return;
      }

      // Convertir OTP a número
      const otpNumber = parseInt(otpCode, 10);
      if (isNaN(otpNumber)) {
        showToast('error', 'Error', 'El código OTP debe ser numérico');
        return;
      }
      if (!userData || !userData.email || !userData.phone) {
        showToast('error', 'Error', 'No se encontraron datos completos del usuario');
        return;
      }

      // Crear payload con los datos REALES del usuario
      const payload = {
        email: userData.email,
        phone: userData.phone,
        otp: otpNumber
      };
      console.log('Enviando payload REAL:', payload); // Para debugging

      const response = await authService.validateOTP(payload);
      if (response.status === 200 || response.data?.success) {
        showToast('success', 'Éxito', 'OTP verificado correctamente');
        setActiveStep(1);
      } else {
        throw new Error(response.data?.message || 'OTP inválido');
      }
    } catch (error) {
      showToast('error', 'Error', error.response?.data?.message || error.message || 'Error al verificar OTP');
    } finally {
      setLoading(false);
    }
  };
  const handleChangePassword = async () => {
    if (passwords.password !== passwords.password_confirmation) {
      showToast('error', 'Error', 'Las contraseñas no coinciden');
      return;
    }
    const isLengthValid = passwords.password.length >= 8;
    const isUppercaseValid = /[A-Z]/.test(passwords.password);
    const isSpecialValid = /[!@#$%^&*(),.?":{}|<>]/.test(passwords.password);
    if (!isLengthValid || !isUppercaseValid || !isSpecialValid) {
      showToast('error', 'Error', 'La contraseña no cumple con los requisitos');
      return;
    }
    setLoading(true);
    try {
      const changePasswordData = {
        username: username,
        password: passwords.password,
        password_confirmation: passwords.password_confirmation
      };
      const apiUrl = `${window.location.origin}/api/auth/change-password`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(changePasswordData)
      });
      if (response.ok) {
        const data = await response.json();
        if (data.status === 200 || data.success) {
          showToast('success', 'Éxito', 'Contraseña cambiada correctamente');
          setTimeout(() => {
            onSuccess();
            onHide();
            resetForm();
          }, 1500);
        } else {
          throw new Error(data.message || 'Error al cambiar la contraseña');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      showToast('error', 'Error', error.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };
  const resetForm = () => {
    setActiveStep(0);
    setUsername('');
    setOtp(['', '', '', '', '', '']);
    setPasswords({
      password: '',
      password_confirmation: ''
    });
    setOtpSent(false);
    setUserData(null);
  };
  const isStep2Complete = () => {
    return passwords.password !== '' && passwords.password_confirmation !== '' && passwords.password === passwords.password_confirmation;
  };
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return /*#__PURE__*/React.createElement(DatosUsuarioModal, {
          username: username,
          setUsername: setUsername,
          otp: otp,
          setOtp: setOtp,
          otpSent: otpSent,
          onResendOTP: handleSendOTP,
          userData: userData
        });
      case 1:
        return /*#__PURE__*/React.createElement(NewPasswordModal, {
          passwords: passwords,
          setPasswords: setPasswords
        });
      default:
        return null;
    }
  };
  const getNextButtonLabel = () => {
    switch (activeStep) {
      case 0:
        return otpSent ? 'Verificar OTP' : 'Enviar OTP';
      case 1:
        return 'Cambiar Contraseña';
      default:
        return 'Siguiente';
    }
  };
  const handleNext = () => {
    switch (activeStep) {
      case 0:
        if (!otpSent) {
          handleSendOTP();
        } else {
          handleVerifyOTP();
        }
        break;
      case 1:
        handleChangePassword();
        break;
      default:
        break;
    }
  };
  const isNextDisabled = () => {
    switch (activeStep) {
      case 0:
        if (!otpSent) {
          return !username.trim() || loading;
        } else {
          const isOtpComplete = otp.join('').length === 6;
          return !isOtpComplete || loading;
        }
      case 1:
        return !isStep2Complete() || loading;
      default:
        return true;
    }
  };

  // Efecto para debug: mostrar qué hay en el localStorage
  useEffect(() => {
    if (visible) {
      console.log('Contenido completo del localStorage:');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          console.log(`Clave: ${key}, Valor:`, localStorage.getItem(key));
        }
      }

      // Intentar cargar datos del usuario del localStorage al abrir el modal
      const storedUserData = getRealUserDataFromLocalStorage();
      if (storedUserData) {
        setUserData(storedUserData);
        console.log('Datos del usuario cargados al abrir modal:', storedUserData);
      }
    }
  }, [visible]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(Dialog, {
    modal: true,
    blockScroll: true,
    header: /*#__PURE__*/React.createElement("div", {
      className: "text-center"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/logo_monaros_sinbg_light.png",
      alt: "Logo",
      className: "w-50 mx-auto mb-3"
    }), /*#__PURE__*/React.createElement("h4", null, "Recuperar Contrase\xF1a")),
    visible: visible,
    onHide: () => {
      onHide();
      resetForm();
    },
    className: "w-11/12 md:w-3/4 lg:w-2/3",
    footer: /*#__PURE__*/React.createElement("div", {
      className: "flex justify-content-between align-items-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-center gap-6 mt-5 mb-4"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: '100px'
      }
    }, activeStep === 0 && otpSent && /*#__PURE__*/React.createElement(Button, {
      label: "Atr\xE1s",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-arrow-left"
      }),
      className: "p-button p-component",
      disabled: loading,
      onClick: () => setOtpSent(false)
    }), activeStep === 1 && /*#__PURE__*/React.createElement(Button, {
      label: "Atr\xE1s",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-arrow-left"
      }),
      className: "p-button p-component",
      disabled: loading,
      onClick: () => setActiveStep(0)
    })), /*#__PURE__*/React.createElement(Button, {
      label: "Cancelar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-xmark"
      }),
      className: "p-button p-component",
      disabled: loading,
      onClick: () => {
        onHide();
        resetForm();
      }
    }), /*#__PURE__*/React.createElement(Button, {
      label: getNextButtonLabel(),
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-arrow-left"
      }),
      className: "p-button p-component",
      iconPos: "right",
      loading: loading,
      disabled: isNextDisabled(),
      onClick: handleNext
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: '100px'
      }
    }))
  }, /*#__PURE__*/React.createElement(Steps, {
    model: steps,
    activeIndex: activeStep,
    className: "mb-5",
    readOnly: false
  }), /*#__PURE__*/React.createElement("div", {
    className: "p-3"
  }, renderStepContent())));
};