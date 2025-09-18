import React, { useState, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { useAuth } from "./hooks/useAuth.js";
import { ForgotPasswordModal } from "./modal/ForgotPasswordModal.js";
import { LoginForm } from "./form/LoginForm.js";
export const LoginApp = () => {
  console.log("Holaaa Renderizo");
  const [currentView, setCurrentView] = useState('login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [username, setUsername] = useState('');
  const {
    login,
    loading,
    Toast: toastRef
  } = useAuth();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const firstTime = urlParams.get('first_time');
    if (firstTime === 'true' && email) {
      localStorage.setItem('complete_registration', 'true');
      localStorage.setItem('email', email);
    }
    const savedUsername = localStorage.getItem('username');
    if (savedUsername && window.location.pathname.includes('forgotPassword')) {
      setUsername(savedUsername);
      setCurrentView('changePassword');
    }
  }, []);
  const handleLogin = async credentials => {
    const result = await login(credentials);
    if (result.success) {
      console.log("Inicio de sesión exitoso");
    }
  };
  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };
  const handlePasswordChangeSuccess = () => {
    setCurrentView('login');
    setShowForgotPassword(false);
    localStorage.removeItem('username');
  };
  const handleCancelForgotPassword = () => {
    setCurrentView('login');
    setShowForgotPassword(false);
  };
  const renderCurrentView = () => {
    switch (currentView) {
      case 'changePassword':
        return /*#__PURE__*/React.createElement(ForgotPasswordModal, {
          visible: true,
          onHide: handleCancelForgotPassword,
          onSuccess: handlePasswordChangeSuccess
        });
      default:
        return /*#__PURE__*/React.createElement(LoginForm, {
          onLogin: handleLogin,
          onForgotPassword: handleForgotPassword
        });
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "app-container w-full h-full flex items-center justify-center overflow-hidden"
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toastRef
  }), /*#__PURE__*/React.createElement(ConfirmDialog, null), /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 w-full h-full flex items-center justify-center"
  }, renderCurrentView()), showForgotPassword && /*#__PURE__*/React.createElement(ForgotPasswordModal, {
    visible: showForgotPassword,
    onHide: () => setShowForgotPassword(false),
    onSuccess: handlePasswordChangeSuccess
  }));
};