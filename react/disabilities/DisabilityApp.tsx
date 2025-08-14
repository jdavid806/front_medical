import React, { useState } from 'react'
import { PrimeReactProvider } from "primereact/api";
import  DisabilityTable  from './components/DisabilityTable'
import { getColumns } from './enums/columns'
import { useGetData } from './hooks/useGetData'
import { DisabilityFormModal } from './modal/DisabilityFormModal'
import { disabilityService, patientService } from '../../services/api/index.js';
import { SwalManager } from '../../services/alertManagerImported';
import { useGeneratePDF } from '../documents-generation/hooks/useGeneratePDF';
import { useMassMessaging } from '../hooks/useMassMessaging';
import { useTemplate } from '../hooks/useTemplate';
import {
  formatWhatsAppMessage,
  getIndicativeByCountry,
} from '../../services/utilidades';

interface DisabilityAppProps {
  patientId: number | string;
}

const DisabilityApp: React.FC<DisabilityAppProps> = ({ patientId }) => {
  const { data, loading, error, reload } = useGetData(patientId);
  const [showDisabilityFormModal, setShowDisabilityFormModal] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [currentDisability, setCurrentDisability] = useState<any>(null);
  const { generatePDF } = useGeneratePDF();

  // WhatsApp messaging setup
  const tenant = window.location.hostname.split(".")[0];
  const templateData = {
    tenantId: tenant,
    belongsTo: "incapacidades-compartir",
    type: "whatsapp",
  };
  const { template, fetchTemplate } = useTemplate(templateData);
  const {
    sendMessage: sendMessageWpp,
    loading: loadingMessage,
  } = useMassMessaging();

  const onCreate = () => {
    setCurrentDisability(null);
    setInitialData({
      user_id: 0,
      start_date: "",
      end_date: "",
      reason: "",
      isEditing: false,
    });
    setShowDisabilityFormModal(true);
  };

  const editDisability = async (id: string) => {
    try {
      console.log('Editando discapacidad:', id);
      
      // Buscar la incapacidad en los datos actuales
      const disabilityToEdit = data.find(disability => disability.id.toString() === id);
      
      if (disabilityToEdit) {
        setCurrentDisability(disabilityToEdit);
        setInitialData({
          user_id: disabilityToEdit.user_id,
          start_date: disabilityToEdit.start_date,
          end_date: disabilityToEdit.end_date,
          reason: disabilityToEdit.reason,
          id: disabilityToEdit.id,
          isEditing: true,
        });
        setShowDisabilityFormModal(true);
      } else {
        SwalManager.error({
          title: "Error",
          text: "No se pudo encontrar la incapacidad a editar",
        });
      }
    } catch (error) {
      console.error('Error al preparar edición:', error);
      SwalManager.error({
        title: "Error",
        text: "Error al cargar los datos de la incapacidad",
      });
    }
  }

  const deleteDisability = (id: string) => {
    console.log('Eliminando discapacidad:', id)
    // Después de eliminar, podrías llamar reload() para refrescar los datos
  }

  // Función para generar PDF de incapacidad y subirlo al servidor
  async function generatePdfFile(disabilityData: any) {
    // Generar PDF de la incapacidad específica
    const disabilityHTML = `
      <div style="font-family: Arial, sans-serif; margin: 20px;">
        <h2 style="text-align: center; color: #333; margin-bottom: 20px;">Incapacidad Médica</h2>
        <p style="text-align: center; color: #666; margin-bottom: 30px;">
          Fecha de generación: ${new Date().toLocaleDateString('es-ES')}
        </p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tbody>
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold; background-color: #f8f9fa;">Médico:</td>
              <td style="border: 1px solid #ddd; padding: 12px;">${disabilityData.user?.first_name || ''} ${disabilityData.user?.last_name || ''}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold; background-color: #f8f9fa;">Especialidad:</td>
              <td style="border: 1px solid #ddd; padding: 12px;">${disabilityData.user?.specialty?.name || 'N/A'}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold; background-color: #f8f9fa;">Fecha Inicio:</td>
              <td style="border: 1px solid #ddd; padding: 12px;">${new Date(disabilityData.start_date).toLocaleDateString('es-ES')}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold; background-color: #f8f9fa;">Fecha Fin:</td>
              <td style="border: 1px solid #ddd; padding: 12px;">${new Date(disabilityData.end_date).toLocaleDateString('es-ES')}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold; background-color: #f8f9fa;">Motivo:</td>
              <td style="border: 1px solid #ddd; padding: 12px;">${disabilityData.reason || 'N/A'}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold; background-color: #f8f9fa;">Estado:</td>
              <td style="border: 1px solid #ddd; padding: 12px;">${disabilityData.is_active ? 'Activa' : 'Inactiva'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    // Generar PDF localmente primero para crear el archivo
    generatePDF({
      html: disabilityHTML,
      pdfName: `incapacidad_${disabilityData.id}_${new Date().getTime()}`,
      type: 'Impresion'
    });

    // Esperar y obtener el archivo del input hidden para subirlo al servidor
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let fileInput: any = document.getElementById(
          "pdf-input-hidden-to-Impresion"
        );
        let file = fileInput?.files[0];

        if (!file) {
          resolve(null);
          return;
        }

        let formData = new FormData();
        formData.append("file", file);
        formData.append("model_type", "App\\Models\\Disability");
        formData.append("model_id", disabilityData.id);
        //@ts-ignore
        guardarArchivo(formData, true)
          .then((response) => {
            resolve(response.file);
          })
          .catch(reject);
      }, 1500);
    });
  }

  const shareDisabilityWhatsApp = async (disabilityData: any) => {
    try {
      if (!template || !template.template) {
        SwalManager.error({
          title: "Error",
          text: "No se encontró el template de WhatsApp para incapacidades",
        });
        return;
      }

      // Obtener datos del paciente
      const patient = await patientService.get(patientId);
      
      if (!patient.whatsapp) {
        SwalManager.error({
          title: "Error",
          text: "El paciente no tiene un número de WhatsApp configurado en su perfil.",
        });
        return;
      }

      // Generar PDF y subirlo al servidor
      const dataToFile: any = await generatePdfFile(disabilityData);
      
      if (!dataToFile) {
        SwalManager.error({
          title: "Error",
          text: "No se pudo generar el archivo PDF",
        });
        return;
      }

      // Obtener URL del PDF
      //@ts-ignore
      const urlPDF = getUrlImage(dataToFile.file_url.replaceAll("\\", "/"), true);

      // Preparar reemplazos para el template
      const replacements = {
        NOMBRE_PACIENTE: `${patient.first_name || ''} ${patient.middle_name || ''} ${patient.last_name || ''} ${patient.second_last_name || ''}`.trim(),
        ESPECIALISTA: `${disabilityData.user?.first_name || ''} ${disabilityData.user?.middle_name || ''} ${disabilityData.user?.last_name || ''} ${disabilityData.user?.second_last_name || ''}`.trim(),
        ESPECIALIDAD: disabilityData.user?.specialty?.name || 'N/A',
        FECHA_INICIO: new Date(disabilityData.start_date).toLocaleDateString('es-ES'),
        FECHA_FIN: new Date(disabilityData.end_date).toLocaleDateString('es-ES'),
        MOTIVO: disabilityData.reason || 'N/A',
        ESTADO: disabilityData.is_active ? 'Activa' : 'Inactiva',
        "ENLACE DOCUMENTO": "",
      };

      // Formatear el template
      const templateFormatted = formatWhatsAppMessage(
        template.template,
        replacements
      );

      // Crear el objeto del mensaje
      const dataMessage = {
        channel: "whatsapp",
        recipients: [
          getIndicativeByCountry(patient.country_id) + patient.whatsapp,
        ],
        message_type: "media",
        message: templateFormatted,
        attachment_url: urlPDF,
        attachment_type: "document",
        minio_model_type: dataToFile?.model_type,
        minio_model_id: dataToFile?.model_id,
        minio_id: dataToFile?.id,
        webhook_url: "https://example.com/webhook",
      };

      // Enviar el mensaje
      await sendMessageWpp(dataMessage);
      
      SwalManager.success({
        title: "Éxito",
        text: "Incapacidad compartida por WhatsApp exitosamente",
      });

    } catch (error) {
      console.error('Error al compartir vía WhatsApp:', error);
      SwalManager.error({
        title: "Error",
        text: "No se pudo compartir la incapacidad vía WhatsApp",
      });
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      if (currentDisability) {
        // Actualizar incapacidad existente
        const updateData = {
          user_id: formData.user_id,
          start_date: formData.start_date,
          end_date: formData.end_date,
          reason: formData.reason,
        };
        
        await disabilityService.update(currentDisability.id, updateData);
        SwalManager.success({
          title: "Incapacidad actualizada",
        });
      } else {
        // Crear nueva incapacidad
        await disabilityService.create(patientId, formData);
        SwalManager.success({
          title: "Incapacidad creada",
        });
      }
    } catch (error) {
      console.error("Error creating/updating disability: ", error);
      SwalManager.error({
        title: "Error",
        text: "Ha ocurrido un error al procesar la solicitud",
      });
    } finally {
      setShowDisabilityFormModal(false);
      setCurrentDisability(null);
      setInitialData(null);
      await reload();
    }
  };

  const handleHideDisabilityFormModal = () => {
    setShowDisabilityFormModal(false);
    setCurrentDisability(null);
    setInitialData(null);
  };

  const generateDisabilitiesHTML = () => {
    if (!data || data.length === 0) {
      return `
        <div style="font-family: Arial, sans-serif; margin: 20px;">
          <h2 style="text-align: center; color: #333;">Reporte de Incapacidades</h2>
          <p style="text-align: center;">No hay incapacidades registradas para este paciente.</p>
        </div>
      `;
    }

    const tableRows = data.map(disability => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${(() => {
          const firstName = disability.user?.first_name || '';
          const lastName = disability.user?.last_name || '';
          const fullName = `${firstName} ${lastName}`.trim();
          return fullName || 'N/A';
        })()}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${disability.start_date || 'N/A'}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${disability.end_date || 'N/A'}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${disability.reason || 'N/A'}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${disability.is_active ? 'Activo' : 'Inactivo'}</td>
      </tr>
    `).join('');

    return `
      <div style="font-family: Arial, sans-serif; margin: 20px;">
        <h2 style="text-align: center; color: #333; margin-bottom: 20px;">Reporte de Incapacidades</h2>
        <p style="text-align: center; color: #666; margin-bottom: 30px;">
          Fecha de generación: ${new Date().toLocaleDateString('es-ES')}
        </p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Usuario</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Fecha Inicio</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Fecha Fin</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Motivo</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Estado</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        
        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
          <p>Total de incapacidades: ${data.length}</p>
        </div>
      </div>
    `;
  };

  const handlePrint = () => {
    if (!data || data.length === 0) {
      SwalManager.error({
        title: "Sin datos",
        text: "No hay incapacidades para imprimir",
      });
      return;
    }

    try {
      const html = generateDisabilitiesHTML();
      generatePDF({
        html: html,
        pdfName: `incapacidades_paciente_${patientId}_${new Date().getTime()}`,
        type: 'Impresion'
      });

      SwalManager.success({
        title: "Impresión generada",
        text: "El documento PDF ha sido generado exitosamente",
      });
    } catch (error) {
      console.error('Error al generar PDF:', error);
      SwalManager.error({
        title: "Error",
        text: "No se pudo generar el documento PDF",
      });
    }
  };

  const columns = getColumns({ editDisability, deleteDisability, handlePrint, shareDisabilityWhatsApp })

  if (!patientId) {
    return (
      <div className="alert alert-warning">
        <strong>Advertencia:</strong> No se ha proporcionado un ID de paciente. 
        Por favor, asegúrese de que la URL incluya el parámetro <code>patient_id</code> o <code>id</code>.
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <strong>Error:</strong> {error}
        <button 
          className="btn btn-sm btn-outline-danger ms-2" 
          onClick={reload}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      <PrimeReactProvider
        value={{
          appendTo: "self",
          zIndex: {
            overlay: 100000,
          },
        }}
      >
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-1">Incapacidades</h4>
            <div className="text-end mb-2">
              <div className="d-flex gap-2">
                {/* <button
                  className="btn btn-primary d-flex align-items-center"
                  onClick={onCreate}
                >
                  <i className="fas fa-plus me-2"></i>
                  Nueva Incapacidad
                </button> */}
              </div>
            </div>
          </div>
          
          <DisabilityTable 
            data={data} 
            columns={columns} 
            loading={loading}
            onReload={reload}
          />

          <DisabilityFormModal
            title={currentDisability ? "Editar Incapacidad" : "Crear Incapacidad"}
            show={showDisabilityFormModal}
            handleSubmit={handleSubmit}
            onHide={handleHideDisabilityFormModal}
            initialData={initialData}
          />
        </div>
      </PrimeReactProvider>
    </>
  )
}

export default DisabilityApp
