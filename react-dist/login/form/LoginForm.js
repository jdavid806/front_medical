import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Galleria } from 'primereact/galleria';
import { useAuth } from "../hooks/useAuth.js";
export const LoginForm = ({
  onLogin,
  onForgotPassword
}) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [images, setImages] = useState(["assets/img/gallery/MedicalSoft_Login_Default.jpg"]);
  const [activeIndex, setActiveIndex] = useState(0);
  const {
    loading
  } = useAuth();
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('https://hooks.medicalsoft.ai/webhook/imagenes');
        const data = await response.json();
        const processedImages = data.filter(img => img.Activo).map(img => {
          const match = img.url_imagen.match(/\/d\/([^\/]+)/);
          const fileId = match ? match[1] : '';
          const directUrl = fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000` : img.url_imagen; // Fallback a la URL original

          return directUrl;
        });
        setImages(prevImages => [...prevImages, ...processedImages]);
      } catch (error) {
        console.error('Error fetching images:', error);
        setImages(["assets/img/gallery/MedicalSoft_Login_Default.jpg"]);
      }
    };
    fetchImages();
  }, []);
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex(prevIndex => (prevIndex + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [images]);
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
  const itemTemplate = imageURL => {
    return /*#__PURE__*/React.createElement("div", {
      className: "w-100 h-100 d-flex align-items-center justify-content-center"
    }, /*#__PURE__*/React.createElement("img", {
      src: imageURL,
      alt: "Medical background",
      className: "w-100 h-100 object-fit-cover",
      style: {
        objectPosition: 'center'
      },
      onError: e => {
        e.currentTarget.src = "assets/img/gallery/MedicalSoft_Login_Default.jpg";
      }
    }));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid h-100 p-0 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-0 h-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-lg-6 d-flex align-items-center justify-content-center p-3 p-md-4 p-lg-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-100",
    style: {
      maxWidth: '450px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center mb-4"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/img/logos/FullColor.svg",
    alt: "Logo Medicalsoft",
    className: "img-fluid mb-4",
    style: {
      maxWidth: '45%'
    }
  })), /*#__PURE__*/React.createElement("form", {
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
    className: "btn btn-link p-0 text-primary fw-medium"
  }, "\xBFHas olvidado tu contrase\xF1a?")))), /*#__PURE__*/React.createElement("div", {
    className: "col-lg-6 d-none d-lg-flex p-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-40 h-40 overflow-hidden"
  }, /*#__PURE__*/React.createElement(Galleria, {
    value: images,
    activeIndex: activeIndex,
    onItemChange: e => setActiveIndex(e.index),
    showThumbnails: false,
    showIndicators: true,
    showItemNavigators: false,
    item: itemTemplate,
    circular: true,
    autoPlay: false,
    transitionInterval: 5000,
    className: "h-100 w-100"
  })))));
};