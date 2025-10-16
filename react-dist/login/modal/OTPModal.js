import React from 'react';
import { InputOtp } from 'primereact/inputotp';
import { Button } from 'primereact/button';
export const OTPModal = ({
  otp,
  setOtp,
  onResendOTP
}) => {
  const otpValue = otp.join('');
  const handleOtpChange = e => {
    const value = e.value?.toString() || '';
    const newOtpArray = value.split('');
    while (newOtpArray.length < 6) {
      newOtpArray.push('');
    }
    setOtp(newOtpArray);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-gray-600 mb-4"
  }, "Hemos enviado un c\xF3digo de 6 d\xEDgitos a tu tel\xE9fono. Ingr\xE9salo a continuaci\xF3n."), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center items-center mb-4"
  }, /*#__PURE__*/React.createElement(InputOtp, {
    value: otpValue,
    onChange: handleOtpChange,
    length: 6,
    integerOnly: true,
    className: "justify-center",
    mask: true,
    autoComplete: "off",
    type: "number"
  })), /*#__PURE__*/React.createElement("div", {
    className: "text-center mt-3"
  }, /*#__PURE__*/React.createElement("span", null, "\xBFNo recibiste el c\xF3digo? "), /*#__PURE__*/React.createElement(Button, {
    style: {
      padding: "0px"
    },
    label: "Reenviar OTP",
    link: true,
    onClick: onResendOTP
  })));
};