import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';
import { Editor } from 'primereact/editor';
const DocumentFormModal = ({
  show,
  title,
  onHide,
  onSubmit,
  initialData,
  loading = false,
  templates = [],
  patient
}) => {
  const [SelectTemplate, setSelectTemplate] = useState();
  const [formData, setFormData] = React.useState({
    titulo: '',
    motivo: '',
    fecha: new Date().toISOString().split('T')[0]
  });
  console.log(SelectTemplate);
  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        titulo: '',
        motivo: '',
        fecha: new Date().toISOString().split('T')[0]
      });
    }
  }, [initialData, show]);
  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData, SelectTemplate);
  };
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleTemplateChange = templateId => {
    const selectedTemplate = templates.find(t => String(t.id) === String(templateId));
    setSelectTemplate(selectedTemplate ?? undefined);
    let age = 0;
    if (patient?.date_of_birth) {
      const birthDate = new Date(patient.date_of_birth);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || m === 0 && today.getDate() < birthDate.getDate()) {
        age--;
      }
    }
    let formatedTemplate = selectedTemplate?.data;
    const doctor = JSON.parse(localStorage.getItem('userData'));
    const doctorName = doctor.first_name + ' ' + doctor.last_name;
    if (formatedTemplate) {
      formatedTemplate = formatedTemplate.replaceAll('{{NOMBRE_PACIENTE}}', patient?.first_name + ' ' + patient?.last_name || '').replaceAll('{{DOCUMENTO}}', patient?.document_number ?? '').replaceAll('{{EDAD}}', age.toString()).replaceAll('{{FECHA_NACIMIENTO}}', patient?.date_of_birth ?? '').replaceAll('{{TELEFONO}}', patient?.phone ?? '').replaceAll('{{EMAIL}}', patient?.email ?? '').replaceAll('{{CIUDAD}}', patient?.city_id ?? '').replaceAll('{{NOMBRE_DOCTOR}}', doctorName).replaceAll('{{FECHA_ACTUAL}}', new Date().toISOString().split('T')[0]);
    }
    if (selectedTemplate) {
      setFormData(prev => ({
        ...prev,
        motivo: formatedTemplate || ''
      }));
      setFormData(prev => ({
        ...prev,
        titulo: selectedTemplate.title
      }));
    }
  };
  const headerElement = /*#__PURE__*/React.createElement("div", {
    className: "flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-file-medical"
  }), /*#__PURE__*/React.createElement("span", null, title));
  const footerContent = /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-between w-full"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    outlined: true,
    onClick: onHide,
    disabled: loading,
    severity: "secondary"
  }), /*#__PURE__*/React.createElement(Button, {
    label: loading ? 'Guardando...' : `${initialData ? 'Actualizar' : 'Asignar'} Consentimiento`,
    icon: loading ? 'pi pi-spin pi-spinner' : 'pi pi-save',
    onClick: handleSubmit,
    disabled: loading || !formData.titulo?.trim(),
    loading: loading
  }));
  return /*#__PURE__*/React.createElement(Dialog, {
    visible: show,
    modal: true,
    header: headerElement,
    footer: footerContent,
    style: {
      width: '50rem'
    },
    onHide: onHide,
    closable: !loading
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "titulo",
    className: "font-bold"
  }, "Plantilla de Consentimiento ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#e24c4c'
    }
  }, "*")), /*#__PURE__*/React.createElement(Dropdown, {
    id: "titulo",
    value: templates.find(t => t.title === formData.titulo)?.id || null,
    options: templates,
    onChange: e => handleTemplateChange(e.value),
    optionLabel: "title",
    optionValue: "id",
    placeholder: "Seleccione una plantilla",
    showClear: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "motivo",
    className: "font-bold"
  }, "Motivo/Descripci\xF3n"), /*#__PURE__*/React.createElement(Editor, {
    style: {
      height: '320px'
    },
    id: "motivo",
    value: formData.motivo || '',
    placeholder: "Ingrese el motivo o descripci\xF3n del consentimiento",
    onTextChange: e => handleChange('motivo', e.htmlValue || '')
  })), /*#__PURE__*/React.createElement(Message, {
    severity: "info",
    text: "Este documento ser\xE1 asociado al paciente seleccionado.",
    className: "mt-3"
  }))));
};
export default DocumentFormModal;