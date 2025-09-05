import React, { useState, useEffect } from 'react';
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';
export const NewPasswordModal = ({
  passwords,
  setPasswords
}) => {
  const [passwordErrors, setPasswordErrors] = useState({
    minLength: false,
    hasUppercase: false,
    hasSpecialChar: false
  });
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  useEffect(() => {
    const errors = {
      minLength: passwords.password.length >= 8,
      hasUppercase: /[A-Z]/.test(passwords.password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(passwords.password)
    };
    setPasswordErrors(errors);
  }, [passwords.password]);
  useEffect(() => {
    if (passwords.password_confirmation && passwords.password !== passwords.password_confirmation) {
      setConfirmPasswordError('Las contraseñas no coinciden');
    } else {
      setConfirmPasswordError('');
    }
  }, [passwords.password, passwords.password_confirmation]);
  const handleChange = e => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    });
  };
  const passwordHeader = /*#__PURE__*/React.createElement("h6", null, "Por favor, ingrese una contrase\xF1a que cumpla con:");
  const passwordFooter = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "p-mt-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: passwordErrors.minLength ? "text-green-500" : "text-red-500"
  }, passwordErrors.minLength ? "✓ " : "✗ ", "M\xEDnimo 8 caracteres"), /*#__PURE__*/React.createElement("div", {
    className: passwordErrors.hasUppercase ? "text-green-500" : "text-red-500"
  }, passwordErrors.hasUppercase ? "✓ " : "✗ ", "Al menos 1 may\xFAscula"), /*#__PURE__*/React.createElement("div", {
    className: passwordErrors.hasSpecialChar ? "text-green-500" : "text-red-500"
  }, passwordErrors.hasSpecialChar ? "✓ " : "✗ ", "Al menos 1 caracter especial (!@#$...)")));
  return /*#__PURE__*/React.createElement("div", {
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "password",
    className: "block"
  }, "Nueva contrase\xF1a *"), /*#__PURE__*/React.createElement(Password, {
    id: "password",
    name: "password",
    value: passwords.password,
    onChange: handleChange,
    className: "w-full",
    required: true,
    toggleMask: true,
    header: passwordHeader,
    footer: passwordFooter
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "password_confirmation",
    className: "block"
  }, "Confirmar contrase\xF1a *"), /*#__PURE__*/React.createElement(Password, {
    id: "password_confirmation",
    name: "password_confirmation",
    value: passwords.password_confirmation,
    onChange: handleChange,
    className: "w-full",
    required: true,
    toggleMask: true,
    feedback: false
  }), confirmPasswordError && /*#__PURE__*/React.createElement(Message, {
    severity: "error",
    text: confirmPasswordError,
    className: "mt-2"
  })));
};