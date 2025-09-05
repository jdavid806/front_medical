import React, { useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Steps } from 'primereact/steps';
import { authService } from "../../../services/api/index.js";
import { DatosUsuarioModal } from "./DatosUsuarioModal.js";
import { OTPModal } from "./OTPModal.js";
import { NewPasswordModal } from "./NewPasswordModal.js";
export const ForgotPasswordModal = ({
  visible,
  onHide,
  onSuccess
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    nombreCentro: '',
    nombreUsuario: '',
    codPais: '',
    phone: '',
    email: ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [passwords, setPasswords] = useState({
    password: '',
    password_confirmation: ''
  });
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
  const steps = [{
    label: 'Datos de Usuario'
  }, {
    label: 'Verificación OTP'
  }, {
    label: 'Nueva Contraseña'
  }];
  const handleSendOTP = async () => {
    setLoading(true);
    try {
      const data = {
        nombre_del_centro_medico: formData.nombreCentro,
        nombre_usuario: formData.nombreUsuario,
        cod_pais: formData.codPais,
        phone: formData.codPais + formData.phone,
        email: formData.email
      };
      console.log(data, 'datos');
      const response = await authService.sendOTP(data);
      if (response.status === 200 || response.data?.success) {
        localStorage.setItem('username', formData.nombreUsuario);
        setActiveStep(1);
        showToast('success', 'Éxito', 'Código OTP enviado correctamente');
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
      const payload = {
        otp: otpCode,
        email: formData.email,
        phone: formData.phone
      };
      console.log('Payload OTP:', payload);
      const response = await authService.validateOTP(payload);
      if (response.status === 200 || response.data?.success) {
        showToast('success', 'Éxito', 'OTP verificado correctamente');
        setActiveStep(2);
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
    setLoading(true);
    try {
      const changePasswordData = {
        username: formData.nombreUsuario,
        password: passwords.password,
        password_confirmation: passwords.password_confirmation
      };
      const response = await authService.changePassword(changePasswordData);
      if (response.status === 200 || response.data?.success) {
        showToast('success', 'Éxito', 'Contraseña cambiada correctamente');
        setTimeout(() => {
          onSuccess();
          onHide();
          resetForm();
        }, 1500);
      } else {
        throw new Error(response.data?.message || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      showToast('error', 'Error', error.response?.data?.message || error.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };
  const resetForm = () => {
    setActiveStep(0);
    setFormData({
      nombreCentro: '',
      nombreUsuario: '',
      codPais: '',
      phone: '',
      email: ''
    });
    setOtp(['', '', '', '', '', '']);
    setPasswords({
      password: '',
      password_confirmation: ''
    });
  };
  const isStep1Complete = () => {
    return formData.nombreCentro !== '' && formData.nombreUsuario !== '' && formData.codPais !== '' && formData.phone !== '' && formData.email !== '';
  };
  const isStep2Complete = () => {
    return otp.every(digit => digit !== '');
  };
  const isStep3Complete = () => {
    return passwords.password !== '' && passwords.password_confirmation !== '' && passwords.password === passwords.password_confirmation;
  };
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return /*#__PURE__*/React.createElement(DatosUsuarioModal, {
          formData: formData,
          setFormData: setFormData
        });
      case 1:
        return /*#__PURE__*/React.createElement(OTPModal, {
          otp: otp,
          setOtp: setOtp,
          onResendOTP: handleSendOTP,
          email: formData.email,
          phone: formData.phone
        });
      case 2:
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
        return 'Enviar OTP';
      case 1:
        return 'Verificar OTP';
      case 2:
        return 'Cambiar Contraseña';
      default:
        return 'Siguiente';
    }
  };
  const handleNext = () => {
    switch (activeStep) {
      case 0:
        handleSendOTP();
        break;
      case 1:
        handleVerifyOTP();
        break;
      case 2:
        handleChangePassword();
        break;
      default:
        break;
    }
  };
  const isNextDisabled = () => {
    switch (activeStep) {
      case 0:
        return !isStep1Complete() || loading;
      case 1:
        return !isStep2Complete() || loading;
      case 2:
        return !isStep3Complete() || loading;
      default:
        return true;
    }
  };
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
    }, /*#__PURE__*/React.createElement(Button, {
      label: "Atr\xE1s",
      icon: "pi pi-arrow-left",
      className: "p-button-text",
      disabled: activeStep === 0 || loading,
      onClick: () => setActiveStep(activeStep - 1)
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      label: "Cancelar",
      className: "p-button-secondary",
      disabled: loading,
      onClick: () => {
        onHide();
        resetForm();
      }
    }), /*#__PURE__*/React.createElement(Button, {
      label: getNextButtonLabel(),
      icon: "pi pi-arrow-right",
      iconPos: "right",
      loading: loading,
      disabled: isNextDisabled(),
      onClick: handleNext
    })))
  }, /*#__PURE__*/React.createElement(Steps, {
    model: steps,
    activeIndex: activeStep,
    className: "mb-5",
    readOnly: false
  }), /*#__PURE__*/React.createElement("div", {
    className: "p-3"
  }, renderStepContent())));
};