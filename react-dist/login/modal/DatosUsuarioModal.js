import React from 'react';
import { InputText } from 'primereact/inputtext';
export const DatosUsuarioModal = ({
  formData,
  setFormData
}) => {
  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "nombreCentro",
    className: "form-label"
  }, "Nombre del centro m\xE9dico *"), /*#__PURE__*/React.createElement(InputText, {
    id: "nombreCentro",
    name: "nombreCentro",
    value: formData.nombreCentro,
    onChange: handleChange,
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "codPais",
    className: "form-label"
  }, "C\xF3digo de pa\xEDs *"), /*#__PURE__*/React.createElement(InputText, {
    id: "codPais",
    name: "codPais",
    value: formData.codPais,
    onChange: handleChange,
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "email",
    className: "form-label"
  }, "Correo electr\xF3nico *"), /*#__PURE__*/React.createElement(InputText, {
    id: "email",
    name: "email",
    type: "email",
    value: formData.email,
    onChange: handleChange,
    className: "w-100"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "nombreUsuario",
    className: "form-label"
  }, "Nombre de usuario *"), /*#__PURE__*/React.createElement(InputText, {
    id: "nombreUsuario",
    name: "nombreUsuario",
    value: formData.nombreUsuario,
    onChange: handleChange,
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "telefono",
    className: "form-label"
  }, "Tel\xE9fono *"), /*#__PURE__*/React.createElement(InputText, {
    id: "phone",
    name: "phone",
    value: formData.phone,
    onChange: handleChange,
    className: "w-100"
  }))));
};