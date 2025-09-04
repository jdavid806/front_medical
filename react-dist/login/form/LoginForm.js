import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { useAuth } from "../hooks/useAuth.js";
export const LoginForm = ({
  onLogin,
  onForgotPassword
}) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const {
    loading
  } = useAuth();
  const handleSubmit = e => {
    e.preventDefault();
    onLogin(credentials);
  };
  const handleChange = e => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };
  const handleKeyPress = e => {
    if (e.code === 'Enter') {
      handleSubmit(e);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "min-vh-100 d-flex align-items-center justify-content-center p-0 bg-white"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container-fluid h-100 p-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-0 h-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 d-flex align-items-center justify-content-center p-3 p-md-4 p-lg-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-100",
    style: {
      maxWidth: '450px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center mb-4"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/logo_monaros_sinbg_light.png",
    alt: "Logo Medicalsoft",
    className: "img-fluid mb-4",
    style: {
      maxWidth: '65%'
    }
  }), /*#__PURE__*/React.createElement("h2", {
    className: "h3 fw-bold text-gray-800 mb-3"
  }, "Inicia sesi\xF3n")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "w-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username",
    className: "form-label fw-semibold"
  }, "Usuario"), /*#__PURE__*/React.createElement(InputText, {
    id: "username",
    name: "username",
    value: credentials.username,
    onChange: handleChange,
    onKeyDown: handleKeyPress,
    className: "w-100",
    required: true,
    placeholder: "Ingresa tu usuario"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-4 w-100"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "password",
    className: "form-label fw-semibold"
  }, "Contrase\xF1a"), /*#__PURE__*/React.createElement(Password, {
    id: "password",
    name: "password",
    value: credentials.password,
    onChange: handleChange,
    onKeyDown: handleKeyPress,
    style: {
      maxWidth: "100%",
      width: "100%"
    },
    className: "w-100",
    toggleMask: true,
    feedback: false,
    placeholder: "Ingresa tu contrase\xF1a",
    required: true,
    inputClassName: "w-100"
  })), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    label: "Iniciar sesi\xF3n",
    icon: loading ? 'pi pi-spinner pi-spin' : 'pi pi-sign-in',
    loading: loading,
    className: "w-100 py-3 bg-gray-900 border-gray-900 hover:bg-gray-800",
    style: {
      fontSize: '1.1rem'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "text-center mt-4"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onForgotPassword,
    className: "btn btn-link text-decoration-none p-0 text-primary fw-medium"
  }, "\xBFHas olvidado tu contrase\xF1a?")))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 d-none d-md-flex align-items-center justify-content-center p-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-100 w-100 d-flex align-items-center justify-content-center"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/medical_index.jpg",
    alt: "login form",
    className: "img-fluid h-100 w-100 object-fit-cover",
    style: {
      objectPosition: 'center'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "position-absolute text-center text-white p-4",
    style: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '10px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h2 fw-bold mb-3"
  }, "Sistema M\xE9dico Integral"), /*#__PURE__*/React.createElement("p", {
    className: "lead"
  }, "Plataforma de gesti\xF3n m\xE9dica especializada")))))));
};