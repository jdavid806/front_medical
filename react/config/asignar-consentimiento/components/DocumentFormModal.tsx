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
  onSubmit: (data: DocumentoConsentimiento) => void;
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
  console.log('tt', templates);
  const [SelectTemplate, setSelectTemplate] = useState<ConsentimientoData>();
  const [formData, setFormData] = React.useState<DocumentoConsentimiento>({
    titulo: '',
    motivo: '',
    fecha: new Date().toISOString().split('T')[0],
  });

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
    onSubmit(formData);
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

    console.log('patient--d', patient);

    const formatedTemplate = selectedTemplate?.data;
    const NOMBRE_PACIENTE = formatedTemplate?.replace('{{NOMBRE_PACIENTE}}', patient?.first_name+' '+patient?.last_name);
    const DOCUMENTO = formatedTemplate?.replace('{{DOCUMENTO}}', patient?.document_number ?? '');
    const EDAD = formatedTemplate?.replace('{{EDAD}}', '25');
    const FECHA_NACIMIENTO = formatedTemplate?.replace('{{FECHA_NACIMIENTO}}', '2000-01-01');
    const EMAIL = formatedTemplate?.replace('{{EMAIL}}', 'juan.perez@gmail.com');
    const CIUDAD = formatedTemplate?.replace('{{CIUDAD}}', 'Buenos Aires');
    const NOMBRE_DOCTOR = formatedTemplate?.replace('{{NOMBRE_DOCTOR}}', 'Juan Perez');
    const FECHA_ACTUAL = formatedTemplate?.replace('{{FECHA_ACTUAL}}', new Date().toISOString().split('T')[0]);

    setFormData(prev => ({
      ...prev,
      motivo: selectedTemplate?.data || ''
    }));

    if (selectedTemplate) {
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
