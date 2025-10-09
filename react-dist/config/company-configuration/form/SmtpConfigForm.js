function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { useCompanyCommunication } from "../hooks/useCompanyCommunication.js";
const SmtpConfigForm = () => {
  const toast = useRef(null);
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    reset,
    watch
  } = useForm({
    defaultValues: {
      smtp_server: '',
      port: 587,
      security: 'tls',
      email: '',
      password: ''
    }
  });
  const {
    communication,
    loading,
    error,
    isSubmitting,
    submitError,
    saveCommunication
  } = useCompanyCommunication();
  const securityOptions = [{
    label: 'TLS',
    value: 'tls'
  }, {
    label: 'SSL',
    value: 'ssl'
  }, {
    label: 'Ninguna',
    value: 'none'
  }];
  const selectedSecurity = watch('security');
  useEffect(() => {
    if (communication) {
      reset(communication);
    } else if (!loading && !error) {
      reset({
        smtp_server: '',
        port: 587,
        security: 'tls',
        email: '',
        password: ''
      });
    }
  }, [communication, loading, error, reset]);
  useEffect(() => {
    if (submitError && toast.current) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: submitError,
        life: 5000
      });
    }
  }, [submitError]);
  const onSubmit = async data => {
    try {
      console.log('Enviando datos:', data);
      await saveCommunication(data);
    } catch (error) {
      console.error('Error en onSubmit:', error);
    }
  };
  const handleTestConnection = async () => {
    const formData = watch();
    if (!formData.smtp_server || !formData.port || !formData.email) {
      if (toast.current) {
        toast.current.show({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'Complete los campos requeridos para probar la conexión',
          life: 5000
        });
      }
      return;
    }
    try {
      if (toast.current) {
        toast.current.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Conexión SMTP probada exitosamente',
          life: 5000
        });
      }
    } catch (error) {
      if (toast.current) {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo establecer conexión con el servidor SMTP',
          life: 5000
        });
      }
    }
  };
  const getDefaultPort = security => {
    switch (security) {
      case 'ssl':
        return 465;
      case 'tls':
        return 587;
      case 'none':
        return 25;
      default:
        return 587;
    }
  };
  if (loading) {
    return /*#__PURE__*/React.createElement(Card, {
      className: "shadow-sm"
    }, /*#__PURE__*/React.createElement("div", {
      className: "container-fluid"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center p-4"
    }, "Cargando configuraci\xF3n SMTP...")));
  }
  if (error) {
    return /*#__PURE__*/React.createElement(Card, {
      className: "shadow-sm"
    }, /*#__PURE__*/React.createElement("div", {
      className: "container-fluid"
    }, /*#__PURE__*/React.createElement("div", {
      className: "alert alert-danger"
    }, error)));
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(Card, {
    className: "shadow-sm",
    title: "Configuraci\xF3n SMTP",
    subTitle: "Configura los par\xE1metros de env\xEDo de correos electr\xF3nicos"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "smtp_server",
    className: "form-label"
  }, "Servidor SMTP ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "smtp_server",
    control: control,
    rules: {
      required: 'El servidor SMTP es requerido',
      pattern: {
        value: /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: 'Formato de servidor inválido'
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      id: "smtp_server",
      className: `form-control ${errors.smtp_server ? 'is-invalid' : ''}`,
      placeholder: "smtp.gmail.com"
    }))
  }), errors.smtp_server && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback d-block"
  }, errors.smtp_server.message)), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "port",
    className: "form-label"
  }, "Puerto ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "port",
    control: control,
    rules: {
      required: 'El puerto es requerido',
      min: {
        value: 1,
        message: 'Puerto inválido'
      },
      max: {
        value: 65535,
        message: 'Puerto inválido'
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      id: "port",
      type: "number",
      className: `form-control ${errors.port ? 'is-invalid' : ''}`,
      placeholder: getDefaultPort(selectedSecurity).toString(),
      onChange: e => field.onChange(parseInt(e.target.value) || 0)
    }))
  }), errors.port && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback d-block"
  }, errors.port.message)), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "security",
    className: "form-label"
  }, "Tipo de Seguridad ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "security",
    control: control,
    rules: {
      required: 'Seleccione el tipo de seguridad'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      id: "security",
      options: securityOptions,
      placeholder: "Seleccione seguridad",
      className: `w-100 ${errors.security ? 'is-invalid' : ''}`
    }))
  }), errors.security && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback d-block"
  }, errors.security.message))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "email",
    className: "form-label"
  }, "Correo Electr\xF3nico ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "email",
    control: control,
    rules: {
      required: 'El correo electrónico es requerido',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Formato de email inválido'
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      id: "email",
      className: `form-control ${errors.email ? 'is-invalid' : ''}`,
      placeholder: "usuario@dominio.com"
    }))
  }), errors.email && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback d-block"
  }, errors.email.message)), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "password",
    className: "form-label"
  }, "Contrase\xF1a ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "password",
    control: control,
    rules: {
      required: 'La contraseña es requerida',
      minLength: {
        value: 6,
        message: 'La contraseña debe tener al menos 6 caracteres'
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      id: "password",
      type: "password",
      className: `form-control ${errors.password ? 'is-invalid' : ''}`,
      placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
    }))
  }), errors.password && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback d-block"
  }, errors.password.message)))), /*#__PURE__*/React.createElement("div", {
    className: "row mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    label: "Guardar Configuraci\xF3n",
    icon: "pi pi-save",
    loading: isSubmitting,
    className: "btn-primary"
  }), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    label: "Probar Conexi\xF3n",
    icon: "pi pi-test-tube",
    className: "btn-outline-secondary",
    onClick: handleTestConnection
  }))), /*#__PURE__*/React.createElement("div", {
    className: "row mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alert border"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "fw-bold mb-2"
  }, "Configuraciones comunes:"), /*#__PURE__*/React.createElement("div", {
    className: "row small"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("strong", null, "Gmail:"), /*#__PURE__*/React.createElement("br", null), "smtp.gmail.com", /*#__PURE__*/React.createElement("br", null), "Puerto: 587", /*#__PURE__*/React.createElement("br", null), "Seguridad: TLS"), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("strong", null, "Outlook/Office365:"), /*#__PURE__*/React.createElement("br", null), "smtp.office365.com", /*#__PURE__*/React.createElement("br", null), "Puerto: 587", /*#__PURE__*/React.createElement("br", null), "Seguridad: STARTTLS"), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("strong", null, "Yahoo:"), /*#__PURE__*/React.createElement("br", null), "smtp.mail.yahoo.com", /*#__PURE__*/React.createElement("br", null), "Puerto: 465", /*#__PURE__*/React.createElement("br", null), "Seguridad: SSL")))))))));
};
export default SmtpConfigForm;