import React, { useEffect, useState } from 'react';
import { Button, Dropdown, InputText, Calendar, Dialog, InputMask, Message } from 'primereact';
export const ThirdPartyModal = ({
  visible,
  onHide,
  onSubmit,
  onEdit,
  initialData,
  loading = false,
  error = null
}) => {
  const [formData, setFormData] = useState({
    type: 'client',
    contact: {
      name: '',
      document_type: 'CC',
      document_number: '',
      email: '',
      phone: '',
      address: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      second_last_name: '',
      date_of_birth: null
    }
  });
  const [dateOfBirth, setDateOfBirth] = useState(null);

  // Cargar datos iniciales si estamos editando
  useEffect(() => {
    if (visible && initialData) {
      setFormData({
        type: initialData.type,
        contact: {
          name: initialData.contact.name,
          document_type: initialData.contact.document_type,
          document_number: initialData.contact.document_number,
          email: initialData.contact.email,
          phone: initialData.contact.phone,
          address: initialData.contact.address,
          first_name: initialData.contact.first_name,
          middle_name: initialData.contact.middle_name || '',
          last_name: initialData.contact.last_name,
          second_last_name: initialData.contact.second_last_name || '',
          date_of_birth: initialData.contact.date_of_birth
        }
      });

      // Convertir string a Date para el calendario
      if (initialData.contact.date_of_birth) {
        setDateOfBirth(new Date(initialData.contact.date_of_birth));
      } else {
        setDateOfBirth(null);
      }
    } else if (visible) {
      // Resetear formulario cuando se abre para crear nuevo
      setFormData({
        type: 'client',
        contact: {
          name: '',
          document_type: 'CC',
          document_number: '',
          email: '',
          phone: '',
          address: '',
          first_name: '',
          middle_name: '',
          last_name: '',
          second_last_name: '',
          date_of_birth: null
        }
      });
      setDateOfBirth(null);
    }
  }, [visible, initialData]);
  const tipoTerceroOptions = [{
    label: 'Cliente',
    value: 'client'
  }, {
    label: 'Proveedor',
    value: 'provider'
  }, {
    label: 'Entidad',
    value: 'entity'
  }];
  const tipoDocumentoOptions = [{
    label: 'Cédula',
    value: 'CC'
  }, {
    label: 'NIT',
    value: 'NIT'
  }, {
    label: 'Pasaporte',
    value: 'PA'
  }, {
    label: 'Extranjería',
    value: 'CE'
  }, {
    label: 'RNC',
    value: 'RNC'
  }];
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    if (name.startsWith('contact.')) {
      const contactField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  const handleDropdownChange = (e, field) => {
    if (field.startsWith('contact.')) {
      const contactField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactField]: e.value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: e.value
      }));
    }
  };
  const handleDateChange = e => {
    if (e.value && !Array.isArray(e.value)) {
      const selectedDate = e.value;
      setDateOfBirth(selectedDate);

      // Formatear fecha a string ISO (YYYY-MM-DD)
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          date_of_birth: formattedDate
        }
      }));
    } else {
      setDateOfBirth(null);
      setFormData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          date_of_birth: null
        }
      }));
    }
  };
  const handleSubmit = e => {
    e.preventDefault();

    // Validación básica
    if (!formData.contact.document_number) {
      return;
    }
    if (initialData && onEdit) {
      onEdit(formData);
    } else {
      onSubmit(formData);
    }
  };
  const getFormattedTitle = () => {
    return initialData ? `Editar Tercero - ${initialData.contact.first_name}` : 'Nuevo Tercero';
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    header: getFormattedTitle(),
    visible: visible,
    style: {
      width: '70vw'
    },
    onHide: onHide,
    maximizable: true,
    modal: true,
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit
  }, error && /*#__PURE__*/React.createElement(Message, {
    severity: "error",
    text: error,
    className: "mb-4"
  }), /*#__PURE__*/React.createElement("div", {
    className: "row mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "type",
    className: "form-label"
  }, "Tipo de Tercero *"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "type",
    value: formData.type,
    options: tipoTerceroOptions,
    onChange: e => handleDropdownChange(e, 'type'),
    placeholder: "Seleccione tipo",
    className: "w-100",
    disabled: !!initialData
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact.document_type",
    className: "form-label"
  }, "Tipo de Documento *"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "contact.document_type",
    value: formData.contact.document_type,
    options: tipoDocumentoOptions,
    onChange: e => handleDropdownChange(e, 'contact.document_type'),
    placeholder: "Seleccione tipo",
    className: "w-100",
    disabled: !!initialData
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact.document_number",
    className: "form-label"
  }, "N\xFAmero de Documento *"), /*#__PURE__*/React.createElement(InputText, {
    id: "contact.document_number",
    name: "contact.document_number",
    value: formData.contact.document_number,
    onChange: handleInputChange,
    className: "w-100",
    placeholder: "Ingrese el n\xFAmero de documento",
    disabled: !!initialData,
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact.email",
    className: "form-label"
  }, "Correo Electr\xF3nico"), /*#__PURE__*/React.createElement(InputText, {
    id: "contact.email",
    name: "contact.email",
    value: formData.contact.email,
    onChange: handleInputChange,
    className: "w-100",
    placeholder: "ejemplo@dominio.com",
    type: "email"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact.phone",
    className: "form-label"
  }, "Tel\xE9fono"), /*#__PURE__*/React.createElement(InputMask, {
    id: "contact.phone",
    name: "contact.phone",
    value: formData.contact.phone,
    onChange: handleInputChange,
    className: "w-100",
    placeholder: "Ingrese n\xFAmero telef\xF3nico",
    mask: "999-999-9999"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact.address",
    className: "form-label"
  }, "Direcci\xF3n"), /*#__PURE__*/React.createElement(InputText, {
    id: "contact.address",
    name: "contact.address",
    value: formData.contact.address,
    onChange: handleInputChange,
    className: "w-100",
    placeholder: "Ingrese direcci\xF3n completa"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact.name",
    className: "form-label"
  }, "Raz\xF3n social *"), /*#__PURE__*/React.createElement(InputText, {
    id: "contact.name",
    name: "contact.name",
    value: formData.contact.name,
    onChange: handleInputChange,
    className: "w-100",
    placeholder: "Ingrese la raz\xF3n social",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact.first_name",
    className: "form-label"
  }, "Primer Nombre"), /*#__PURE__*/React.createElement(InputText, {
    id: "contact.first_name",
    name: "contact.first_name",
    value: formData.contact.first_name,
    onChange: handleInputChange,
    className: "w-100",
    placeholder: "Ingrese primer nombre"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact.middle_name",
    className: "form-label"
  }, "Segundo Nombre"), /*#__PURE__*/React.createElement(InputText, {
    id: "contact.middle_name",
    name: "contact.middle_name",
    value: formData.contact.middle_name,
    onChange: handleInputChange,
    className: "w-100",
    placeholder: "Ingrese segundo nombre (si aplica)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact.last_name",
    className: "form-label"
  }, "Primer Apellido"), /*#__PURE__*/React.createElement(InputText, {
    id: "contact.last_name",
    name: "contact.last_name",
    value: formData.contact.last_name,
    onChange: handleInputChange,
    className: "w-100",
    placeholder: "Ingrese primer apellido"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "contact.second_last_name",
    className: "form-label"
  }, "Segundo Apellido"), /*#__PURE__*/React.createElement(InputText, {
    id: "contact.second_last_name",
    name: "contact.second_last_name",
    value: formData.contact.second_last_name,
    onChange: handleInputChange,
    className: "w-100",
    placeholder: "Ingrese segundo apellido (si aplica)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "date_of_birth",
    className: "form-label"
  }, "Fecha de Nacimiento"), /*#__PURE__*/React.createElement(Calendar, {
    id: "date_of_birth",
    value: dateOfBirth,
    onChange: handleDateChange,
    dateFormat: "dd/mm/yy",
    className: "w-100",
    showIcon: true,
    placeholder: "Seleccione fecha",
    maxDate: new Date(),
    yearRange: "1900:2030"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end gap-2 mt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    className: "p-button-secondary",
    onClick: onHide,
    disabled: loading
  }), /*#__PURE__*/React.createElement(Button, {
    label: initialData ? "Actualizar" : "Guardar",
    icon: "pi pi-check",
    className: "p-button-primary",
    type: "submit",
    loading: loading
  }))));
};