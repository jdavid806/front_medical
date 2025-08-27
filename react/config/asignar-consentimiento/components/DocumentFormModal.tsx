import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';
import { DocumentoConsentimiento, PatientData } from '../types/DocumentData';
import { ConsentimientoData } from '../../consentimiento/enums/ConsentimientoData';
import { Editor } from 'primereact/editor';

interface DocumentFormModalProps {
  show: boolean;
  title: string;
  onHide: () => void;
  onSubmit: (data: DocumentoConsentimiento, template: ConsentimientoData) => void;
  initialData?: DocumentoConsentimiento | null;
  loading?: boolean;
  templates?: ConsentimientoData[];
  patient?: PatientData;
}

const DocumentFormModal: React.FC<DocumentFormModalProps> = ({
  show,
  title,
  onHide,
  onSubmit,
  initialData,
  loading = false,
  templates = [],
  patient,
}) => {
  const [SelectTemplate, setSelectTemplate] = useState<ConsentimientoData>();
  const [formData, setFormData] = React.useState<DocumentoConsentimiento>({
    titulo: '',
    motivo: '',
    fecha: new Date().toISOString().split('T')[0],
  });

  console.log(SelectTemplate);
  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        titulo: '',
        motivo: '',
        fecha: new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData, show]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, SelectTemplate!);
  };

  const handleChange = (field: keyof DocumentoConsentimiento, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTemplateChange = (templateId: number) => {
    const selectedTemplate = templates.find(t => String(t.id) === String(templateId));
    setSelectTemplate(selectedTemplate ?? undefined);

    let age = 0;
    if (patient?.date_of_birth) {
      const birthDate = new Date(patient.date_of_birth);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }

    let formatedTemplate = selectedTemplate?.data;
    const doctor = JSON.parse(localStorage.getItem('userData')!);
    const doctorName = doctor.first_name + ' ' + doctor.last_name;

    if (formatedTemplate) {
      formatedTemplate = formatedTemplate
        .replaceAll('{{NOMBRE_PACIENTE}}', patient?.first_name + ' ' + patient?.last_name || '')
        .replaceAll('{{DOCUMENTO}}', patient?.document_number ?? '')
        .replaceAll('{{EDAD}}', age.toString())
        .replaceAll('{{FECHA_NACIMIENTO}}', patient?.date_of_birth ?? '')
        .replaceAll('{{TELEFONO}}', patient?.phone ?? '')
        .replaceAll('{{EMAIL}}', patient?.email ?? '')
        .replaceAll('{{CIUDAD}}', patient?.city_id ?? '')
        .replaceAll('{{NOMBRE_DOCTOR}}', doctorName)
        .replaceAll('{{FECHA_ACTUAL}}', new Date().toISOString().split('T')[0]);
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

  const headerElement = (
    <div className="flex align-items-center gap-2">
      <i className="fas fa-file-medical"></i>
      <span>{title}</span>
    </div>
  );

  const footerContent = (
    <div className="flex justify-content-between w-full">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        outlined
        onClick={onHide}
        disabled={loading}
        severity="secondary"
      />
      <Button
        label={loading ? 'Guardando...' : `${initialData ? 'Actualizar' : 'Crear'} Consentimiento`}
        icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-save'}
        onClick={handleSubmit}
        disabled={loading || !formData.titulo?.trim()}
        loading={loading}
      />
    </div>
  );

  return (
    <Dialog
      visible={show}
      modal
      header={headerElement}
      footer={footerContent}
      style={{ width: '50rem' }}
      onHide={onHide}
      closable={!loading}
    >
      <form onSubmit={handleSubmit}>
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="titulo" className="font-bold">
              Plantilla de Consentimiento <span style={{ color: '#e24c4c' }}>*</span>
            </label>
            <Dropdown
              id="titulo"
              value={templates.find(t => t.title === formData.titulo)?.id || null}
              options={templates}
              onChange={(e) => handleTemplateChange(e.value)}
              optionLabel="title"
              optionValue="id"
              placeholder="Seleccione una plantilla"
              showClear
            />
          </div>
          
          <div className="field">
            <label htmlFor="motivo" className="font-bold">
              Motivo/Descripción
            </label>
            <Editor
              style={{ height: '320px' }}
              id="motivo"
              value={formData.motivo || ''}
              placeholder="Ingrese el motivo o descripción del consentimiento"
              onTextChange={(e) => handleChange('motivo', e.htmlValue || '')}
            />
          </div>
          
          <Message
            severity="info"
            text="Este documento será asociado al paciente seleccionado."
            className="mt-3"
          />
        </div>
      </form>
    </Dialog>
  );
};

export default DocumentFormModal;
