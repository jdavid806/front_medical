import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { useSocket } from '../hooks/useSocket';
import { VideoConsultaModalProps } from '../interfaces/VideoConsultationTypes';

export const VideoConsultationModal: React.FC<VideoConsultaModalProps> = ({ visible, onHide, cita }) => {
    const [roomId, setRoomId] = useState('');
    const [roomLink, setRoomLink] = useState('');
    const socket = useSocket();

    useEffect(() => {
        if (visible && socket) {
            // Configurar eventos de socket
            // socket.on('room-created', (newRoomId: string) => {
            //     setRoomId(newRoomId);
            //     setRoomLink(`${window.location.origin}/video-llamada?roomId=${newRoomId}`);
            // });
        }

        return () => {
            // if (socket) {
            //     socket.off('room-created');
            // }
        };
    }, [visible, socket]);

    const crearSala = () => {
        const newRoomId = Math.random().toString(36).substring(2, 10).toUpperCase();
        setRoomId(newRoomId);
        setRoomLink(`${window.location.origin}/video-llamada?roomId=${newRoomId}`);

        // if (socket) {
        //     socket.emit('create-room', 'doctor');
        // }
    };

    const copiarEnlace = () => {
        navigator.clipboard.writeText(roomLink)
            .then(() => {
                // Mostrar notificación de éxito
            })
            .catch(err => console.error('Error al copiar:', err));
    };

    const footerContent = (
        <div>
            <Button label="Cerrar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
        </div>
    );

    return (
        <Dialog
            header={<><i className="pi pi-video mr-2"></i> Video Consulta</>}
            visible={visible}
            style={{ width: '90vw', maxWidth: '700px' }}
            footer={footerContent}
            onHide={onHide}
            className="video-consultation-modal"
        >
            <Card className="border-0">
                {cita && (
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="d-flex align-items-center mb-3">
                                <Avatar icon="pi pi-user" size="large" shape="circle" className="mr-3 bg-primary" />
                                <div>
                                    <h4 className="mb-0">{cita.paciente}</h4>
                                    <small className="text-muted">Paciente</small>
                                </div>
                            </div>
                            <p><i className="pi pi-calendar mr-2"></i> <strong>Fecha:</strong> {cita.fecha}</p>
                            <p><i className="pi pi-phone mr-2"></i> <strong>Teléfono:</strong> {cita.telefono}</p>
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex align-items-center mb-3">
                                <Avatar icon="pi pi-user-md" size="large" shape="circle" className="mr-3 bg-info" />
                                <div>
                                    <h4 className="mb-0">{cita.doctor}</h4>
                                    <small className="text-muted">Médico</small>
                                </div>
                            </div>
                            <p><i className="pi pi-inbox mr-2"></i> <strong>Correo:</strong> {cita.correo}</p>
                            <p><i className="pi pi-comment mr-2"></i> <strong>Motivo:</strong> {cita.motivo}</p>
                        </div>
                    </div>
                )}

                <Divider />

                <div className="row mt-4">
                    <div className="col-md-6 mb-3">
                        <h5><i className="pi pi-key mr-2"></i> Código de sala</h5>
                        <div className="p-3 bg-gray-100 border-round">
                            <span className={roomId ? 'text-primary font-bold text-xl' : 'text-color-secondary'}>
                                {roomId || 'Presiona "Crear sala" para generar un código'}
                            </span>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <h5><i className="pi pi-info-circle mr-2"></i> Estado</h5>
                        <div className="d-flex align-items-center">
                            <span className={`badge ${roomId ? 'bg-success' : 'bg-secondary'} me-2`}>
                                {roomId ? "Abierta" : "No creada"}
                            </span>
                        </div>
                        <p className="text-sm text-color-secondary mt-2">
                            <i className="pi pi-clock mr-1"></i> Apertura: {new Date().toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-12">
                        <div className="bg-blue-50 p-3 border-round text-sm">
                            <i className="pi pi-info-circle mr-2 text-blue-500"></i>
                            Esta información junto con el enlace para ingresar a la sala será enviada por correo
                            electrónico a <strong>{cita?.correo || 'user@test.com'}</strong> y por WhatsApp a <strong>{cita?.telefono || '96385214'}</strong>
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-md-4 mb-2">
                        <Button
                            icon="pi pi-plus"
                            label="Crear sala"
                            className="w-full"
                            onClick={crearSala}
                            disabled={!!roomId}
                        />
                    </div>
                    <div className="col-md-4 mb-2">
                        <Button
                            icon="pi pi-sign-in"
                            label="Entrar"
                            className="p-button-outlined p-button-primary w-full"
                            disabled={!roomId}
                        />
                    </div>
                    <div className="col-md-4 mb-2">
                        <Button
                            icon="pi pi-link"
                            label="Copiar enlace"
                            className="p-button-outlined p-button-help w-full"
                            onClick={copiarEnlace}
                            disabled={!roomId}
                        />
                    </div>
                </div>
            </Card>
        </Dialog>
    );
};