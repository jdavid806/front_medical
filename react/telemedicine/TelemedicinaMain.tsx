import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Badge } from 'primereact/badge';
import { Tooltip } from 'primereact/tooltip';
import { CitaTelemedicina } from './interfaces/TelemedicinaTypes';
import { RecordingModal } from './modals/RecordingModal';
import { VideoConsultationModal } from './modals/VideoConsultationModal';
import { ReportModal } from './modals/ReportModal';
import { classNames } from 'primereact/utils';

export const TelemedicinaMain: React.FC = () => {
    const [citas] = useState<CitaTelemedicina[]>([
        {
            id: 1,
            doctor: "Juan Pérez",
            fecha: "2025-10-18",
            paciente: "Camilo Cruz",
            telefono: "555-1234",
            correo: "juan.perez@example.com",
            motivo: "Consulta general",
            estado: 'pendiente'
        },
        {
            id: 2,
            doctor: "María García",
            fecha: "2025-10-19",
            paciente: "Ana López",
            telefono: "555-5678",
            correo: "maria.garcia@example.com",
            motivo: "Seguimiento tratamiento",
            estado: 'confirmada'
        },
        {
            id: 3,
            doctor: "Carlos Rodríguez",
            fecha: "2025-10-20",
            paciente: "Luis Martínez",
            telefono: "555-9012",
            correo: "carlos.rodriguez@example.com",
            motivo: "Segunda opinión",
            estado: 'completada'
        }
    ]);

    const [modalVideoVisible, setModalVideoVisible] = useState(false);
    const [modalGrabacionVisible, setModalGrabacionVisible] = useState(false);
    const [modalReporteVisible, setModalReporteVisible] = useState(false);
    const [citaSeleccionada, setCitaSeleccionada] = useState<CitaTelemedicina | null>(null);

    const items = [
        { label: 'Inicio', url: '/portada' },
        { label: 'Citas telemedicina', url: '' }
    ];

    const home = { icon: 'pi pi-home', url: '/' };

    const estadoBodyTemplate = (rowData: CitaTelemedicina) => {
        return (
            <Badge
                value={rowData.estado}
                severity={
                    rowData.estado === 'pendiente' ? 'warning' :
                        rowData.estado === 'confirmada' ? 'info' :
                            rowData.estado === 'completada' ? 'success' : 'danger'
                }
                className="text-capitalize"
            />
        );
    };

    const accionesBodyTemplate = (rowData: CitaTelemedicina) => {
        return (
            <div className="d-flex flex-column gap-2">

                <Button
                    icon={<i className="fa-solid fa-calendar"></i>}
                    className="p-button-outlined p-button-success mb-1 btn-iniciar"
                    label="Iniciar video"
                    onClick={() => {
                        setCitaSeleccionada(rowData);
                        setModalVideoVisible(true);
                    }}
                />
                <Button
                    icon={<i className="fa-solid fa-calendar"></i>}
                    className="p-button-outlined p-button-danger mb-1 btn-no-asistio"
                    label="No asistió"
                />
                <Button
                    icon={<i className="fa-solid fa-video"></i>}
                    className="p-button-outlined p-button-info btn-grabaciones"
                    label="Grabaciones"
                    onClick={() => {
                        setCitaSeleccionada(rowData);
                        setModalGrabacionVisible(true);
                    }}
                />
            </div>
        );
    };

    return (
        <div className="container-fluid mt-3">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="mb-0 text-primary">Citas de Telemedicina</h2>
                        <Button
                            icon="pi pi-file-pdf"
                            label="Generar Reporte"
                            className="p-button-outlined p-button-help"
                            onClick={() => setModalReporteVisible(true)}
                        />
                    </div>

                    <Card className="shadow-sm border-0">
                        <DataTable
                            value={citas}
                            responsiveLayout="stack"
                            breakpoint="960px"
                            paginator
                            rows={5}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="p-datatable-sm p-datatable-striped p-datatable-gridlines"
                            emptyMessage="No se encontraron citas"
                        >
                            <Column field="doctor" header="Doctor" sortable filter></Column>
                            <Column field="fecha" header="Fecha" sortable></Column>
                            <Column field="paciente" header="Paciente" sortable filter></Column>
                            <Column field="telefono" header="Teléfono"></Column>
                            <Column field="correo" header="Correo"></Column>
                            <Column field="motivo" header="Motivo"></Column>
                            <Column field="estado" header="Estado" body={estadoBodyTemplate} sortable></Column>
                            <Column body={accionesBodyTemplate} header="Acciones" exportable={false} style={{ minWidth: '200px' }}></Column>
                        </DataTable>
                    </Card>
                </div>
            </div>

            <VideoConsultationModal
                visible={modalVideoVisible}
                onHide={() => setModalVideoVisible(false)}
                cita={citaSeleccionada}
            />

            <RecordingModal
                visible={modalGrabacionVisible}
                onHide={() => setModalGrabacionVisible(false)}
                cita={citaSeleccionada}
            />

            <ReportModal
                visible={modalReporteVisible}
                onHide={() => setModalReporteVisible(false)}
            />
        </div>
    );
};

export default TelemedicinaMain;