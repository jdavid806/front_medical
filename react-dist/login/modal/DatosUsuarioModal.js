import React from 'react';
import { InputText } from 'primereact/inputtext';
import { InputOtp } from 'primereact/inputotp';
import { Button } from 'primereact/button';
export const DatosUsuarioModal = ({
  username,
  setUsername,
  otp,
  setOtp,
  otpSent,
  onResendOTP
}) => {
  const handleUsernameChange = e => {
    setUsername(e.target.value);
  };
  const handleOtpChange = e => {
    const value = e.value?.toString() || '';
    const newOtpArray = value.split('');
    while (newOtpArray.length < 6) {
      newOtpArray.push('');
    }
    setOtp(newOtpArray);
  };
  const otpValue = otp.join('');
  return /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, !otpSent ?
  /*#__PURE__*/
  // Solo campo de nombre de usuario
  React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600 mb-4"
  }, "Ingresa tu nombre de usuario para recuperar tu contrase\xF1a.")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3",
    style: {
      maxWidth: '300px',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username",
    className: "form-label text-left d-block"
  }, "Nombre de usuario *"), /*#__PURE__*/React.createElement(InputText, {
    id: "username",
    name: "username",
    value: username,
    onChange: handleUsernameChange,
    className: "w-100",
    placeholder: "Ingresa tu nombre de usuario"
  }))) :
  /*#__PURE__*/
  // Sección de OTP
  React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600 mb-4"
  }, "Hemos enviado un c\xF3digo de 6 d\xEDgitos a tu tel\xE9fono registrado. Ingr\xE9salo a continuaci\xF3n."), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center items-center mb-4"
  }, /*#__PURE__*/React.createElement(InputOtp, {
    value: otpValue,
    onChange: handleOtpChange,
    length: 6,
    integerOnly: true,
    className: "justify-center",
    mask: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "text-center mt-3"
  }, /*#__PURE__*/React.createElement("span", null, "\xBFNo recibiste el c\xF3digo? "), /*#__PURE__*/React.createElement(Button, {
    style: {
      padding: "0px"
    },
    label: "Reenviar OTP",
    link: true,
    onClick: onResendOTP
  })))));
};