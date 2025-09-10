import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FileUpload } from 'primereact/fileupload';
import { Tooltip } from 'primereact/tooltip';
import { Grabacion, GrabacionModalProps } from '../interfaces/RecordingType';

export const RecordingModal: React.FC<GrabacionModalProps> = ({ visible, onHide, cita }) => {
    const [grabaciones, setGrabaciones] = useState<Grabacion[]>([
        { id: 1, fecha: '2025-10-16 10:30:45', nombre: 'Consulta completa', archivo: 'grabacion1.mp4' },
        { id: 2, fecha: '2025-10-16 10:45:22', nombre: 'Segmento importante', archivo: 'grabacion2.mp4' }
    ]);

    const accionesBodyTemplate = (rowData: Grabacion) => {
        return (
            <div className="d-flex justify-content-center">
                <Tooltip target=".view-btn" content="Ver grabación" />
                <Tooltip target=".download-btn" content="Descargar" />
                <Tooltip target=".delete-btn" content="Eliminar" />

                <Button icon="pi pi-eye" className="p-button-rounded p-button-text p-button-info view-btn mr-1" />
                <Button icon="pi pi-download" className="p-button-rounded p-button-text p-button-success download-btn mr-1" />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger delete-btn" />
            </div>
        );
    };

    const fechaBodyTemplate = (rowData: Grabacion) => {
        return new Date(rowData.fecha).toLocaleString();
    };

    const footerContent = (
        <div>
            <Button label="Cerrar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
        </div>
    );

    return (
        <Dialog
            header={<><i className="pi pi-cloud-upload mr-2"></i> Gestión de Grabaciones</>}
            visible={visible}
            style={{ width: '90vw', maxWidth: '900px' }}
            footer={footerContent}
            onHide={onHide}
            className="recording-modal"
        >
            {cita && (
                <Card className="mb-4 border-0" title="Información de la cita">
                    <div className="row">
                        <div className="col-md-6">
                            <p><i className="pi pi-ticket mr-2"></i> <strong>ID Cita:</strong> {cita.id}</p>
                            <p><i className="pi pi-calendar mr-2"></i> <strong>Fecha:</strong> {cita.fecha}</p>
                        </div>
                        <div className="col-md-6">
                            <p><i className="pi pi-user mr-2"></i> <strong>Paciente:</strong> {cita.paciente}</p>
                            <p><i className="pi pi-user-md mr-2"></i> <strong>Médico:</strong> {cita.doctor}</p>
                        </div>
                    </div>
                </Card>
            )}

            <Card title={<><i className="pi pi-upload mr-2"></i> Subir nueva grabación</>} className="mb-4 border-0">
                <FileUpload
                    mode="advanced"
                    name="grabacion"
                    url="/api/upload"
                    accept="video/*"
                    maxFileSize={100000000}
                    chooseLabel="Seleccionar archivo"
                    uploadLabel="Subir"
                    cancelLabel="Cancelar"
                    customUpload
                    className="w-full"
                    emptyTemplate={<p className="m-0">Arrastra y suelta un archivo de video aquí.</p>}
                />
            </Card>

            <Card title={<><i className="pi pi-list mr-2"></i> Grabaciones existentes</>} className="border-0">
                <DataTable value={grabaciones} responsiveLayout="stack" breakpoint="768px" className="p-datatable-sm">
                    <Column field="fecha" header="Fecha" body={fechaBodyTemplate} sortable></Column>
                    <Column field="nombre" header="Nombre" sortable></Column>
                    <Column body={accionesBodyTemplate} header="Acciones" style={{ width: '150px' }}></Column>
                </DataTable>
            </Card>
        </Dialog>
    );
};