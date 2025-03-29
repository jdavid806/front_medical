import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';
export const CreateNewSuppliers = ({
  visible,
  onHide
}) => {
  const [generalData, setGeneralData] = useState({
    type: '',
    documentType: '',
    documentNumber: '',
    firstName: '',
    lastName: '',
    city: '',
    phone: ''
  });
  const [billingData, setBillingData] = useState({
    billingType: '',
    billingDocumentNumber: '',
    billingCity: '',
    billingAddress: ''
  });
  const [showBilling, setShowBilling] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const handleGeneralDropdownChange = e => {
    const {
      name,
      value
    } = e.target;
    setGeneralData({
      ...generalData,
      [name]: value
    });
  };
  const handleGeneralInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setGeneralData({
      ...generalData,
      [name]: value
    });
  };
  const handleBillingDropdownChange = e => {
    const {
      name,
      value
    } = e.target;
    setBillingData({
      ...billingData,
      [name]: value
    });
  };
  const handleBillingInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setBillingData({
      ...billingData,
      [name]: value
    });
  };
  const validateGeneralData = () => {
    return generalData.type !== '' && generalData.documentType !== '' && generalData.documentNumber !== '' && generalData.firstName !== '' && generalData.lastName !== '' && generalData.city !== '' && generalData.phone !== '';
  };
  const handleNext = () => {
    setSubmitted(true);
    if (!validateGeneralData()) {
      return;
    }
    if (!showBilling) {
      setShowBilling(true);
      setActiveTab('billing');
    } else {
      // Aquí iría la lógica para enviar los datos al servidor
      setSuccessMessage('Proveedor creado exitosamente');
      setTimeout(() => {
        onHide();
        setShowBilling(false);
        setActiveTab('general');
        setSubmitted(false);
        setSuccessMessage('');
      }, 2000);
    }
  };
  const documentTypes = [{
    label: 'Cédula de Ciudadanía',
    value: 'CC'
  }, {
    label: 'NIT',
    value: 'NIT'
  }, {
    label: 'Cédula de Extranjería',
    value: 'CE'
  }, {
    label: 'Tarjeta de Identidad',
    value: 'TI'
  }];
  const cities = [{
    label: 'Medellín',
    value: 'Medellín'
  }, {
    label: 'Bogotá',
    value: 'Bogotá'
  }, {
    label: 'Cali',
    value: 'Cali'
  }, {
    label: 'Barranquilla',
    value: 'Barranquilla'
  }];
  const supplierTypes = [{
    label: 'Proveedor',
    value: 'supplier'
  }, {
    label: 'Cliente',
    value: 'client'
  }, {
    label: 'Proveedor y Cliente',
    value: 'both'
  }];
  const billingTypes = [{
    label: 'Factura electrónica',
    value: 'electronic'
  }, {
    label: 'Factura física',
    value: 'physical'
  }];
  const isFormFieldValid = (field, form) => {
    if (form === 'general') {
      return submitted && generalData[field] === '';
    } else {
      return submitted && billingData[field] === '';
    }
  };
  const getFormErrorMessage = (field, form) => {
    return isFormFieldValid(field, form) && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, "Este campo es requerido.");
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    header: "Crear nuevo proveedor",
    visible: visible,
    onHide: onHide,
    modal: true,
    className: "w-100",
    style: {
      maxWidth: '800px'
    }
  }, successMessage && /*#__PURE__*/React.createElement(Message, {
    severity: "success",
    text: successMessage,
    className: "mb-4"
  }), /*#__PURE__*/React.createElement("ul", {
    className: "nav nav-tabs mb-4"
  }, /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("button", {
    className: classNames('nav-link', {
      'active': activeTab === 'general'
    }),
    onClick: () => setActiveTab('general')
  }, "Datos Generales")), showBilling && /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("button", {
    className: classNames('nav-link', {
      'active': activeTab === 'billing'
    }),
    onClick: () => setActiveTab('billing')
  }, "Datos de Facturaci\xF3n"))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, activeTab === 'general' && /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "formgrid grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "type"
  }, "Tipo de Tercero*"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "type",
    value: generalData.type,
    options: [{
      label: 'Seleccione...',
      value: ''
    }, ...supplierTypes],
    onChange: handleGeneralDropdownChange,
    name: "type",
    placeholder: "Seleccione el tipo",
    className: classNames({
      'p-invalid': isFormFieldValid('type', 'general')
    })
  }), getFormErrorMessage('type', 'general')), /*#__PURE__*/React.createElement("div", {
    className: "field col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "documentType"
  }, "Tipo de Documento*"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "documentType",
    value: generalData.documentType,
    options: [{
      label: 'Seleccione...',
      value: ''
    }, ...documentTypes],
    onChange: handleGeneralDropdownChange,
    name: "documentType",
    placeholder: "Seleccione el documento",
    className: classNames({
      'p-invalid': isFormFieldValid('documentType', 'general')
    })
  }), getFormErrorMessage('documentType', 'general')), /*#__PURE__*/React.createElement("div", {
    className: "field col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "documentNumber"
  }, "N\xFAmero de Documento*"), /*#__PURE__*/React.createElement(InputText, {
    id: "documentNumber",
    value: generalData.documentNumber,
    onChange: handleGeneralInputChange,
    name: "documentNumber",
    placeholder: "Ingrese el n\xFAmero",
    className: classNames('w-100', {
      'p-invalid': isFormFieldValid('documentNumber', 'general')
    })
  }), getFormErrorMessage('documentNumber', 'general')), /*#__PURE__*/React.createElement("div", {
    className: "field col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "firstName"
  }, "Nombre*"), /*#__PURE__*/React.createElement(InputText, {
    id: "firstName",
    value: generalData.firstName,
    onChange: handleGeneralInputChange,
    name: "firstName",
    placeholder: "Ingrese el nombre",
    className: classNames('w-100', {
      'p-invalid': isFormFieldValid('firstName', 'general')
    })
  }), getFormErrorMessage('firstName', 'general')), /*#__PURE__*/React.createElement("div", {
    className: "field col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "lastName"
  }, "Apellido*"), /*#__PURE__*/React.createElement(InputText, {
    id: "lastName",
    value: generalData.lastName,
    onChange: handleGeneralInputChange,
    name: "lastName",
    placeholder: "Ingrese el apellido",
    className: classNames('w-100', {
      'p-invalid': isFormFieldValid('lastName', 'general')
    })
  }), getFormErrorMessage('lastName', 'general')), /*#__PURE__*/React.createElement("div", {
    className: "field col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "city"
  }, "Ciudad*"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "city",
    value: generalData.city,
    options: [{
      label: 'Seleccione...',
      value: ''
    }, ...cities],
    onChange: handleGeneralDropdownChange,
    name: "city",
    placeholder: "Seleccione la ciudad",
    className: classNames({
      'p-invalid': isFormFieldValid('city', 'general')
    })
  }), getFormErrorMessage('city', 'general')), /*#__PURE__*/React.createElement("div", {
    className: "field col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "phone"
  }, "Tel\xE9fono*"), /*#__PURE__*/React.createElement(InputText, {
    id: "phone",
    value: generalData.phone,
    onChange: handleGeneralInputChange,
    name: "phone",
    placeholder: "Ingrese el tel\xE9fono",
    className: classNames('w-100', {
      'p-invalid': isFormFieldValid('phone', 'general')
    }),
    keyfilter: "num"
  }), getFormErrorMessage('phone', 'general')))), activeTab === 'billing' && /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "formgrid grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "billingType"
  }, "Tipo de Factura*"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "billingType",
    value: billingData.billingType,
    options: [{
      label: 'Seleccione...',
      value: ''
    }, ...billingTypes],
    onChange: handleBillingDropdownChange,
    name: "billingType",
    placeholder: "Seleccione el tipo",
    className: classNames({
      'p-invalid': isFormFieldValid('billingType', 'billing')
    })
  }), getFormErrorMessage('billingType', 'billing')), /*#__PURE__*/React.createElement("div", {
    className: "field col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "billingDocumentNumber"
  }, "N\xFAmero de Documento*"), /*#__PURE__*/React.createElement(InputText, {
    id: "billingDocumentNumber",
    value: billingData.billingDocumentNumber,
    onChange: handleBillingInputChange,
    name: "billingDocumentNumber",
    placeholder: "Ingrese el n\xFAmero",
    className: classNames('w-100', {
      'p-invalid': isFormFieldValid('billingDocumentNumber', 'billing')
    })
  }), getFormErrorMessage('billingDocumentNumber', 'billing')), /*#__PURE__*/React.createElement("div", {
    className: "field col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "billingCity"
  }, "Ciudad de Facturaci\xF3n*"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "billingCity",
    value: billingData.billingCity,
    options: [{
      label: 'Seleccione...',
      value: ''
    }, ...cities],
    onChange: handleBillingDropdownChange,
    name: "billingCity",
    placeholder: "Seleccione la ciudad",
    className: classNames({
      'p-invalid': isFormFieldValid('billingCity', 'billing')
    })
  }), getFormErrorMessage('billingCity', 'billing')), /*#__PURE__*/React.createElement("div", {
    className: "field col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "billingAddress"
  }, "Direcci\xF3n*"), /*#__PURE__*/React.createElement(InputText, {
    id: "billingAddress",
    value: billingData.billingAddress,
    onChange: handleBillingInputChange,
    name: "billingAddress",
    placeholder: "Ingrese la direcci\xF3n",
    className: classNames('w-100', {
      'p-invalid': isFormFieldValid('billingAddress', 'billing')
    })
  }), getFormErrorMessage('billingAddress', 'billing'))))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-between mt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    onClick: onHide,
    className: "p-button-text"
  }), /*#__PURE__*/React.createElement(Button, {
    label: showBilling ? 'Guardar' : 'Siguiente',
    icon: showBilling ? 'pi pi-check' : 'pi pi-arrow-right',
    onClick: handleNext,
    className: "p-button-success"
  })));
};