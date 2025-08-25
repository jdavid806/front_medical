import React, { useState, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { useAuth } from "./hooks/useAuth.js";
import ForgotPasswordModal from "./ForgotPasswordModal.js";
import LoginForm from "./LoginForm.js";
import OTPModal from "./OTPModal.js";
function LoginApp() {
  const [currentView, setCurrentView] = useState('login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [username, setUsername] = useState('');
  const {
    login
  } = useAuth();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const firstTime = urlParams.get('first_time');
    if (firstTime === 'true' && email) {
      localStorage.setItem('complete_registration', 'true');
      localStorage.setItem('email', email);
      window.history.replaceState({}, document.title, window.location.pathname);
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
      console.log("inicio seccion!!");
    }
  };
  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };
  const handleOTPRequest = () => {
    setShowForgotPassword(false);
    setShowOTPModal(true);
  };
  const handlePasswordChangeSuccess = () => {
    setCurrentView('login');
    localStorage.removeItem('username');
  };
  const renderCurrentView = () => {
    switch (currentView) {
      case 'changePassword':
        return /*#__PURE__*/React.createElement(ForgotPasswordModal, {
          username: username,
          onSuccess: handlePasswordChangeSuccess,
          onCancel: () => setCurrentView('login')
        });
      default:
        return /*#__PURE__*/React.createElement(LoginForm, {
          onLogin: handleLogin,
          onForgotPassword: handleForgotPassword
        });
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "app-container relative w-full h-screen overflow-hidden"
  }, /*#__PURE__*/React.createElement(Toast, null), /*#__PURE__*/React.createElement(ConfirmDialog, null), /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 w-full h-full flex items-center justify-center p-4"
  }, renderCurrentView()), showForgotPassword && /*#__PURE__*/React.createElement(ForgotPasswordModal, {
    visible: showForgotPassword,
    onHide: () => setShowForgotPassword(false),
    onOTPSent: handleOTPRequest
  }), showOTPModal && /*#__PURE__*/React.createElement(OTPModal, {
    visible: showOTPModal,
    onHide: () => setShowOTPModal(false),
    onVerified: () => {
      setShowOTPModal(false);
      setCurrentView('changePassword');
    }
  }));
}
export default LoginApp;