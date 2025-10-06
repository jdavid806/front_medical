function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Card } from 'primereact/card';
import { useCompanyRepresentative } from "../hooks/useCompanyRepresentative.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
const RepresentativeTab = ({
  companyId,
  onValidationChange
}) => {
  const {
    control,
    handleSubmit,
    formState: {
      errors,
      isValid,
      isDirty
    },
    reset,
    watch
  } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      document_type: '',
      document_number: ''
    },
    mode: 'onChange'
  });
  const {
    representative,
    loading,
    error,
    isSubmitting,
    saveRepresentative
  } = useCompanyRepresentative();
  const documentTypes = [{
    label: 'RNC',
    value: 'RNC'
  }, {
    label: 'PASSPORTE',
    value: 'PASSPORT'
  }, {
    label: 'NIT',
    value: 'NIT'
  }, {
    label: 'CEDULA DE CIUDADANIA',
    value: 'CC'
  }];

  // Observar cambios en el formulario para validación
  const formValues = watch();
  useEffect(() => {
    if (representative) {
      reset(representative);
    } else if (!loading && !error) {
      reset({
        name: '',
        phone: '',
        email: '',
        document_type: '',
        document_number: ''
      });
    }
  }, [representative, loading, error, reset]);

  // Validar cuando cambien los valores del formulario
  useEffect(() => {
    const hasRequiredFields = Boolean(formValues.name && formValues.document_type && formValues.document_number);
    onValidationChange?.(hasRequiredFields);
  }, [formValues, onValidationChange]);
  const onSubmit = async data => {
    try {
      if (!companyId) {
        Message.show({
          severity: 'error',
          summary: 'Error',
          detail: 'companyId es requerido'
        });
        return;
      }
      const savedRepresentative = await saveRepresentative(companyId, data);
      reset(savedRepresentative);

      // Notificar validación exitosa después de guardar
      onValidationChange?.(true);
      SwalManager.success('Representante Legal se actualizo correctamente');
    } catch (error) {
      console.error('Error en onSubmit:', error);
      onValidationChange?.(false);
    }
  };
  if (loading) {
    return /*#__PURE__*/React.createElement(Card, {
      className: "shadow-sm"
    }, /*#__PURE__*/React.createElement("div", {
      className: "container-fluid"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center p-4"
    }, "Cargando datos del representante...")));
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
  return /*#__PURE__*/React.createElement(Card, {
    className: "shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "row mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "fw-bold mb-3"
  }, "Informaci\xF3n del Representante Legal"), !companyId && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-warning"
  }, "companyId no proporcionado. No se pueden guardar datos.")), /*#__PURE__*/React.createElement("div", {
    className: "col-12 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name",
    className: "form-label"
  }, "Nombre Completo ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "name",
    control: control,
    rules: {
      required: 'El nombre del Representante no puede estar vacío',
      minLength: {
        value: 2,
        message: 'El nombre debe tener al menos 2 caracteres'
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      id: "name",
      className: `form-control ${errors.name ? 'is-invalid' : ''}`,
      placeholder: "Jhon Doe",
      disabled: !companyId
    }))
  }), errors.name && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback d-block"
  }, errors.name.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "phone",
    className: "form-label"
  }, "Tel\xE9fono"), /*#__PURE__*/React.createElement(Controller, {
    name: "phone",
    control: control,
    rules: {
      pattern: {
        value: /^\+?[\d\s\-\(\)]+$/,
        message: 'Formato de teléfono inválido'
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      id: "phone",
      className: `form-control ${errors.phone ? 'is-invalid' : ''}`,
      placeholder: "+57 300 123 4567",
      disabled: !companyId
    }))
  }), errors.phone && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback d-block"
  }, errors.phone.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "email",
    className: "form-label"
  }, "Correo Electr\xF3nico"), /*#__PURE__*/React.createElement(Controller, {
    name: "email",
    control: control,
    rules: {
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
      placeholder: "ejemplo@correo.com",
      disabled: !companyId
    }))
  }), errors.email && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback d-block"
  }, errors.email.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "document_type",
    className: "form-label"
  }, "Tipo de Documento ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "document_type",
    control: control,
    rules: {
      required: 'Seleccione un Tipo de Documento'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      id: "document_type",
      options: documentTypes,
      placeholder: "Seleccione un tipo de documento",
      className: `w-100 ${errors.document_type ? 'is-invalid' : ''}`,
      disabled: !companyId
    }))
  }), errors.document_type && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback d-block"
  }, errors.document_type.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "document_number",
    className: "form-label"
  }, "N\xFAmero de Documento ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "document_number",
    control: control,
    rules: {
      required: 'El Documento no puede estar vacío',
      minLength: {
        value: 3,
        message: 'El documento debe tener al menos 3 caracteres'
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      id: "document_number",
      className: `form-control ${errors.document_number ? 'is-invalid' : ''}`,
      placeholder: "123456789",
      disabled: !companyId
    }))
  }), errors.document_number && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback d-block"
  }, errors.document_number.message))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("div", null, isDirty && /*#__PURE__*/React.createElement("small", {
    className: "text-warning"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-info-circle mr-2"
  }), "Tienes cambios sin guardar")), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    label: "Guardar Representante",
    icon: "pi pi-save",
    loading: isSubmitting,
    className: "btn-primary",
    disabled: !companyId || !isValid
  })))))));
};
export default RepresentativeTab;