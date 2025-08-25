import React, { useEffect, useRef, useState } from 'react'
import { PrimeReactProvider } from "primereact/api";
import  DisabilityTable  from './components/DisabilityTable.js'
import { getColumns } from './enums/columns.js'
import { useGetData } from './hooks/useGetData.js'
import { DisabilityFormModal } from './modal/DisabilityFormModal.js'
import { disabilityService, patientService } from '../../services/api/index.js';
import { SwalManager } from '../../services/alertManagerImported';
import { useGeneratePDF } from '../documents-generation/hooks/useGeneratePDF';
import { useMassMessaging } from '../hooks/useMassMessaging';
import { useTemplate } from '../hooks/useTemplate';
import { generarFormato } from "../../funciones/funcionesJS/generarPDF.js";
import { sendMessageWhatsapp } from './utils/sendWassap.js';

import { DisabilityData } from './enums/DisabilityData.js';

interface ConsentimientoAppProps {
  patientId: number | string;
}

const ConsentimientoApp: React.FC<ConsentimientoAppProps> = ({ patientId }) => {
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

  const sendMessageWppRef = useRef(sendMessageWpp);

  useEffect(() => {
    sendMessageWppRef.current = sendMessageWpp;
  }, [sendMessageWpp]);

  useEffect(() => {
    console.log('ioiopipoiopipoiopipoipoipoopppo', data);
    if (data.length > 0) {
      const element = document.getElementById('nombre-paciente');
      console.log('element', element);
      console.log('data', data[0].user.first_name + ' ' + data[0].user.last_name);
      if (element) {
        element.textContent = data[0].user.first_name + ' ' + data[0].user.last_name;
      }
    }
  }, [data]);

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


  const shareDisabilityWhatsApp = async (id: string) => {
    try {
      if (!template || !template.template) {
        SwalManager.error({
          title: "Error",
          text: "No se encontró el template de WhatsApp para incapacidades",
        });
        return;
      }

      const disability = data.find((disability: DisabilityData) => disability.id.toString() === id);
      sendMessageWhatsapp(disability, template, sendMessageWppRef)


    } catch (error) {
      console.error("Error al enviar el mensaje de WhatsApp: ", error);
      SwalManager.error({
        title: "Error",
        text: "Ha ocurrido un error al enviar el mensaje de WhatsApp",
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

//  generarFormato("Incapacidad", disabilityData, "Impresion")
  const handlePrint = (id: string) => {
    if (!data || data.length === 0) {
      SwalManager.error({
        title: "Sin datos",
        text: "No hay incapacidades para imprimir",
      });
      return;
    }
    const disability = data.find((disability: DisabilityData) => disability.id.toString() === id);
    generarFormato("Incapacidad", disability, "Impresion")
  };

  const columns = getColumns({ editDisability, handlePrint, shareDisabilityWhatsApp })

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
            <h2 className="mb-1">Incapacidades</h2>
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

export default ConsentimientoApp
