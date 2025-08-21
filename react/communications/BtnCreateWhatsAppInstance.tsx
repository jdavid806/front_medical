import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { CreateWhatsAppInstanceForm, CreateWhatsAppInstanceFormInputs } from './CreateWhatsAppInstanceForm';
import { useCreateEAInstance } from './hooks/useCreateEAInstance';
import { SwalManager } from '../../services/alertManagerImported';
import { PrimeReactProvider } from 'primereact/api';

export const BtnCreateWhatsAppInstance = () => {

    const [visible, setVisible] = useState(false);
    const { createEAInstance } = useCreateEAInstance();

    const formId = "create-whatsapp-instance-form";

    const handleCreateEAInstance = async (data: CreateWhatsAppInstanceFormInputs) => {
        try {
            const response = await createEAInstance(data.instanceName)
            console.log("response", response);

            if (response.status == 403) {
                SwalManager.error({
                    title: "Error",
                    text: "El nombre de la instancia ya existe"
                })

                return
            }

            const id = (document.getElementById("smtpId") as HTMLInputElement)?.value;

            if (id) {
                await updateSmtp({
                    api_key: response.hash,
                    instance: data.instanceName
                })
            } else {
                await createSmtp({
                    api_key: response.hash,
                    instance: data.instanceName,
                    email: "",
                    password: "",
                    smtp_server: "",
                    port: 0,
                    security: ""
                })
            }

            await consultarQR();
            await cargarDatosTenant();

            const modalVerQR = document.getElementById("modalButton");

            if (modalVerQR) {
                modalVerQR.click();
            } else {
                throw new Error("No se pudo encontrar el modal para visualizar el QR");
            }

            setVisible(false);
        } catch (error) { }
    }

    return <>
        <PrimeReactProvider value={{
            zIndex: {
                modal: 1055
            }
        }}>
            <button
                className='btn btn-primary'
                onClick={() => { setVisible(true) }}
            >
                <i className="fas fa-times-circle"></i> Crear conexión con WhatsApp
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
    </>;
};