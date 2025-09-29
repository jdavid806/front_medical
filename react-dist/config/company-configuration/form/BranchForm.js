import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
const BranchForm = ({
  branch,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    city: '',
    country: '',
    is_main: false
  });
  const [errors, setErrors] = useState({});
  const countries = [{
    label: 'República Dominicana',
    value: 'RD'
  }, {
    label: 'Colombia',
    value: 'CO'
  }, {
    label: 'México',
    value: 'MX'
  }, {
    label: 'Argentina',
    value: 'AR'
  }, {
    label: 'Chile',
    value: 'CL'
  }, {
    label: 'Perú',
    value: 'PE'
  }];
  useEffect(() => {
    if (branch) {
      setFormData({
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        email: branch.email,
        city: branch.city,
        country: branch.country,
        is_main: branch.is_main
      });
    }
  }, [branch]);
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre de la sede es requerido';
    if (!formData.address.trim()) newErrors.address = 'La dirección es requerida';
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    if (!formData.email.trim()) newErrors.email = 'El correo electrónico es requerido';
    if (!formData.city.trim()) newErrors.city = 'La ciudad es requerida';
    if (!formData.country) newErrors.country = 'El país es requerido';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name",
    className: "block"
  }, "Nombre de la Sede *"), /*#__PURE__*/React.createElement(InputText, {
    id: "name",
    value: formData.name,
    onChange: e => handleInputChange('name', e.target.value),
    className: errors.name ? 'p-invalid' : '',
    placeholder: "Nombre de la sede"
  }), errors.name && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.name))), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "address",
    className: "block"
  }, "Direcci\xF3n *"), /*#__PURE__*/React.createElement(InputText, {
    id: "address",
    value: formData.address,
    onChange: e => handleInputChange('address', e.target.value),
    className: errors.address ? 'p-invalid' : '',
    placeholder: "Direcci\xF3n completa"
  }), errors.address && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.address))), /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "phone",
    className: "block"
  }, "Tel\xE9fono *"), /*#__PURE__*/React.createElement(InputText, {
    id: "phone",
    value: formData.phone,
    onChange: e => handleInputChange('phone', e.target.value),
    className: errors.phone ? 'p-invalid' : '',
    placeholder: "+57 300 123 4567"
  }), errors.phone && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.phone))), /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "email",
    className: "block"
  }, "Correo Electr\xF3nico *"), /*#__PURE__*/React.createElement(InputText, {
    id: "email",
    value: formData.email,
    onChange: e => handleInputChange('email', e.target.value),
    className: errors.email ? 'p-invalid' : '',
    placeholder: "sede@empresa.com"
  }), errors.email && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.email))), /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "city",
    className: "block"
  }, "Ciudad *"), /*#__PURE__*/React.createElement(InputText, {
    id: "city",
    value: formData.city,
    onChange: e => handleInputChange('city', e.target.value),
    className: errors.city ? 'p-invalid' : '',
    placeholder: "Ciudad"
  }), errors.city && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.city))), /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "country",
    className: "block"
  }, "Pa\xEDs *"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "country",
    value: formData.country,
    options: countries,
    onChange: e => handleInputChange('country', e.value),
    className: errors.country ? 'p-invalid' : '',
    placeholder: "Seleccione un pa\xEDs"
  }), errors.country && /*#__PURE__*/React.createElement("small", {
    className: "p-error"
  }, errors.country))), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-checkbox"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "is_main",
    checked: formData.is_main,
    onChange: e => handleInputChange('is_main', e.checked || false)
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "is_main",
    className: "ml-2"
  }, "Sede principal"))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 flex justify-content-end gap-2 mt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    className: "p-button-secondary",
    onClick: onCancel,
    disabled: loading
  }), /*#__PURE__*/React.createElement(Button, {
    label: branch ? 'Actualizar' : 'Crear',
    icon: "pi pi-check",
    loading: loading,
    type: "submit"
  }))));
};
export default BranchForm;