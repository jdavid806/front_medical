import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { CreateWhatsAppInstanceForm, CreateWhatsAppInstanceFormInputs } from './CreateWhatsAppInstanceForm';
import { useCreateEAInstance } from './hooks/useCreateEAInstance'; import { SwalManager } from '../../services/alertManagerImported';
import { PrimeReactProvider } from 'primereact/api';
import { useCompanyCommunication } from '../config/company-configuration/hooks/useCompanyCommunication';

export const BtnCreateWhatsAppInstance = ({ onSave }: { onSave?: () => void }) => {
    const [visible, setVisible] = useState(false);
    const { createEAInstance } = useCreateEAInstance();
    const { saveCommunication } = useCompanyCommunication();

    const formId = "create-whatsapp-instance-form";

    const handleCreateEAInstance = async (data: CreateWhatsAppInstanceFormInputs) => {
        try {
            const response = await createEAInstance(data.instanceName);
            console.log("response", response);

            if (response.status == 403) {
                SwalManager.error({
                    title: "Error",
                    text: "El nombre de la instancia ya existe"
                });
                return;
            }

            await saveCommunication({
                api_key: response.hash || 'oEQ0j9ft1FX43QkGLDCEM0arw',
                instance: data.instanceName,
                email: "",
                password: "",
                smtp_server: "",
                port: 587,
                security: "tls"
            });

            SwalManager.success('Instancia creada correctamente');

            onSave?.();

            setVisible(false);


            // Recargar la página para actualizar el estado
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (error) {
            console.error('Error creating instance:', error);
            SwalManager.error('Error al crear la instancia');
        }
    };

    return (
        <>
            <PrimeReactProvider value={{
                zIndex: {
                    modal: 1055
                }
            }}>
                <button
                    className='btn btn-primary'
                    onClick={() => { setVisible(true) }}
                >
                    <i className="fas fa-plus-circle"></i> Crear conexión con WhatsApp
                </button>
                <Dialog
                    header="Crear nueva instancia de WhatsApp"
                    visible={visible}
                    onHide={() => setVisible(false)}
                    maximizable
                    modal
                    dismissableMask
                    style={{ width: '50vw' }}
                >
                    <CreateWhatsAppInstanceForm formId={formId} onSubmit={handleCreateEAInstance} />
                    <div className="d-flex justify-content-end gap-2">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setVisible(false)}
                        >
                            <i className="fas fa-arrow-left"></i> Cerrar
                        </button>
                        <button
                            className="btn btn-primary"
                            form={formId}
                        >
                            <i className="fas fa-save"></i> Guardar
                        </button>
                    </div>
                </Dialog>
            </PrimeReactProvider>
        </>
    );
};